import { ComponentChildren } from 'preact';

import { useAppState } from '@/hooks/AppStateProvider';
import { CustomElement } from '@/types/customElement';

export default function MapSvg({
  children,
}: Readonly<{ children?: ComponentChildren }>) {
  const { publicPath } = useAppState();
  const imgSrc = `${publicPath}images/map.svg`;

  return (
    <locator-map-svg>
      <img src={imgSrc} alt="" />
      {children && (
        <locator-map-svg-content>{children}</locator-map-svg-content>
      )}
    </locator-map-svg>
  );
}

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'locator-map-svg': CustomElement;
      'locator-map-svg-content': CustomElement;
    }
  }
}
