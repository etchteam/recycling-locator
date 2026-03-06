import type { ComponentChildren } from 'preact';

import '@/components/content/Icon/Icon';
import './LinkCard.css';

export interface LinkCardProps {
  children?: ComponentChildren;
}

export default function LinkCard({ children }: Readonly<LinkCardProps>) {
  return (
    <evg-card radius="sm" className="locator-link-card">
      <div className="link-card-arrow">
        <locator-icon icon="arrow-outward" color="primary" />
      </div>
      {children}
    </evg-card>
  );
}
