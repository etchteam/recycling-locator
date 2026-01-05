import { Meta, StoryObj } from '@storybook/preact';

const meta: Meta = {
  title: 'Components/Control/AlphabetNav',
};

export default meta;

export const AlphabetNav: StoryObj = {
  render: () => {
    const alphabet = [
      'A',
      'B',
      'C',
      'D',
      'E',
      'F',
      'G',
      'H',
      'I',
      'J',
      'K',
      'L',
      'M',
      'N',
      'O',
      'P',
      'Q',
      'R',
      'S',
      'T',
      'U',
      'V',
      'W',
      'X',
      'Y',
      'Z',
    ];

    return (
      <locator-alphabet-nav>
        <nav>
          <ul>
            {alphabet.map((letter) => (
              <li key={letter}>
                <diamond-button>
                  <a href={`#letter-${letter}`}>{letter}</a>
                </diamond-button>
              </li>
            ))}
          </ul>
        </nav>
      </locator-alphabet-nav>
    );
  },
};
