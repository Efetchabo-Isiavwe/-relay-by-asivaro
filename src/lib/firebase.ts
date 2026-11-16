import { initializeApp, type FirebaseApp } from 'firebase/app';
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';
import { getAI, getGenerativeModel, GoogleAIBackend, InferenceMode } from 'firebase/ai';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const hasFirebaseConfig = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.authDomain &&
  firebaseConfig.projectId &&
  firebaseConfig.appId &&
  !firebaseConfig.apiKey.includes('replace_me'),
);

const hasAppCheckSiteKey = Boolean(
  import.meta.env.VITE_RECAPTCHA_V3_SITE_KEY &&
  !import.meta.env.VITE_RECAPTCHA_V3_SITE_KEY.includes('replace_with'),
);

let app: FirebaseApp | null = null;
let hybridModel: ReturnType<typeof getGenerativeModel> | null = null;
let firebaseSetupError: string | null = null;

if (hasFirebaseConfig && hasAppCheckSiteKey) {
  try {
    app = initializeApp(firebaseConfig);

    // The debug token is intentionally enabled only in local development.
    // Never publish a debug token or ship debug mode in a production build.
    if (import.meta.env.DEV) {
      (self as typeof self & { FIREBASE_APPCHECK_DEBUG_TOKEN?: boolean })
        .FIREBASE_APPCHECK_DEBUG_TOKEN = true;
    }

    initializeAppCheck(app, {
      provider: new ReCaptchaV3Provider(import.meta.env.VITE_RECAPTCHA_V3_SITE_KEY),
      isTokenAutoRefreshEnabled: true,
    });

    const ai = getAI(app, { backend: new GoogleAIBackend() });
    hybridModel = getGenerativeModel(ai, {
      mode: InferenceMode.PREFER_ON_DEVICE,
      inCloudParams: {
        model: import.meta.env.VITE_CLOUD_FALLBACK_MODEL || 'gemini-4-hydrogen',
      },
      onDeviceParams: {
        createOptions: {
          expectedInputs: [{ type: 'text', languages: ['en'] }],
          expectedOutputs: [{ type: 'text', languages: ['en'] }],
          initialPrompts: [
            {
              role: 'system',
              content: [{
                type: 'text',
                value: 'You are RELAY, an operational continuity assistant. Separate observed facts from assumptions. Never diagnose equipment or authorize safety-critical work. Return only valid JSON matching the requested structure.',
              }],
            },
          ],
        },
      },
    });
  } catch (error) {
    firebaseSetupError = error instanceof Error ? error.message : 'Firebase initialisation failed.';
    app = null;
    hybridModel = null;
  }
} else {
  firebaseSetupError = !hasFirebaseConfig
    ? 'Firebase web configuration is missing.'
    : 'Firebase App Check reCAPTCHA site key is missing.';
}

export const firebaseApp = app;
export const relayModel = hybridModel;
export const relayFirebaseReady = Boolean(app && hybridModel);
export const relayFirebaseSetupError = firebaseSetupError;
