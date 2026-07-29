# Stocket landing

Static GitHub Pages marketing site for `www.stocket.fr` and `stocket.fr`.

The hosted inventory product is maintained separately in the private `stocketfr/stocket` monorepo. This repository owns only the marketing site and its landing DNS declarations under [`infrastructure/terraform`](infrastructure/terraform/README.md).

## Local preview

Serve the repository root with any static file server; no build step is required.

## Infrastructure safety

Landing Terraform uses a separate state contract from hosted-product infrastructure. CI validates source without a backend and never plans or applies production changes. Follow the state-transfer runbook before using the destination workspace.
