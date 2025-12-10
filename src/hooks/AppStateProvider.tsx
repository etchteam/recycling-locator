import uniqueId from 'lodash/uniqueId';
import { ComponentChildren, createContext } from 'preact';
import { useContext } from 'preact/hooks';

import { RecyclingLocatorAttributes } from '@/index';
import getStartPath from '@/lib/getStartPath';

interface AppStateData extends RecyclingLocatorAttributes {
  startPath: string;
  sessionId: string;
}

interface AppStateProviderProps {
  readonly attributes: RecyclingLocatorAttributes;
  readonly children: ComponentChildren;
}

export const AppStateContext = createContext<AppStateData>(null);

export function AppStateProvider({
  children,
  attributes,
}: AppStateProviderProps) {
  const sessionId = (window?.wrapAnalyticsId ??
    window?.crypto?.randomUUID?.() ??
    uniqueId('session')) as unknown as string;

  const appState: AppStateData = {
    ...attributes,
    sessionId,
    startPath: getStartPath(attributes),
  };

  return (
    <AppStateContext.Provider value={appState}>
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  return useContext(AppStateContext);
}
