import { Component, ComponentChildren } from 'preact';
import { useTranslation } from 'react-i18next';
import { Link } from 'wouter-preact';

import { captureException } from '@/lib/sentry';

export interface ErrorBoundaryProps {
  readonly fallback?: ComponentChildren;
  readonly children: ComponentChildren;
}

export interface ErrorBoundaryState {
  error: Error | null;
}

export interface ErrorPageProps {
  readonly link?: string;
  readonly message?: string;
  readonly cta?: string;
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

export function ErrorPage({ link = '/', message, cta }: ErrorPageProps) {
  const { t } = useTranslation();

  return (
    <>
      <h2>{t('error.title')}</h2>
      {message && <p>{message}</p>}
      <p className="diamond-text-size-sm">{t('error.message')}</p>
      <p className="diamond-spacing-bottom-md diamond-text-weight-bold">
        {t('error.label')}
      </p>
      <diamond-button width="full-width" variant="primary">
        <Link href={link}>{cta ?? t('error.cta')}</Link>
      </diamond-button>
    </>
  );
}

export function ErrorBoundaryPage({
  children,
  ...errorPageProps
}: ErrorPageProps & { readonly children?: ComponentChildren }) {
  return (
    <ErrorBoundary fallback={<ErrorPage {...errorPageProps} />}>
      {children}
    </ErrorBoundary>
  );
}
