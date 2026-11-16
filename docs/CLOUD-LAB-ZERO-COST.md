# RELAY Cloud Lab — Zero-cost-first setup

**Owner:** ASIVARO CONCEPTS  
**Product:** RELAY  
**Primary workstation:** GitHub Codespaces on the personal GitHub Free account  
**Policy:** No paid resource activation, no billing-account linkage and no paid machine selection without explicit owner approval.

## What this configuration does

This repository contains a Codespaces Dev Container with Node.js 22 and a lightweight noVNC desktop (`desktop-lite`). It forwards two private ports:

- `5173`: Vite web preview
- `6080`: remote Linux desktop accessible in a browser through noVNC

The default Codespace machine should be the smallest available machine suitable for editing and web development. Use a larger machine only for a short, deliberate Chrome local-model experiment.

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

## Create the dedicated repository

RELAY must remain separate from other ASIVARO projects.

1. Go to <https://github.com/new> while signed in as the personal GitHub account.
2. Repository name: `-relay-by-asivaro`.
3. Description: `Operational Intelligence & Continuity Network — ASIVARO CONCEPTS #BuildHybridAI 2026 entry`.
4. Select **Public** (the hackathon asks for a public source repository).
5. Do not initialise it with a README, `.gitignore`, or licence; this starter already includes those files.
6. Create the repository. Then provide its URL so the initial project files can be transferred into it.

No repository is created by this configuration archive.

## Launch the cloud development environment

1. Open the new repository on GitHub.
2. Select **Code → Codespaces → Create codespace on main**.
3. Select the smallest machine type available for normal development. Prefer 2 cores / 8 GB RAM / 32 GB storage if listed.
4. Wait for the dev container to finish. `postCreateCommand` runs `npm install`.
5. Start the web app in the terminal:

   ```bash
   npm run dev -- --host 0.0.0.0
   ```

6. Open the forwarded private port `5173` to use the RELAY preview.

The Dev Container starts `desktop-lite` and forwards port `6080`, but Chrome is not installed automatically. This avoids installing a large browser until the local-model test is actually needed.

## Temporary Chrome local-model test

Only do this after reviewing available included quota and confirming no paid usage can occur.

1. In the Codespace menu, choose **Change machine type**.
2. If available within the remaining included allowance, select 4 cores / 16 GB RAM / 64 GB storage. If that type is unavailable, do not pick a paid option.
3. Rebuild/restart the Codespace if GitHub requests it.
4. Install Chrome:

   ```bash
   bash scripts/install-chrome-codespace.sh
   ```

5. Start Chrome in the remote desktop:

   ```bash
   bash scripts/start-chrome-codespace.sh
   ```

6. Open the Codespaces **Ports** panel and select the private forwarded port `6080`. Open it in a browser, click **Connect**, and enter the desktop password configured in `.devcontainer/devcontainer.json` (`vscode` by default).
7. In the remote Chrome session, open `chrome://on-device-internals` and review model readiness and free disk space. Then open the RELAY preview on port `5173` from that same remote Chrome session.
8. Use the app's **Prepare local AI** control and then **Analyse observation**. A local demonstration is valid only when Firebase AI Logic's real response metadata reports `ON_DEVICE`. `IN_CLOUD` is a cloud fallback, not proof of local execution.
9. Stop the Codespace as soon as the experiment is complete. Do not leave a 64 GB Codespace stored for days unnecessarily.

### Limitations

Chrome's Prompt API documentation lists Linux as supported and specifies at least 22 GB free on the Chrome-profile volume plus either a CPU with at least 16 GB RAM and 4 CPU cores or a GPU with strictly more than 4 GB VRAM. A Codespace can meet the listed virtual machine specifications, but virtualised hardware, browser rollout, model eligibility and Chrome's device checks can still prevent local model availability. This setup is an experiment to verify, not a guarantee. Never spoof the inference source.

## Firebase free-tier configuration

1. Create or use the Firebase project with the **Spark** plan.
2. Do not link a Google Cloud Billing account and do not upgrade to Blaze.
3. Enable Firebase AI Logic with the **Gemini Developer API** provider.
4. Keep the model set to `gemini-4-hydrogen`, which Firebase currently marks as billing-not-required.
5. Configure Firebase App Check for the web application using reCAPTCHA v3. App Check enforcement for Firebase AI Logic is required.
6. Use only synthetic demo observations while using the Gemini Developer API free tier. Do not submit confidential customer, employee, security, facility or operational information.
7. Do not enable Cloud Storage, Cloud Functions, App Hosting, phone/SMS authentication or other services that require a billing upgrade. The current starter's Firestore and Storage rules deny access until safe organisation-scoped rules are implemented.

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
