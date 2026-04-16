import getContainerColours from '@/lib/getContainerColours';
import { captureException } from '@/lib/sentry';
import { ContainerName } from '@/types/locatorApi';

import containerIcons from './icons';

export interface ContainerSvgAttributes {
  readonly name: ContainerName;
  readonly bodyColour?: string;
  readonly lidColour?: string;
  readonly label?: string;
  readonly colours?: { [key: string]: { [key: string]: string } };
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
  colours,
}: ContainerSvgAttributes) {
  if (!name || (name as string) === 'undefined') {
    return null;
  }

  const svgName = containerNameToSvgName[name];
  const svg = containerIcons[svgName];

  if (!svg) {
    captureException(new Error(`Missing container SVG: ${name}`), {
      component: 'ContainerSvg',
      containerName: name,
    });
    return null;
  }

  const cssVariables = getContainerColours(
    name,
    bodyColour,
    lidColour,
    colours,
  );

  return (
    <div
      className="container-svg"
      role="img"
      aria-label={label}
      aria-hidden={!label}
      style={cssVariables}
      {...{ 'lid-colour': lidColour, 'body-colour': bodyColour }}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
