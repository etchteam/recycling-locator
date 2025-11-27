import { Link, useParams } from 'react-router';
import '@etchteam/diamond-ui/canvas/Section/Section';
import '@/components/composition/Wrap/Wrap';

export default function RefillPlacesPage() {
  const { postcode } = useParams();

  return (
    <locator-wrap max-width="none" gutter="fluid">
      <diamond-section padding="md">
        <h1>Refill locations</h1>
        <p>
          <Link to={`/${postcode}/refill/discover`}>Discover refill</Link>
        </p>
      </diamond-section>
    </locator-wrap>
  );
}
