#!/bin/sh
set -eu

terraform_root=$(CDPATH='' cd -- "$(dirname -- "$0")/.." && pwd)
repo_root=$(CDPATH='' cd -- "$terraform_root/../.." && pwd)
manifest=$terraform_root/state-ownership.json

fail() {
  echo "landing infrastructure source boundary check failed: $*" >&2
  exit 1
}

for command_name in git jq; do
  command -v "$command_name" >/dev/null 2>&1 || fail "missing command: $command_name"
done

files=$(CDPATH='' cd -- "$repo_root" && git ls-files -co --exclude-standard infrastructure/terraform)
[ -n "$files" ] || fail "no landing infrastructure source files found"
printf '%s\n' "$files" | while IFS= read -r path; do
  case $path in
    */.terraform/*|*.tfstate|*.tfstate.*|*/terraform.tfvars|*.auto.tfvars|*.tfvars.json|*.tfplan|*/crash.log|*/crash.*.log|*/.envrc|*/.envrc.local)
      fail "forbidden runtime/state/credential path is tracked: $path"
      ;;
  esac
done

actual_resources=$(grep -h -E '^resource "' "$terraform_root"/*.tf | sed -E 's/^resource "([^"]+)" "([^"]+)" \{$/\1.\2/' | LC_ALL=C sort)
expected_resources=$(cat <<'EOF'
cloudflare_record.landing_apex_ipv4
cloudflare_record.landing_apex_ipv6
cloudflare_record.landing_www
EOF
)
[ "$actual_resources" = "$expected_resources" ] || {
  printf '%s\n' "unexpected resource declarations:" "$actual_resources" >&2
  fail "only the three landing DNS resource families are allowed"
}

if grep -R -n -E '(hcloud_|cloudflare_r2_|resend_|tenant_|platform_|deploy_)' \
  "$terraform_root" --include='*.tf'; then
  fail "hosted-product infrastructure leaked into the landing root"
fi

jq -e '
  .schemaVersion == 1
  and .stateSplitStatus == "planned-not-executed"
  and .sourceRepository == "stocketfr/landing"
  and .hcpWorkspace == "stocket-landing"
  and .remoteStateMutatedByThisChange == false
  and (.stateAddresses | length) == 9
  and (.stateAddresses | length) == (.stateAddresses | unique | length)
' "$manifest" >/dev/null || fail "invalid landing state ownership manifest"

grep -Fq 'version = "4.52.7"' "$terraform_root/main.tf" ||
  fail "Cloudflare provider must remain pinned to 4.52.7 during the split"
grep -Fq 'version     = "4.52.7"' "$terraform_root/.terraform.lock.hcl" ||
  fail "provider lock does not contain Cloudflare 4.52.7"

cname_hostname=$(tr -d '\r\n' < "$repo_root/CNAME")
terraform_hostname=$(sed -n '/^variable "landing_hostname" {$/,/^}$/p' "$terraform_root/variables.tf" | awk -F'"' '/^[[:space:]]*default[[:space:]]*=/{print $2}')
[ -n "$terraform_hostname" ] && [ "$cname_hostname" = "$terraform_hostname" ] ||
  fail "CNAME and Terraform landing_hostname default must agree"

printf '%s\n' "Landing Terraform ownership, state exclusions, and provider pin passed"
