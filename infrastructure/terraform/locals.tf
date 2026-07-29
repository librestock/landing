locals {
  cloudflare_zone_name        = trimsuffix(var.cloudflare_zone_name, ".")
  landing_hostname            = trimsuffix(var.landing_hostname, ".")
  landing_apex_hostname       = trimsuffix(var.landing_apex_hostname, ".")
  landing_github_pages_target = trimsuffix(var.landing_github_pages_target, ".")

  landing_record_name = (
    local.landing_hostname == local.cloudflare_zone_name
    ? "@"
    : trimsuffix(local.landing_hostname, ".${local.cloudflare_zone_name}")
  )
  landing_apex_record_name = (
    local.landing_apex_hostname == local.cloudflare_zone_name
    ? "@"
    : trimsuffix(local.landing_apex_hostname, ".${local.cloudflare_zone_name}")
  )

  github_pages_ipv4_addresses = toset([
    "185.199.108.153",
    "185.199.109.153",
    "185.199.110.153",
    "185.199.111.153",
  ])
  github_pages_ipv6_addresses = toset([
    "2606:50c0:8000::153",
    "2606:50c0:8001::153",
    "2606:50c0:8002::153",
    "2606:50c0:8003::153",
  ])
}

check "landing_hostnames_belong_to_zone" {
  assert {
    condition = alltrue([
      for hostname in [local.landing_hostname, local.landing_apex_hostname] :
      hostname == local.cloudflare_zone_name || endswith(hostname, ".${local.cloudflare_zone_name}")
    ]) && local.landing_hostname != local.landing_apex_hostname
    error_message = "landing_hostname and landing_apex_hostname must be distinct and belong to cloudflare_zone_name."
  }
}
