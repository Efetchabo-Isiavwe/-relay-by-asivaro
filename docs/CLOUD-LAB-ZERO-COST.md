# RELAY Cloud Lab — Zero-cost-first setup

**Owner:** ASIVARO CONCEPTS  
**Product:** RELAY  
**Primary workstation:** GitHub Codespaces on the personal GitHub Free account  
**Policy:** No paid resource activation, no billing-account linkage and no paid machine selection without explicit owner approval.

## What this configuration does

This repository contains a lightweight Codespaces Dev Container using the default base image, Node.js 24.12 and a single private Vite preview port (`5173`). It does not automatically start a remote desktop or Android/iOS emulator. The default Codespace should be the smallest machine GitHub explicitly shows as covered by your remaining included usage.

## Important free-quota limits

For a personal GitHub Free account, GitHub currently lists:

- 120 Codespaces core-hours per month
- 15 GB-month of Codespaces storage per month

Compute is counted as active time multiplied by the number of CPU cores. Therefore, 2 cores use 2 core-hours per active hour; 4 cores use 4 core-hours per active hour. Stopped Codespaces stop compute charges but continue to use storage. Storage accrues hourly, and deleting a Codespace stops future storage accrual but does not refund storage already accrued during that billing month.

A common 4-core machine is listed as 4 CPUs, 16 GB RAM and 64 GB storage. At 4 cores, 120 included core-hours equate to at most 30 active hours, before accounting for any other Codespaces usage. A 64 GB persistent disk can also consume the 15 GB-month storage allowance in roughly one week if retained continuously. Check the Billing page before and after use; do not assume all monthly quota remains unused.

A 2-core, 8 GB RAM, 32 GB storage machine is a more economical default for development. The 4-core/16-GB/64-GB machine is only for a temporary Chrome Prompt API experiment if it is offered in the machine selector and if the account still has included compute and storage available.

**No-cost rule:** if the required machine type is not available within the remaining included quota, do not add a payment method, enable overages, or choose a paid machine. Stop and ask the project owner before proceeding.

## Before creating a Codespace — protect the account

1. Open <https://github.com/settings/billing>.
2. Review the Codespaces compute and storage allowances used in the current billing cycle.
3. Open **Budgets and alerts** and configure a Codespaces product-level budget with a zero-dollar overage allowance and the hard-stop option if the account UI makes it available for your personal account.
4. Enable included-usage alerts at 90% and 100%.
5. Do not enable paid overages or add a payment method for this project. GitHub says personal accounts are restricted from billable Codespaces after included quota is exhausted unless a payment method and spending limit are configured.
6. Do not create Codespaces prebuilds. They can consume storage even when no active Codespace is open.

Budget controls and included-use alerts are account settings. This project does not change them automatically.

## Dedicated repository

The RELAY repository already exists and contains the prepared source:

<https://github.com/Efetchabo-Isiavwe/-relay-by-asivaro>

It is public and separate from other ASIVARO projects.

## Launch the cloud development environment

1. Open the new repository on GitHub.
2. Select **Code → Codespaces → Create codespace on main**.
3. Select the smallest machine type GitHub explicitly shows as covered by your remaining included usage. Prefer 2 cores for this first web-development environment.
4. Wait for the dev container to finish. `postCreateCommand` runs `npm install`.
5. Start the web app in the terminal:

   ```bash
   npm run dev -- --host 0.0.0.0
   ```

6. Open the forwarded private port `5173` to use the RELAY preview.

The first Codespace forwards only port `5173`. It is intentionally kept lightweight.

## Chrome local-model test (later)

The normal Codespaces preview is opened in the browser on your HP EliteBook. In that arrangement, Chrome Prompt API inference executes on the HP laptop, not inside Codespaces. Your current laptop has 8 GB RAM, below Chrome's documented 16 GB CPU-inference requirement. Therefore, do not expect the first Codespace to prove `ON_DEVICE` inference.

We will evaluate a separate supported desktop or device environment later. A forwarded URL by itself does not move Chrome's local model execution into the cloud. A local-inference claim is valid only when Firebase AI Logic's response metadata actually reports `ON_DEVICE`.

## Firebase free-tier configuration

