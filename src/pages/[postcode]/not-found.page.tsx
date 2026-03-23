import NotFoundOptions from '@/components/content/NotFoundOptions/NotFoundOptions';

import PostcodeLayout from './postcode.layout';

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
