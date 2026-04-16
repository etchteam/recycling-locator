import { ComponentChildren, createContext } from 'preact';
import { useContext, useMemo } from 'preact/hooks';

import { RecyclingLocatorAttributes } from '@/index';
import getStartPath from '@/lib/getStartPath';

interface AppStateData extends RecyclingLocatorAttributes {
  startPath: string;
  sessionId: string;
}

interface AppStateProviderProps {
  readonly attributes: RecyclingLocatorAttributes;
  readonly sessionId: string;
  readonly children: ComponentChildren;
}

export const AppStateContext = createContext<AppStateData>(null);

export function AppStateProvider({
  children,
  attributes,
  sessionId,
}: AppStateProviderProps) {
  const appState: AppStateData = useMemo(
    () => ({
      ...attributes,
      sessionId,
      startPath: getStartPath(attributes),
    }),
    [attributes, sessionId],
  );

  return (
    <AppStateContext.Provider value={appState}>
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  return useContext(AppStateContext);
}
