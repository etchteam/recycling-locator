const POSTCODE_REGEX = /[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}/i;

export default function cleanupAddress(address: string): string {
  return address
    .trim()
    .replace(/,,/g, ',')
    .split(',')
    .filter((line) => Boolean(line.trim()))
    .map((line) => {
      if (POSTCODE_REGEX.test(line)) {
        return line.trim();
      }

      return line
        .split(' ')
        .map(
          (word) =>
            word.trim().charAt(0).toUpperCase() +
            word.trim().toLocaleLowerCase().slice(1),
        )
        .join(' ')
        .trim();
    })
    .join(', ');
}
