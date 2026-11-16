# RELAY Engineering Constitution

Organisation: ASIVARO CONCEPTS  
Product: RELAY — Operational Intelligence & Continuity Network  
Competition: #BuildHybridAI 2026

## Mission
Build a credible operational continuity product using Firebase AI Logic hybrid inference. The web/Chrome implementation is the primary competition deliverable; native Android follows. iOS must remain in the architecture but must not be claimed as tested until it is built and validated on macOS with a supported Apple Intelligence device.

## Non-negotiable engineering requirements
1. Use the official Firebase AI Logic SDK on each platform.
2. On web, use `InferenceMode.PREFER_ON_DEVICE` and explicit `inCloudParams.model` fallback.
3. Call `initializeDeviceModel()` after a user interaction and before inference.
4. Read `result.response.inferenceSource`; never infer or hardcode execution source.
5. Never simulate local inference or label cloud inference as local.
6. Validate AI outputs before saving or using them.
7. Separate observations/facts from AI interpretations and recommendations.
8. Require human approval for operational actions.
9. Do not expose customer data, private prompts or debug tokens in logs.
10. Do not commit `.env` files, API credentials or App Check debug tokens.
11. Use synthetic data in the public demo.
12. Maintain type checks and tests for critical workflows.

## Platform requirements
- Web: React, TypeScript, Vite, Firebase JavaScript SDK; Chrome desktop 139+ for local inference.
- Android: Kotlin, Jetpack Compose, Firebase AI Logic Android SDK and supported ML Kit Prompt API/Gemini Nano devices.
- iOS: Swift, SwiftUI, Firebase AI Logic Apple SDK and Apple Foundation Models on supported devices; build/test on a Mac.

## Product modules
FieldCapture, Local Intelligence, Continuity Engine, ActionFlow, TrustLedger, Operations Intelligence.

## Security and data integrity
- Enforce Firebase App Check for Firebase AI Logic.
- Use the App Check debug provider only in local development; safelist the local debug token in Firebase Console and keep it private.
- Before production, register an appropriate production App Check provider.
- Use organisation-level isolation and least-privilege security rules before multi-user deployment.
- Treat generated analyses as drafts, never as verified inspection facts.

## Design
Premium enterprise experience: midnight navy, ivory, antique gold, restrained blue and amber status colours. Mobile responsive. No chatbot-first layout.

## Agent workflow
Plan changes before editing. Make focused changes. Run `npm run typecheck` and `npm run build`. Review security-sensitive changes. Do not claim a feature works without a reproducible test.


## Cloud and spending policy
- Prefer GitHub Codespaces and standard GitHub-hosted CI for cloud development.
- Use the devcontainer supplied in `.devcontainer/devcontainer.json`.
- Keep Codespaces within the personal GitHub Free included compute and storage quotas. Check current account usage before resizing or creating a second Codespace.
- Do not create prebuilds. Stop Codespaces when idle and delete temporary high-storage Codespaces after tests.
- Keep Firebase on Spark and use Gemini Developer API with `gemini-4-hydrogen` only while the current Firebase model catalogue identifies it as billing-not-required.
- Never link Google Cloud Billing, upgrade Firebase to Blaze, enable GitHub overages, create a paid cloud VM, use a paid Mac rental, or activate another paid add-on without the user's explicit approval.
- Use synthetic data only with the Gemini Developer API free tier.
- The noVNC port 6080 and Vite port 5173 must remain private in Codespaces.
- A cloud-hosted Chrome browser is a separate execution device. Report `ON_DEVICE` only when Firebase AI Logic response metadata actually says `ON_DEVICE`; otherwise report the actual source.
- Remote desktop / Chrome local inference is an experiment, not a guaranteed feature of all Codespaces machine types.
