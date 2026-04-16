import NotFoundOptions from '@/components/content/NotFoundOptions/NotFoundOptions';

import PostcodeLayout from './postcode.layout';

/**
 * 404 page for recycling routes with a postcode.
 * e.g. /:postcode/unknown-route
 * Shows links to recycling (primary) and refill options for that postcode.
 */
export default function PostcodeNotFoundPage() {
  return (
    <PostcodeLayout>
      <locator-wrap>
        <evg-section padding="lg">
          <NotFoundOptions variant="recycling" />
        </evg-section>
      </locator-wrap>
    </PostcodeLayout>
  );
}
