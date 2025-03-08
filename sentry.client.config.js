import * as Sentry from '@sentry/nextjs';

Sentry.init({
    dsn: env.NEXT_PUBLIC_SENTRY_DSN,
    tracesSampleRate: 1.0,
    environment: env.NODE_ENV,
});