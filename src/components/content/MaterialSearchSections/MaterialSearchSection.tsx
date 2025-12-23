import { ComponentChildren } from 'preact';

import type { UseDataState } from '@/hooks/useData';
import { captureException } from '@/lib/sentry';

interface ResultWrapperProps<T> {
  readonly result: UseDataState<T>;
  readonly showLoadingCard?: boolean;
  readonly children: ComponentChildren;
}

/**
 * Section wrapper component to handle loading, error, and data states
 * in response to a material search result
 */
export default function MaterialSearchSection<T>({
  result,
  children,
  showLoadingCard = true,
}: ResultWrapperProps<T>) {
  if (result.loading) {
    if (!showLoadingCard) {
      return null;
    }

    return <locator-loading-card />;
  }

  if (result.error) {
    captureException(result.error, { component: 'ResultWrapper' });
    return null;
  }

  if (!result.data) {
    return null;
  }

  return <diamond-enter type="fade">{children}</diamond-enter>;
}
