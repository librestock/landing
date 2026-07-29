output "urls" {
  description = "Landing URLs managed by this Terraform root."
  value = {
    landing = "https://${local.landing_hostname}"
    apex    = "https://${local.landing_apex_hostname}"
  }
}
