# First task for Google Antigravity

Open the RELAY repository folder in Google Antigravity and give the coding agent this task:

---

You are working in the `relay-by-asivaro` repository. Read `AGENTS.md`, `README.md`, and `docs/IMPLEMENTATION-STATUS.md` before editing.

The project is the initial React/Vite web implementation for ASIVARO CONCEPTS' RELAY product and the #BuildHybridAI 2026 hackathon.

## First objective
Make the existing web starter compile and run cleanly without changing its product direction or fabricating working Firebase services.

1. Inspect all TypeScript and package files.
2. Run `npm install`, `npm run typecheck`, and `npm run build`.
3. Fix any real compiler or dependency errors.
4. Check the Firebase AI Logic imports and types against the installed Firebase JS SDK 13.3.x and the current official documentation:
   - https://firebase.google.com/docs/ai-logic/hybrid/web/get-started
   - https://firebase.google.com/docs/ai-logic/hybrid/web/configuration-options
5. Preserve `InferenceMode.PREFER_ON_DEVICE`.
6. Preserve an explicit `inCloudParams.model` fallback of `gemini-4-hydrogen` unless the current official model list says it is unavailable; if changing it, document why.
7. Preserve the call to `initializeDeviceModel()` from a direct user action before inference.
8. Preserve the real `result.response.inferenceSource` display. Never hardcode the source.
9. Ensure unsupported local inference degrades to cloud fallback without crashing the workflow.
10. Ensure AI output is parsed and Zod-validated before it appears as a result.

## Second objective
Add automated tests for JSON extraction, schema validation and source mapping. Add a clear environment-setup state when Firebase or App Check is incomplete. Do not add mocked inference and do not represent a mocked result as a real AI response.

## Constraints
- Do not create a generic chatbot.
- Do not remove synthetic-data labels.
- Do not weaken Firestore or Storage rules; they currently deny all access intentionally.
- Do not add Firebase credentials, debug tokens, secrets or real customer data to the repository.
- Do not add authentication/database features until the real hybrid inference path is compiling and verified.

Finish by reporting: files changed, commands run, build result, known blockers, and the exact next manual Firebase Console steps. Do not claim a local-inference test passed unless the result's actual `inferenceSource` is `ON_DEVICE` on supported Chrome hardware.
