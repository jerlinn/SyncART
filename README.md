# LunaWake website

Link：https://jerlinn.github.io/SyncART/

This repository contains the public LunaWake website and its tracked launch assets.

## Project Overview

Do not use historical website copy, Coach/Dawn demos, audio test fixtures, or legacy CSS as product requirements. The current product definition lives in the `Lunawake-wiki` repository:

- `wiki/summaries/device-interaction-spec.md`
- `wiki/summaries/state-machine-spec.md`
- `refs/01-capability/firmware.md`
- `refs/Lunawake-用户旅程与设备反应.md`

Key boundary: the microphones provide passive acoustic sensing only. LunaWake does not provide voice commands, text-to-speech, or conversation. The Luna App is the configuration and presentation layer; physical device controls remain authoritative.

Raw source image and video libraries are kept locally under ignored paths and are not deployment assets. Any page reference to those files must be replaced with a tracked, deployable asset before publishing.

## CSS workflow

`styles.css` and `legal-pages.css` are **minified build outputs** — do not edit them directly.
Edit `styles.src.css` / `legal-pages.src.css`, then regenerate and commit both files:

```bash
npx --yes csso-cli styles.src.css -o styles.css
npx --yes csso-cli legal-pages.src.css -o legal-pages.css
```

When shipping CSS/JS changes, bump the shared cache-bust token (`?v=2026-08-01b`) in every
HTML file in the same commit: `grep -rln 'v=2026-' *.html signup/index.html`.

Note: `signup/index.html` intentionally uses a meta-refresh redirect — GitHub Pages cannot
issue server-side redirects to external hosts. It is `noindex` and excluded from Lighthouse audits.

## Features

- Responsive design for all devices
- Mobile-first approach
- Interactive FAQ system
- Support ticket system
- Region selector functionality

## Reservation page handoff

The reservation page lives at `deposit.html` and uses `js/deposit.js` as the
single offer data source for finish selection, deposit credit, price status,
refund policy, availability, and Shopify Checkout redirects. Before launch,
add the real Shopify-hosted Checkout URL for each finish. Empty or unavailable
values intentionally keep the reservation button disabled so the static site
cannot send customers to an unconfigured payment destination.

The current offer charges $10 and promises $50 in Launch Credit. Shopify must
issue or associate that $50 credit with the reservation customer; the static
page only communicates the offer and cannot provision account credit itself.
