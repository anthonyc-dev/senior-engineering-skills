# Typed asynchronous content states

Copy [AsyncContent.tsx](AsyncContent.tsx) into the existing React feature/component structure. Requires React and the consuming project's TypeScript/JSX setup. The discriminated state distinguishes loading, error, empty, and ready data; the caller owns fetching, state transitions, authorization, and retry behavior.

Use `state={{ status: 'ready', data: result }}` and a render callback to display typed data. Return `status: 'empty'` for the domain's empty result. Raw error objects never enter the UI component. Reuse existing design-system primitives/localized strings before introducing a second generic component.

Run the app's type check and component tests for each state, no automatic retry, retry on click, ready data rendering, and screen-reader status/error announcements. In Next.js, keep interactive usage within a Client Component boundary; a render function is not serializable across Server/Client boundaries. Root pack checks validate syntax, not React rendering or accessibility behavior.
