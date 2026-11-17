'use client';

type ErrorBoundaryProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorBoundary({ reset }: ErrorBoundaryProps) {
  return (
    <section role="alert" aria-label="Page error">
      <h2>Could not load this page.</h2>
      <p>Please try again. If the problem continues, contact support.</p>
      <button type="button" onClick={reset}>Try again</button>
    </section>
  );
}
