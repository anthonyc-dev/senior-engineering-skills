# Typed asynchronous content states

Copy [AsyncContent.tsx](AsyncContent.tsx) into the existing React feature/component structure. Requires React and the consuming project's TypeScript/JSX setup. The discriminated state distinguishes loading, error, empty, and ready data; the caller owns fetching, state transitions, authorization, and retry behavior.

Use `state={{ status: 'ready', data: result }}` and a render callback to display typed data. Return `status: 'empty'` for the domain's empty result. Raw error objects never enter the UI component. Reuse existing design-system primitives/localized strings before introducing a second generic component.

The source checkout type-checks this file and tests rendered states. Run the consuming app's interaction and accessibility tests for click-to-retry and status/error announcements. In Next.js, keep interactive usage within a Client Component boundary because the render callback cannot cross the server/client boundary.
