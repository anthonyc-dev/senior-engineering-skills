import type { ReactNode } from 'react';

export type AsyncState<T> =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'empty' }
  | { status: 'ready'; data: T };

type AsyncContentProps<T> = {
  state: AsyncState<T>;
  children: (data: T) => ReactNode;
  onRetry?: () => void;
};

export function AsyncContent<T>({ state, children, onRetry }: AsyncContentProps<T>) {
  switch (state.status) {
    case 'loading':
      return <p role="status">Loading content.</p>;
    case 'error':
      return (
        <div role="alert">
          <p>Could not load content.</p>
          {onRetry && <button type="button" onClick={onRetry}>Try again</button>}
        </div>
      );
    case 'empty':
      return <p>No content yet.</p>;
    case 'ready':
      return <>{children(state.data)}</>;
  }
}
