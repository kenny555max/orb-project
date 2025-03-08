import * as Sentry from "@sentry/nextjs";

Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    tracesSampleRate: 1.0, // Adjust this for performance monitoring
    environment: process.env.NODE_ENV,
    release: process.env.VERCEL_GIT_COMMIT_SHA, // For tracking specific releases
    integrations: [],
});

