# Firebase setup for RELAY (pre-production)

This guide configures only the Web/Chrome hackathon build. It does not enable paid billing.

## A. Create the Firebase project

1. Open https://console.firebase.google.com/.
2. Create a project named **RELAY by ASIVARO**.
3. Suggested project ID: `relay-by-asivaro-2026`. Google Cloud project IDs must start with a lowercase letter; if unavailable, append a short suffix.
4. Skip Google Analytics. RELAY does not need it for this milestone.
5. Keep the project on the no-cost Spark plan. Do not link a Cloud Billing account.

## B. Register the Web app

1. In Project Overview, select Add app → Web.
2. App nickname: `RELAY Web`.
3. Register the app.
4. Copy the Firebase web config object. The values in this object are public client configuration; do not confuse them with a private service-account key.

## C. Enable Firebase AI Logic

1. Open AI Services → AI Logic.
2. Select Get started.
3. Choose **Gemini Developer API**, not the Agent Platform / Vertex AI provider.
4. Complete the guided setup.
5. Keep Firebase AI Logic App Check enforcement enabled.
6. Do not add a billing account or enable paid APIs.

The app is configured to prefer on-device inference and fall back to the cloud model `gemini-4-hydrogen`. The model identifier is listed in the current Firebase AI Logic model catalogue.

## D. Open the Codespace and create local environment variables

1. Open the repository: https://github.com/Efetchabo-Isiavwe/-relay-by-asivaro
2. Select Code → Codespaces → Create codespace on main.
3. Choose a machine GitHub shows as covered by your remaining included usage. Do not add a payment method or accept paid overages.
4. When the Codespace opens, open the terminal and run:

```bash
cp .env.example .env.local
```

5. Edit `.env.local` using the Codespaces editor and replace the Firebase fields with the config values from Firebase Console:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

Keep `VITE_RECAPTCHA_V3_SITE_KEY=replace_with_site_key` unchanged for this local pre-production test. Do not create or paste a production reCAPTCHA key just for the debug-token workflow.

Never commit `.env.local`. It is ignored by Git.

## E. Start the app

```bash
npm run dev
```

Open the forwarded private port 5173 from the Ports tab.

## F. Register the App Check debug token

1. Open browser developer tools for the RELAY preview.
2. In Console, find the message beginning `AppCheck debug token:`.
3. Copy the token locally. Treat it like a password; do not paste it in chat, commit it, or put it in a public file.
4. In Firebase Console, open Security → App Check → Apps.
5. Find the RELAY Web app → Manage debug tokens → Add debug token.
6. Paste and save the token.
7. Reload RELAY and retry the analysis.

The debug-token flow is for development only. Before public release, replace it with a real production attestation provider (for Web, use reCAPTCHA Enterprise) and remove debug mode.

## G. First verification

1. Click Prepare local AI after the page has loaded.
2. Wait for model initialisation to complete or report that local inference is unavailable.
3. Click Analyse observation.
4. Confirm the source badge is derived from Firebase's response metadata:
   - `ON_DEVICE` means the Chrome Prompt API actually handled the request.
   - `IN_CLOUD` means the configured Gemini cloud fallback handled it.
5. If it fails, copy the exact error text (not the debug token) and report it.

## Safety and costs

- Do not link a Cloud Billing account.
- Do not enable Agent Platform / Vertex AI billing.
- Do not activate Firebase App Hosting, Cloud Functions deployments, Cloud Storage uploads or other paid infrastructure for this milestone.
- Gemini Developer API free-tier quotas still apply; avoid repeated test prompts.
- Never commit `.env.local`, debug tokens, service-account keys or private credentials.
