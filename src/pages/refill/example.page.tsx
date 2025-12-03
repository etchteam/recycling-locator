import '@etchteam/diamond-ui/canvas/Section/Section';
import { useSearchParams } from '@/hooks/useSearchParams';

export default function ExamplePage({ title }: { readonly title: string }) {
  const [searchParams] = useSearchParams();
  const postcode = searchParams.get('postcode');

  return (
    <diamond-section padding="lg">
      <h2>{title} Page</h2>
      <p>{postcode || 'No postcode provided'}</p>
    </diamond-section>
  );
}
