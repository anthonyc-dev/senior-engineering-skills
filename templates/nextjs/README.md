# App Router segment error boundary

Copy [error.tsx](error.tsx) to the affected App Router segment, such as `app/account/error.tsx`. It is a Client Component because the retry control calls `reset`. Reuse the app's existing button, layout, localization, and focus conventions without exposing raw exception messages.

This handles unexpected rendering errors caught by that segment's boundary. It does not replace validation/error results for expected business failures, nor handle errors in the same segment's layout. Root-layout failures require the framework's separate global-error convention.

Verify the installed Next.js version's error-boundary contract. Run the consuming app's type check/build and browser test for thrown errors, safe visible copy, keyboard retry, and recovery. Root skill-pack checks verify TSX syntax only.

Reference: [Next.js error file convention](https://nextjs.org/docs/app/api-reference/file-conventions/error).
