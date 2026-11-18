// Scales a logo to equal area rather than equal height, so wide logos don't dominate
export default function getLogoScale(
  width: number,
  height: number,
): number | null {
  if (!width || !height) {
    return null;
  }

  return Math.sqrt(width / height);
}
