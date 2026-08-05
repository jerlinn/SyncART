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

When shipping CSS/JS changes, bump the shared cache-bust token (`?v=2026-08-01d`) in every
HTML file in the same commit: `grep -rln 'v=2026-' *.html signup/index.html`.

Note: `signup/index.html` intentionally uses a meta-refresh redirect — GitHub Pages cannot
issue server-side redirects to external hosts. It is `noindex` and excluded from Lighthouse audits.

## Features

- Responsive design for all devices
- Mobile-first approach
- Interactive FAQ system
- Support ticket system
- Region selector functionality

## Shopify deposit page handoff

`deposit.html` is a local Shopify-ready preview, not the production deposit
page. Production payment is handled by a standalone Shopify product page. The
preview uses `js/deposit.js` as its configuration source for campaign state,
locked/unlocked Reward pricing, the fixed $9 deposit, Shopify product URL,
launch-list URL, support URL, and price-window status.

Before launch, map these values to Shopify theme settings or metafields:

- Shopify product URL for the $9 deposit product;
- launch-list URL for the preview state (defaults to `https://prelaunch.lunawake.ai/`);
- campaign state (`reservation_open`, `kickstarter_live`, `campaign_success`,
  or `campaign_failed`);
- the three Reward price windows ($229 founding / $269 next window / $319
  launch-day) and their dates after pricing tests are complete;
- post-purchase email and deposit-user-group invite configuration.

For a static deployment, define `window.LUNAWAKE_DEPOSIT_CONFIG` before
`js/deposit.js` to override the same fields without editing the page structure.
At minimum, set `shopifyProductUrl` only after the $9 product is live and
checkout-tested. Keep `pricingUnlocked: false` until the pricing test is
approved. When `shopifyProductUrl` is empty, every reservation CTA remains
clickable and sends the visitor to `launchListUrl`; it never shows a disabled
checkout button. In that preview state, elements marked `data-state-copy` are
rewritten from payment language ("Due today $9") into waitlist language
("Reservations open soon"); injecting a real `shopifyProductUrl` restores the
payment copy automatically — the HTML source always carries the live-state
strings.

The preview intentionally does not create a fake checkout, cross-platform
Kickstarter credit, or local user account. The $9 reservation holds the
founding price; the later product order is completed through the personal link
sent on launch day.

For the 2,000-lead rollout sequence, UTM naming, cohort split, KPI definitions,
and the Shopify launch gate, see
[`deliverables/leads-to-deposit-launch-plan.md`](deliverables/leads-to-deposit-launch-plan.md).

Before sending traffic, run the production checks in
[`deliverables/deposit-release-gate.md`](deliverables/deposit-release-gate.md).

The ready-to-use Lead email, Group copy, UTM links, and rollout sequence are in
[`deliverables/deposit-campaign-copy.md`](deliverables/deposit-campaign-copy.md).

Use [`deliverables/shopify-payment-handoff.md`](deliverables/shopify-payment-handoff.md)
to collect the final Shopify product, order, email, refund, and support inputs.
