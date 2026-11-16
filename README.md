# RELAY by ASIVARO CONCEPTS

**Operational Intelligence & Continuity Network**  
Hackathon: #BuildHybridAI 2026  
Primary target: Web / Chrome

RELAY turns field observations into structured, reviewable operational records. Its first web workflow uses Firebase AI Logic hybrid inference: prefer Chrome on-device inference when available and fall back to a cloud Gemini model when needed. Each result reports the actual Firebase `inferenceSource`.

## 0. Cloud-first zero-cost setup

Use the prepared GitHub Codespaces environment instead of installing a full toolchain on the HP laptop. Read [`docs/CLOUD-LAB-ZERO-COST.md`](docs/CLOUD-LAB-ZERO-COST.md) before creating a Codespace. The repository includes a Dev Container, a private noVNC desktop port, Chrome installation/launch scripts for a temporary on-device AI experiment, and a public-repository CI workflow. No cloud resource is provisioned by downloading this archive.

**Spending rule:** keep GitHub Codespaces within the personal Free allowance, keep Firebase on Spark, do not link a Cloud Billing account, and do not activate paid infrastructure without explicit approval.

## 1. Windows setup

Install:
- Google Antigravity for Windows x64: https://antigravity.google/download
- Node.js 24 LTS (24.12+): https://nodejs.org/en/download
- Git for Windows: https://git-scm.com/downloads/win
- Google Chrome desktop: https://www.google.com/chrome/

Open this folder in Antigravity. Install Firebase agent skills using **one** of these methods: enable the Firebase integration during Antigravity onboarding / from **Customizations → Marketplace**, or use the project-level installation command below. Do not install both methods unless Antigravity indicates the skills are missing.

Separately, in Antigravity’s Agent pane, open **MCP Servers** and install **Firebase**. This lets the coding agent work with Firebase project resources when you authorise it.

In the project terminal, check the tools and install the project dependencies and (if you chose project-level skills) Firebase agent skills:

```powershell
node --version
npm --version
git --version
npx skills add firebase/agent-skills --agent=antigravity
npm install
```

If the skills installer asks which Firebase skills to install, select `firebase-ai-logic-basics` and `firebase-app-check` for the first milestone. Add `firebase-basics`, Firestore and Authentication skills as those features are implemented. The installer’s current list may change.

Use Node.js 24.12 or later. Then start the UI:

```powershell
npm run dev
```

Open the local URL shown by Vite (normally http://localhost:5173) in Chrome.

## 2. Create and configure Firebase

1. Open https://console.firebase.google.com/ and create a project named `-relay-by-asivaro` (or another available project ID).
2. Add a **Web app** to the Firebase project and copy its Firebase web configuration.
3. In Firebase Console, open **AI Services → AI Logic → Get started**.
4. Select the **Gemini Developer API** for the initial hackathon implementation and complete the guided setup.
5. Confirm Firebase AI Logic is enforced in **Security → App Check → APIs**.
6. Register/configure App Check for the web application. Use the reCAPTCHA v3 provider/site key for the web app.
7. Copy `.env.example` to `.env.local` and fill in the Firebase web config and reCAPTCHA v3 site key.
8. Restart the Vite dev server after changing environment variables.
9. Open the app in Chrome and press **Prepare local AI**. The debug token appears in Chrome DevTools Console. Safelist it under **Security → App Check → Apps → Manage debug tokens** in Firebase Console. Never commit or share that token.

The debug token is only for local development. Do not deploy a build with debug mode enabled. Production requires an appropriate App Check attestation provider.

## 3. Verify Chrome local model availability

Use Chrome desktop 139 or later. In the address bar, open:

```text
chrome://flags/#prompt-api-for-gemini-nano-multimodal-input
```

This flag is specifically documented for multimodal Prompt API input. RELAY’s initial workflow is text-only; do not enable experimental flags unless needed for your browser/device. Restart Chrome after changing any flag.

In Chrome DevTools Console, inspect model availability:

```javascript
await LanguageModel.availability();
```

If the result is `downloadable`, the model can be downloaded with:

```javascript
await LanguageModel.create();
```

The first model download may take several minutes. The Chrome Prompt API is only available on supported desktop Chrome/device configurations. If it is unavailable, RELAY should use the Firebase AI Logic cloud fallback, and the UI must report `IN_CLOUD`.

## 4. Verify hybrid inference

1. Ensure Firebase project and App Check are configured.
2. Start the app in Chrome.
3. Click **Prepare local AI** and wait for its status message.
4. Click **Analyse observation**.
5. Inspect the result chip. It is populated from `result.response.inferenceSource` and can report `ON_DEVICE` or `IN_CLOUD`.
6. Record the result and browser/device details for the test log.

Do not alter the source label manually. A first request before the model is ready may use cloud fallback. That is valid hybrid behaviour, but it is not proof of local inference. For a local-inference proof, show a result with `ON_DEVICE` from a supported Chrome device.

## 5. Build checks

```powershell
npm run typecheck
npm run build
```

## 6. Current scope and limitations

This starter includes the first web interface and Firebase AI Logic integration scaffold. It does **not** yet include live user authentication, Firestore persistence, Cloud Storage, organisation roles, Android or iOS native clients. Those are the next engineering milestones after the first verified web inference run.

The Firestore and Storage rules in this repository deny all access by default. Do not relax them globally. Add organisation-scoped, role-aware rules before enabling data persistence or uploads.

## 7. GitHub repository

After the app builds locally:

```powershell
git init
git add .
git commit -m "Initial RELAY web hybrid AI scaffold"
```

Create a public GitHub repository named `-relay-by-asivaro` and push the initial commit. Check `.gitignore` and ensure `.env.local` is not staged.

## 8. Android and iOS follow-on

Android can be developed on this Windows machine using Android Studio and the physical Android device (USB debugging enabled). Confirm that the device and its installed ML Kit Prompt API/Gemini Nano model are supported before promising local Android inference.

iOS native development and validation require macOS/Xcode and a supported Apple Intelligence-enabled device. With no Mac currently available, keep the iOS interface in the architecture but do not claim a verified iOS build. A hosted Mac CI service or temporary access to a Mac will be needed.

## Official references

- Firebase Web hybrid inference (requires Firebase JS SDK 12.5.0+; this starter uses 13.3.0): https://firebase.google.com/docs/ai-logic/hybrid/web/get-started
- Firebase Web hybrid configuration: https://firebase.google.com/docs/ai-logic/hybrid/web/configuration-options
- Firebase Android hybrid inference: https://firebase.google.com/docs/ai-logic/hybrid/android/get-started
- Antigravity download: https://antigravity.google/download
- #BuildHybridAI rules: https://firebasehybridaihackathon.devpost.com/rules
