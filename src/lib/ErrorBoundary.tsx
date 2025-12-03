import { Component, ComponentChildren } from 'preact';

import { captureException } from '@/lib/sentry';

interface ErrorBoundaryProps {
  readonly fallback?: ComponentChildren;
  readonly children: ComponentChildren;
}

interface ErrorBoundaryState {
  error: Error | null;
}

/**
 * Generic error boundary component for Preact
 * Catches errors in child components and displays a fallback UI
 */
export default class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error) {
    captureException(error, { component: 'ErrorBoundary' });
    this.setState({ error });
  }

  render() {
    if (this.state.error) {
      return this.props.fallback ?? <p>{this.state.error.message}</p>;
    }

    return this.props.children;
  }
}
