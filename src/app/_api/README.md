# API Routes (Server Mode)

These API routes are used when running in **server mode** (`npm run dev` or Node.js deployment).

For **static/GitHub Pages deployment**, the app uses a client-side API interceptor
(`src/lib/apiInterceptor.ts`) that routes all `/api/*` requests to the same
in-memory engines — no server needed.

To re-enable server API routes, rename this directory back to `api/` and remove
`output: 'export'` from `next.config.js`.
