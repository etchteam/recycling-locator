declare const __BUILD_TIME__: string;

declare module '*.svg?raw' {
  const content: string;
  export default content;
}
