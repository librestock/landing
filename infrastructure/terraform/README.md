# Landing DNS infrastructure

This Terraform root is the sole declarative owner of DNS records that route the separate Stocket marketing site to GitHub Pages:

- `cloudflare_record.landing_www`
- `cloudflare_record.landing_apex_ipv4` (four instances)
- `cloudflare_record.landing_apex_ipv6` (four instances)

Hosted-product infrastructure remains in the private `stocketfr/stocket` monorepo. Do not add application, tenant, deploy, email, R2, compute, or database resources here.

## State and authority

The destination state contract is HCP Terraform organization `maximilianpw-org`, workspace `stocket-landing`. The existing records are still held by the mixed `stocket-infrastructure` state until the reviewed split procedure in `stocket/ops/infrastructure/docs/landing-state-split.md` is separately approved and executed.

Until that procedure is complete:

- do not run `terraform apply` from this root;
- do not import, recreate, or delete the live records manually;
- use CI only for formatting, initialization without a backend, and validation.

After the state split is verified, production plans and applies require protected operator credentials and review. State, `.terraform`, credentials, plans, and real variable files must never be committed.

## Static validation

```sh
terraform fmt -check -recursive
terraform init -backend=false -input=false -lockfile=readonly
terraform validate
bash tests/source-boundary.spec.sh
```

[`state-ownership.json`](state-ownership.json) records the exact nine destination addresses and remains `planned-not-executed` until the operator transfer is verified. The provider remains exactly `cloudflare/cloudflare` `4.52.7` during the split so ownership transfer is not combined with a provider upgrade.
