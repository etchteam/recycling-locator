const svgImports = import.meta.glob('./svg/*.svg', {
  eager: true,
  query: '?raw',
  import: 'default',
});

const containerIcons: Record<string, string> = Object.fromEntries(
  Object.entries(svgImports).map(([path, content]) => [
    path.replace('./svg/', '').replace('.svg', ''),
    content as string,
  ]),
);

export default containerIcons;
