import { Location } from '@/types/locatorApi';

const WHAT_THREE_WORDS_REGEX = /\/\/\/[a-z]+\.[a-z]+\.[a-z]+(?![a-z.])/gi;

export default function getNotes(location: Location) {
  return location.locations
    .map((loc) => loc.notes?.trim())
    .filter(Boolean)
    .map((note) =>
      note.replaceAll(
        WHAT_THREE_WORDS_REGEX,
        (match) => `https://what3words.com/${match.slice(3)}`,
      ),
    );
}
