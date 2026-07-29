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
