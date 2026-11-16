# RELAY starter implementation status

## Included in this starter
- React + TypeScript + Vite application shell and responsive dashboard UI.
- Synthetic field observation records for the public demo.
- Firebase AI Logic web model setup using `PREFER_ON_DEVICE`.
- Explicit Gemini 4 Hydrogen cloud fallback configuration.
- On-device model initialisation from a user action.
- Actual inference source read from `result.response.inferenceSource`.
- A single-turn structured observation-analysis prompt.
- Zod validation before displaying analysis output.
- Firebase App Check debug-provider activation in local development, when the Firebase web configuration and reCAPTCHA site key are supplied.
- Deny-by-default Firestore and Storage rule placeholders.

## Not yet implemented or verified
- Firebase project creation and live credentials.
- App Check debug-token safelisting in the Firebase Console.
- Live cloud inference against the entrant's Firebase project.
- On-device inference on the entrant's Chrome hardware.
- User authentication, Firestore persistence, Storage evidence upload and role-based access.
- Native Android and iOS applications.
- Production App Check provider and production security rules.

Do not describe unverified items as completed in the hackathon submission.
