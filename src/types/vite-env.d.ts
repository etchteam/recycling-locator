declare const __BUILD_TIME__: string;

declare module '*.svg?react' {
  const PreactComponent: preact.FunctionComponent<
    preact.ComponentProps<'svg'> & { title?: string }
  >;

  export default PreactComponent;
}
