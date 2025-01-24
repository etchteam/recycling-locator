import * as Sentry from '@sentry/browser';
import { Suspense, lazy } from 'preact/compat';

import getContainerColours from '@/lib/getContainerColours';
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
  Trolibocs: 'trolibocs',
  'Trolibocs - Top box': 'trolibocs-multi',
  'Trolibocs - Middle box': 'trolibocs-multi',
  'Trolibocs - Bottom box': 'trolibocs-multi',
  'Trolibocs – 3 containers': 'trolibocs-multi',
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

  const cssVariables = getContainerColours(name, bodyColour, lidColour, colors);

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
