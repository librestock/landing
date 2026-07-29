variable "cloudflare_api_token" {
  description = "Cloudflare API token restricted to DNS edits and zone reads for the landing zone."
  type        = string
  sensitive   = true
}

variable "cloudflare_zone_id" {
  description = "Cloudflare zone ID that contains the landing hostnames."
  type        = string
}

variable "cloudflare_zone_name" {
  description = "Cloudflare parent zone name."
  type        = string
  default     = "stocket.fr"
}

variable "landing_hostname" {
  description = "Marketing hostname served by GitHub Pages."
  type        = string
  default     = "www.stocket.fr"
}

variable "landing_apex_hostname" {
  description = "Apex hostname served by GitHub Pages."
  type        = string
  default     = "stocket.fr"
}

variable "landing_github_pages_target" {
  description = "GitHub Pages default host for the landing repository, without a repository path."
  type        = string
  default     = "stocketfr.github.io"
}
