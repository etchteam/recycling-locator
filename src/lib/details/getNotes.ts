import { Location } from '@/types/locatorApi';

const WHAT_THREE_WORDS_REGEX = /\/\/\/[a-z]+\.[a-z]+\.[a-z]+(?![a-z.])/gi;

export default function getNotes(location: Location) {
  return location.locations
    .map((loc) => loc.notes?.trim())
    .filter(Boolean)
    .map((note) => {
      if (WHAT_THREE_WORDS_REGEX.test(note)) {
        return note
          .replace(WHAT_THREE_WORDS_REGEX, 'https://what3words.com/$&')
          .replace(/\/\/\//g, '');
      }

      return note;
    });
}
