# Stocket landing

Static GitHub Pages marketing site for `www.stocket.fr` and `stocket.fr`.

The hosted inventory product is maintained separately in the private `stocketfr/stocket` monorepo. This repository owns only the marketing site and its landing DNS declarations under [`infrastructure/terraform`](infrastructure/terraform/README.md).

## Local preview

Serve the repository root with any static file server; no build step is required.

## Validation

Install the pinned toolchain and run the same structural HTML, link, workflow-policy, accessibility, and browser checks used by CI:

```sh
pnpm install --frozen-lockfile
pnpm exec playwright install chromium
pnpm check
```

## Publication safety

The `publish-pages` job can run only from `main`, after both validation jobs pass, and when the repository variable `PAGES_ACTIONS_DEPLOYMENT_APPROVED` is exactly `true`. The variable is intentionally absent while production Pages remains on its legacy branch-based source. Do not create the variable or change the Pages source without separate approval.

## Infrastructure safety

Landing Terraform uses a separate state contract from hosted-product infrastructure. CI validates source without a backend and never plans or applies production changes. Follow the state-transfer runbook before using the destination workspace.

## Licensing

Stocket-original materials in this repository are proprietary and all rights
reserved to Maximilian (`maximilianpw`). Repository visibility does not grant
permission to use, modify, redistribute, or host those proprietary materials.
Third-party and historical materials remain subject to their own licenses. See
[LICENSE](LICENSE), [NOTICE](NOTICE), and
[THIRD_PARTY_NOTICES](THIRD_PARTY_NOTICES). Unsolicited external code,
documentation, design, and asset contributions are not accepted without a
written contribution agreement.