1. Create Firebase project named **RELAY by ASIVARO**. Suggested project ID: `relay-by-asivaro-2026`; if unavailable, append a short suffix. Project IDs must start with a lowercase letter, so do not use the GitHub repository name which begins with a hyphen.
2. Skip Google Analytics.
3. Keep the project on the **Spark** plan. Do not link a Google Cloud Billing account or upgrade to Blaze.
4. Add a Web app named `RELAY Web` and copy its Firebase web config.
5. Enable Firebase AI Logic using the **Gemini Developer API** provider.
6. Keep Firebase AI Logic App Check enforcement enabled. This pre-production app uses the App Check debug-token flow; a reCAPTCHA site key is not needed for this development test.
7. Use only synthetic demo observations while using the Gemini Developer API free tier. Do not submit confidential customer, employee, security, facility or operational information.
8. Do not enable Cloud Storage, Cloud Functions, App Hosting, phone/SMS authentication or other services that require a billing upgrade. The current starter's Firestore and Storage rules deny access until safe organisation-scoped rules are implemented.

Firebase AI Logic itself is free, but model pricing and Firebase plan requirements depend on provider and model. The Gemini Developer API free tier does not require a payment method and keeps the project on Spark. Some other models and features require billing. Never link billing for this project without explicit approval.

## Public CI build

The workflow at `.github/workflows/web-ci.yml` runs type-check and production-build checks on pushes and pull requests. Standard GitHub-hosted runners are free for public repositories. Do not change this workflow to a larger hosted runner or a private repository without reviewing pricing.

## Android testing without an emulator on the laptop

Use the Redmi 12 for layout, navigation, authentication/cloud connectivity (once implemented), offline capture and sync testing. It is not currently a supported Gemini Nano local-inference device.

Firebase Android Device Streaming provides 30 no-cost minutes per Firebase project per month on Spark. Use only devices explicitly included in the no-cost Google-hosted catalog; partner labs may have different charges. Stop within the free allowance. Remote Android hardware can validate local Gemini Nano only if the selected device itself supports the model and Firebase hybrid API.

## iOS testing without a Mac

The repository can be edited from Codespaces and a future public-repository GitHub Actions workflow can use a standard macOS runner for compile/test automation when the native iOS project exists. This does not replace testing on a real Apple Intelligence-enabled iPhone. The Apple Foundation Models hybrid integration must be validated on supported Apple hardware; a browser emulator or screenshot preview is not proof of local iOS inference.

## Free static web hosting (optional, not activated)

After the app builds and the Firebase configuration is ready, Cloudflare Pages Free is an option for the static Vite app:

- Connect the public GitHub repository in Cloudflare Pages.
- Build command: `npm run build`
- Output directory: `dist`
- Do not add Workers, paid add-ons or paid compute.

No Cloudflare account is connected or configured by this starter. Keep secrets out of frontend environment variables; Vite `VITE_` variables are bundled into browser-visible code. Firebase web configuration is designed for clients, but server secrets are not.

## Stop and cleanup checklist

- Stop Codespaces when not working. The default idle timeout is 30 minutes; a shorter timeout can be configured in GitHub Settings.
- Delete temporary Codespaces after their test is complete to stop future storage accrual. Deleting does not refund this month's already-accrued GB-hours.
- Do not configure prebuilds.
- Check Codespaces usage at <https://github.com/settings/billing>.
- Keep `.env.local`, Firebase App Check debug tokens and all credentials out of Git.
- Do not link a billing account or enable paid overage for Firebase, GitHub or Cloudflare.

## Official references

- GitHub Codespaces Free usage: <https://docs.github.com/en/codespaces/troubleshooting/troubleshooting-included-usage>
- GitHub included usage: <https://docs.github.com/en/billing/reference/product-usage-included>
- GitHub Codespaces machine types: <https://docs.github.com/en/codespaces/about-codespaces/what-are-codespaces>
- GitHub budgets: <https://docs.github.com/en/billing/how-tos/set-up-budgets>
- Dev Container desktop-lite: <https://github.com/devcontainers/features/tree/main/src/desktop-lite>
- Chrome Prompt API hardware requirements: <https://developer.chrome.com/docs/ai/prompt-api>
- Firebase AI Logic pricing: <https://firebase.google.com/docs/ai-logic/pricing?api=dev>
- Firebase supported models: <https://firebase.google.com/docs/ai-logic/models?api=dev>
- Android Device Streaming: <https://developer.android.com/studio/run/android-device-streaming>
- Firebase Test Lab quotas: <https://firebase.google.com/docs/test-lab/usage-quotas-pricing>
- Cloudflare Pages limits: <https://developers.cloudflare.com/pages/platform/limits/>
