import Linkify from 'linkify-react';

/**
 * Linkify calls this for each detected URL or text segment.
 *
 * what3words addresses go through a round-trip:
 *   1. getNotes converts `///word.word.word` → `https://what3words.com/word.word.word`
 *      so that Linkify recognises them as clickable URLs.
 *   2. This formatter converts those URLs back to `///word.word.word` for display,
 *      so the user sees the familiar `///` notation rather than a full URL.
 */
function formatWhat3WordsDisplay(value: string): string {
  if (value.startsWith('https://what3words.com/')) {
    return value.replace('https://what3words.com/', '///');
  }
  return value;
}

export default function PlaceNotes({ notes }: { readonly notes: string[] }) {
  if (notes.length === 0) {
    return null;
  }

  return (
    <>
      {notes.map((note) => (
        <dd key={note}>
          <Linkify
            options={{
              target: '_blank',
              rel: 'noopener noreferrer',
              nl2br: true,
              defaultProtocol: 'https',
              format: formatWhat3WordsDisplay,
            }}
          >
            {note}
          </Linkify>
        </dd>
      ))}
    </>
  );
}
