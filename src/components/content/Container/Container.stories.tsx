import { Meta, StoryObj } from '@storybook/preact';
import '@etchteam/diamond-ui/composition/Grid/Grid';
import '@etchteam/diamond-ui/composition/Grid/GridItem';
import '@etchteam/diamond-ui/control/Button/Button';

import './Container';
import ContainerSVG from './ContainerSVG';

const meta: Meta = {
  title: 'Components/Content/Container',
};

export default meta;

export const Container: StoryObj = {
  render: () => (
    <diamond-grid wrap="wrap">
      <diamond-grid-item small-mobile="12">
        <locator-container>
          <locator-container-icon>
            <ContainerSVG
              name="Communal Wheeled Bin"
              label="locator-container-icon doesn't need to be inside a locator-container"
              bodyColour="red"
              lidColour="black"
            />
          </locator-container-icon>
        </locator-container>
      </diamond-grid-item>
      <diamond-grid-item small-mobile="12">
        <locator-container>
          <locator-container-icon>
            <ContainerSVG
              name="Wheeled Bin"
              lidColour="black"
              bodyColour="pink"
            />
          </locator-container-icon>
          <locator-container-content>
            <locator-container-name>
              <h4>Named box</h4>
            </locator-container-name>
          </locator-container-content>
        </locator-container>
      </diamond-grid-item>
      <diamond-grid-item small-mobile="12">
        <locator-container>
          <locator-container-icon>
            <ContainerSVG bodyColour="#2d9cdb" lidColour="#2d9cdb" name="Box" />
          </locator-container-icon>
          <locator-container-content>
            <locator-container-name>Paid for box</locator-container-name>
          </locator-container-content>
        </locator-container>
      </diamond-grid-item>
      <diamond-grid-item small-mobile="12">
        <locator-container>
          <locator-container-icon>
            <ContainerSVG bodyColour="#2d9cdb" name="Kitchen Caddy" />
          </locator-container-icon>
          <locator-container-content>
            <locator-container-name>
              Kitchen caddy with notes
            </locator-container-name>
          </locator-container-content>
        </locator-container>
      </diamond-grid-item>
    </diamond-grid>
  ),
};

export const Troliboxes: StoryObj = {
  render: () => (
    <diamond-grid wrap="wrap">
      <diamond-grid-item small-mobile="12">
        <locator-container>
          <locator-container-icon>
            <ContainerSVG name="Trolibocs" bodyColour="pink" />
          </locator-container-icon>
          <locator-container-content>
            <locator-container-name>
              <h4>Single Color Trolibox</h4>
            </locator-container-name>
          </locator-container-content>
        </locator-container>
      </diamond-grid-item>
      <diamond-grid-item small-mobile="12">
        <locator-container>
          <locator-container-icon>
            <ContainerSVG
              name="Trolibox - Top box"
              bodyColour="pink"
              lidColour="yellow"
            />
          </locator-container-icon>
          <locator-container-content>
            <locator-container-name>
              <h4>Top Trolibox</h4>
            </locator-container-name>
          </locator-container-content>
        </locator-container>
      </diamond-grid-item>
      <diamond-grid-item small-mobile="12">
        <locator-container>
          <locator-container-icon>
            <ContainerSVG
              name="Trolibox - Middle box"
              bodyColour="pink"
              lidColour="yellow"
            />
          </locator-container-icon>
          <locator-container-content>
            <locator-container-name>
              <h4>Middle Trolibox</h4>
            </locator-container-name>
          </locator-container-content>
        </locator-container>
      </diamond-grid-item>
      <diamond-grid-item small-mobile="12">
        <locator-container>
          <locator-container-icon>
            <ContainerSVG
              name="Trolibox - Bottom box"
              bodyColour="pink"
              lidColour="yellow"
            />
          </locator-container-icon>
          <locator-container-content>
            <locator-container-name>
              <h4>Bottom Trolibox</h4>
            </locator-container-name>
          </locator-container-content>
        </locator-container>
      </diamond-grid-item>
      <diamond-grid-item small-mobile="12">
        <locator-container>
          <locator-container-icon>
            <ContainerSVG
              name="Trolibox – 3 containers"
              colors={{
                'Trolibox - Top box': {
                  bodyColour: 'pink',
                  lidColour: 'yellow',
                },
                'Trolibox - Middle box': {
                  bodyColour: 'blue',
                  lidColour: 'green',
                },
                'Trolibox - Bottom box': {
                  bodyColour: 'purple',
                  lidColour: 'orange',
                },
              }}
            />
          </locator-container-icon>
          <locator-container-content>
            <locator-container-name>
              <h4>Muilticolor Trolibox</h4>
            </locator-container-name>
          </locator-container-content>
        </locator-container>
      </diamond-grid-item>
    </diamond-grid>
  ),
};
