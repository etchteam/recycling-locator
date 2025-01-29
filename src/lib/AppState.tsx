import uniqueId from 'lodash/uniqueId';
import { createContext } from 'preact';
import { useContext } from 'preact/hooks';

import { RecyclingLocatorAttributes } from '..';

import getStartPath from './getStartPath';

interface AppStateContext extends RecyclingLocatorAttributes {
  startPath: string;
  sessionId: string;
}

export const AppState = createContext<AppStateContext>(null);

export function createAppState(
  attributes: RecyclingLocatorAttributes,
): AppStateContext {
  const sessionId = (window?.crypto?.randomUUID?.() ??
    uniqueId('session')) as unknown as string;

  return {
    ...attributes,
    sessionId,
    startPath: getStartPath(attributes),
  };
}

export function useAppState() {
  return useContext(AppState);
}
