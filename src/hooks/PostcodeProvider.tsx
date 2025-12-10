import { createContext, ComponentChildren } from 'preact';
import { useState, useEffect, useContext } from 'preact/hooks';
import { useParams } from 'wouter-preact';

import PostCodeResolver from '@/lib/PostcodeResolver';
import i18n from '@/lib/i18n';

interface PostcodeData {
  postcode: string;
  city: string;
  isInWales: boolean;
}

interface PostcodeState {
  loading: boolean;
  data: PostcodeData | null;
  error: Error | null;
  postcode: string | undefined;
}

interface PostcodeProviderProps {
  readonly children: ComponentChildren;
}

const PostcodeContext = createContext<PostcodeState | null>(null);

/**
 * Context provider with integrated postcode validation and geocoding
 * Validates postcode via HERE Maps API and handles Wales-specific locale switching
 */
export function PostcodeProvider({ children }: PostcodeProviderProps) {
  const params = useParams<{ postcode: string }>();
  const postcode = params.postcode;
  const [state, setState] = useState<PostcodeState>({
    loading: true,
    data: null,
    error: null,
    postcode,
  });

  useEffect(() => {
    async function validateAndFetch() {
      if (!postcode) {
        setState({ loading: false, data: null, error: null, postcode });
        return;
      }

      setState((s) => ({ ...s, loading: true }));

      try {
        const geocode = await PostCodeResolver.getValidGeocodeData(postcode);
        const isInWales = geocode.items[0].address.state === 'Wales';

        // Handle Wales-specific language switching
        if (i18n.language === 'en' && isInWales) {
          // Use English Welsh for Wales locations
          i18n.changeLanguage('cy-GB');
        } else if (i18n.language === 'cy-GB' && !isInWales) {
          // Handle the user changing back to an English location in the same session
          i18n.changeLanguage('en');
        }

        setState({
          loading: false,
          data: {
            postcode,
            city: geocode.items[0].address.city,
            isInWales,
          },
          error: null,
          postcode,
        });
      } catch (error) {
        setState({
          loading: false,
          data: null,
          error:
            error instanceof Error
              ? error
              : new Error('Postcode validation error'),
          postcode,
        });
      }
    }

    validateAndFetch();
  }, [postcode]);

  if (state.error) {
    throw state.error;
  }

  return (
    <PostcodeContext.Provider value={state}>
      {children}
    </PostcodeContext.Provider>
  );
}

/**
 * Hook to access postcode context
 * Throws error if used outside PostcodeProvider
 */
export function usePostcode(): PostcodeState {
  const context = useContext(PostcodeContext);
  if (context === null) {
    throw new Error('usePostcode must be used within PostcodeProvider');
  }
  return context;
}
