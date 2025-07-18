import '@etchteam/diamond-ui/canvas/Section/Section';

export default function ExamplePage({ title }: { readonly title: string }) {
  return (
    <diamond-section padding="lg">
      <h2>{title} Page</h2>
    </diamond-section>
  );
}
