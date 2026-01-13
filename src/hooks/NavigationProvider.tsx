import { signal } from '@preact/signals';
import { createContext, ComponentChildren } from 'preact';
import { useContext, useEffect, useMemo } from 'preact/hooks';
import { useLocation } from 'wouter-preact';

interface NavigationContextValue {
  /** The previous path in navigation history, or null if none */
  from: string | null;
  /** Navigate to previous path, or fallback if no history */
  navigateBack: (options: { fallback: string }) => void;
}

interface NavigationProviderProps {
  readonly children: ComponentChildren;
}

const NavigationContext = createContext<NavigationContextValue | null>(null);

/**
 * Context provider that tracks navigation history for contextual back navigation.
 * Works in both widget (memory routing) and standalone (browser routing) modes
 * by maintaining its own history stack using signals.
 */
export function NavigationProvider({ children }: NavigationProviderProps) {
  const [location, setLocation] = useLocation();
  const historyStack = useMemo(() => signal<string[]>([]), []);

  useEffect(() => {
    const currentHistory = historyStack.value;
    const lastPath = currentHistory.at(-1);

    // Only add to history if this is a new location
    if (location !== lastPath) {
      historyStack.value = [...currentHistory, location];
    }
  }, [location, historyStack]);

  const value = useMemo<NavigationContextValue>(() => {
    const from =
      historyStack.value.length > 1 ? historyStack.value.at(-2) : null;

    const navigateBack = ({ fallback }: { fallback: string }) => {
      if (from) {
        // Remove current path from stack before navigating back
        historyStack.value = historyStack.value.slice(0, -1);
        setLocation(from);
      } else {
        setLocation(fallback);
      }
    };

    return { from, navigateBack };
  }, [historyStack, setLocation]);

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
}

/**
 * Hook to access navigation context for contextual back navigation.
 * Returns the previous path and a function to navigate back.
 */
export function useNavigation(): NavigationContextValue {
  const context = useContext(NavigationContext);
  if (context === null) {
    throw new Error('useNavigation must be used within NavigationProvider');
  }
  return context;
}
