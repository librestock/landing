resource "cloudflare_record" "landing_www" {
  zone_id = var.cloudflare_zone_id
  name    = local.landing_record_name
  content = local.landing_github_pages_target
  type    = "CNAME"
  ttl     = 1
  proxied = false
  comment = "Managed by terraform (stocket landing GitHub Pages)"
}

resource "cloudflare_record" "landing_apex_ipv4" {
  for_each = local.github_pages_ipv4_addresses

  zone_id = var.cloudflare_zone_id
  name    = local.landing_apex_record_name
  content = each.key
  type    = "A"
  ttl     = 1
  proxied = false
  comment = "Managed by terraform (stocket landing GitHub Pages)"
}

resource "cloudflare_record" "landing_apex_ipv6" {
  for_each = local.github_pages_ipv6_addresses

  zone_id = var.cloudflare_zone_id
  name    = local.landing_apex_record_name
  content = each.key
  type    = "AAAA"
  ttl     = 1
  proxied = false
  comment = "Managed by terraform (stocket landing GitHub Pages)"
}
