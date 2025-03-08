
import * as Sentry from '@sentry/react';

let initialized = false;

export const initErrorTracking = () => {
  if (initialized) return;
  
  // Only initialize in production
  if (import.meta.env.PROD) {
    Sentry.init({
      dsn: import.meta.env.VITE_SENTRY_DSN || "",
      integrations: [
        new Sentry.BrowserTracing({
          // Set sampling rate for performance monitoring
          tracePropagationTargets: ["localhost", /^https:\/\/earthkulture\.com/],
        }),
        new Sentry.Replay(),
      ],
      // Only capture a percentage of transactions for performance monitoring
      tracesSampleRate: 0.1,
      // Capture a percentage of replays for session monitoring
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,
      environment: import.meta.env.MODE,
      enabled: !!import.meta.env.VITE_SENTRY_DSN,
    });
    
    initialized = true;
    console.log("Error tracking initialized");
  }
};

export const captureException = (error: any, context?: Record<string, any>) => {
  if (import.meta.env.PROD && initialized) {
    Sentry.captureException(error, { 
      contexts: context ? { additional: context } : undefined 
    });
  } else {
    console.error("Error captured:", error, context);
  }
};

export const setUserContext = (userProfile: any) => {
  if (import.meta.env.PROD && initialized && userProfile) {
    Sentry.setUser({
      id: userProfile.id,
      email: userProfile.email,
    });
  }
};

export const clearUserContext = () => {
  if (import.meta.env.PROD && initialized) {
    Sentry.setUser(null);
  }
};
