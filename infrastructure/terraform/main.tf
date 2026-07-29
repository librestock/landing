terraform {
  required_version = ">= 1.7.0, < 2.0.0"

  cloud {
    organization = "maximilianpw-org"

    workspaces {
      name = "stocket-landing"
    }
  }

  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "4.52.7"
    }
  }
}

provider "cloudflare" {
  api_token = var.cloudflare_api_token
}

data "cloudflare_zone" "landing" {
  zone_id = var.cloudflare_zone_id
}

check "cloudflare_zone_id_matches_name" {
  assert {
    condition     = trimsuffix(data.cloudflare_zone.landing.name, ".") == local.cloudflare_zone_name
    error_message = "cloudflare_zone_id must identify cloudflare_zone_name."
  }
}
