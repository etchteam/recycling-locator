import { Meta, StoryObj } from '@storybook/preact';

import './Container';
import ContainerSVG from './ContainerSVG';

const meta: Meta = {
  title: 'Components/Content/Container',
};

export default meta;

export const Container: StoryObj = {
  render: () => (
    <evg-grid wrap="wrap">
      <evg-grid-item small-mobile="12">
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
      </evg-grid-item>
      <evg-grid-item small-mobile="12">
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
      </evg-grid-item>
      <evg-grid-item small-mobile="12">
        <locator-container>
          <locator-container-icon>
            <ContainerSVG bodyColour="#2d9cdb" lidColour="#2d9cdb" name="Box" />
          </locator-container-icon>
          <locator-container-content>
            <locator-container-name>Paid for box</locator-container-name>
          </locator-container-content>
        </locator-container>
      </evg-grid-item>
      <evg-grid-item small-mobile="12">
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
      </evg-grid-item>
    </evg-grid>
  ),
};

export const Trolibocs: StoryObj = {
  render: () => (
    <evg-grid wrap="wrap">
      <evg-grid-item small-mobile="12">
        <locator-container>
          <locator-container-icon>
            <ContainerSVG name="Trolibocs" bodyColour="pink" />
          </locator-container-icon>
          <locator-container-content>
            <locator-container-name>
              <h4>Single Colour Trolibocs</h4>
            </locator-container-name>
          </locator-container-content>
        </locator-container>
      </evg-grid-item>
      <evg-grid-item small-mobile="12">
        <locator-container>
          <locator-container-icon>
            <ContainerSVG
              name="Trolibocs - Top box"
              bodyColour="pink"
              lidColour="yellow"
            />
          </locator-container-icon>
          <locator-container-content>
            <locator-container-name>
              <h4>Top Trolibocs</h4>
            </locator-container-name>
          </locator-container-content>
        </locator-container>
      </evg-grid-item>
      <evg-grid-item small-mobile="12">
        <locator-container>
          <locator-container-icon>
            <ContainerSVG
              name="Trolibocs - Middle box"
              bodyColour="pink"
              lidColour="yellow"
            />
          </locator-container-icon>
          <locator-container-content>
            <locator-container-name>
              <h4>Middle Trolibocs</h4>
            </locator-container-name>
          </locator-container-content>
        </locator-container>
      </evg-grid-item>
      <evg-grid-item small-mobile="12">
        <locator-container>
          <locator-container-icon>
            <ContainerSVG
              name="Trolibocs - Bottom box"
              bodyColour="pink"
              lidColour="yellow"
            />
          </locator-container-icon>
          <locator-container-content>
            <locator-container-name>
              <h4>Bottom Trolibocs</h4>
            </locator-container-name>
          </locator-container-content>
        </locator-container>
      </evg-grid-item>
      <evg-grid-item small-mobile="12">
        <locator-container>
          <locator-container-icon>
            <ContainerSVG
              name="Trolibocs – 3 containers"
              colours={{
                'Trolibocs - Top box': {
                  bodyColour: 'pink',
                  lidColour: 'yellow',
                },
                'Trolibocs - Middle box': {
                  bodyColour: 'blue',
                  lidColour: 'green',
                },
                'Trolibocs - Bottom box': {
                  bodyColour: 'purple',
                  lidColour: 'orange',
                },
              }}
            />
          </locator-container-icon>
          <locator-container-content>
            <locator-container-name>
              <h4>Muilticolour Trolibocs</h4>
            </locator-container-name>
          </locator-container-content>
        </locator-container>
      </evg-grid-item>
    </evg-grid>
  ),
};
