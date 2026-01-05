import PostCodeResolver from './PostcodeResolver';

export interface PostcodeErrorHandlerResult {
  shouldNavigate: boolean;
  navigateTo?: string;
}

/**
 * Handles postcode resolution errors consistently across the app
 * Returns navigation instructions for specific error types
 */
export function handlePostcodeError(
  error: unknown,
): PostcodeErrorHandlerResult {
  const errorMessage = error instanceof Error ? error.message : '';

  // Navigate to not-found page for specific "not found" errors
  if (errorMessage === PostCodeResolver.ERROR_NOT_IN_UK) {
    return {
      shouldNavigate: true,
      navigateTo: '/not-found?reason=notInTheUK',
    };
  }

  if (
    errorMessage === PostCodeResolver.ERROR_SEARCH_FAILED ||
    errorMessage === PostCodeResolver.ERROR_POSTCODE_NOT_FOUND
  ) {
    return {
      shouldNavigate: true,
      navigateTo: '/not-found',
    };
  }

  // For other errors, don't navigate (will be thrown/handled elsewhere)
  return {
    shouldNavigate: false,
  };
}
