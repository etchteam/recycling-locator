import * as Sentry from '@sentry/browser';
import { Suspense, lazy } from 'preact/compat';

import { ContainerName } from '@/types/locatorApi';

// The blank svg takes up the same space as a wheeled bin would whilst the icon is loading
import BlankSvg from './svg/blank.svg?react';
export interface ContainerSvgAttributes {
  readonly name: ContainerName;
  readonly bodyColour?: string;
  readonly lidColour?: string;
  readonly label?: string;
  readonly colors?: { [key: string]: { [key: string]: string } };
}

const containerNameToSvgName: { [key in ContainerName]: string } = {
  Box: 'box',
  'Communal Wheeled Bin': 'communal-bin',
  'Householder Provided Carrier Bag': 'carrier-bag',
  'Inner Caddy': 'inner-caddy',
  'Kerbside Caddy': 'caddy',
  'Kitchen Caddy': 'caddy',
  'Reusable Sack': 'sack',
  'Non-Reusable Sack': 'sack',
  'Wheeled Bin': 'wheeled-bin',
  Trolibocs: 'trolibox',
  'Trolibox - Top box': 'trolibox-multi',
  'Trolibox - Middle box': 'trolibox-multi',
  'Trolibox - Bottom box': 'trolibox-multi',
  'Trolibox – 3 containers': 'trolibox-multi',
};

const boxPositionMap = {
  'Trolibox - Top box': 'top',
  'Trolibox - Middle box': 'middle',
  'Trolibox - Bottom box': 'bottom',
};

const getPositionColours = (
  position: string,
  lidColor: string,
  bodyColor: string,
) => ({
  [`--lid-${position}-colour`]: lidColor,
  [`--body-${position}-colour`]: bodyColor,
});

const getContainerColours = (
  name: ContainerName,
  lidColour: string,
  bodyColour: string,
  colors?: { [key: string]: { [key: string]: string } },
) => {
  const positions = Object.keys(boxPositionMap);
  if (name !== 'Trolibox – 3 containers' && !positions.includes(name)) {
    return {
      '--lid-colour': lidColour ?? 'transparent',
      '--body-colour': bodyColour,
    };
  }

  if (name === 'Trolibox – 3 containers') {
    return Object.assign(
      {},
      ...positions.map((position) =>
        getPositionColours(
          boxPositionMap[position],
          colors[position]['lidColour'] ?? 'transparent',
          colors[position]['bodyColour'],
        ),
      ),
    );
  }

  return getPositionColours(
    boxPositionMap[name],
    lidColour ?? 'transparent',
    bodyColour,
  );
};

export default function ContainerSvg({
  name,
  lidColour,
  bodyColour,
  label,
  colors,
}: ContainerSvgAttributes) {
  if (!name || (name as string) === 'undefined') {
    return null;
  }

  const ContainerIconSvg = lazy(() => {
    return import(`./svg/${containerNameToSvgName[name]}.svg?react`).catch(
      (error) => {
        Sentry.captureException(error, {
          tags: { component: 'ContainerSvg', containerName: name },
        });
        return Promise.resolve({ default: BlankSvg });
      },
    );
  });

  const cssVariables = getContainerColours(name, lidColour, bodyColour, colors);

  return (
    <Suspense fallback={BlankSvg}>
      <ContainerIconSvg
        className="container-svg"
        aria-label={label}
        aria-hidden={!label}
        style={cssVariables}
      />
    </Suspense>
  );
}
