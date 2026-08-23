import type { ReactNode } from 'react';

import timelineLine from '../../assets/figma/timeline-line.svg';
import timelineMarker from '../../assets/figma/timeline-marker.svg';
import { Button } from '../Button';

import './Timeline.css';

export type TimelineItem = {
  id: string;
  title: ReactNode;
  supportText?: ReactNode;
};

export interface TimelineProps {
  /** Events shown in chronological order. */
  items?: TimelineItem[];
  /** Replaces events with temporary loading placeholders. */
  loading?: boolean;
  /** Number of placeholder events while loading. */
  skeletonCount?: number;
  heading?: ReactNode;
  showMoreLabel?: ReactNode;
  onShowMore?: () => void;
  className?: string;
}

export function Timeline({
  items = [],
  loading = false,
  skeletonCount = 3,
  heading,
  showMoreLabel,
  onShowMore,
  className,
}: TimelineProps) {
  const placeholders = Array.from({ length: Math.max(1, skeletonCount) });
  const canShowMore = Boolean(showMoreLabel && onShowMore);

  return (
    <section className={['timeline', className].filter(Boolean).join(' ')} aria-busy={loading || undefined}>
      {heading && <header className="timeline__header"><h3 className="timeline__heading type-heading-md">{heading}</h3></header>}

      <ol className="timeline__list" aria-label={loading ? 'Loading events' : undefined}>
        {(loading ? placeholders : items).length > 1 && <img className="timeline__line" src={timelineLine} alt="" aria-hidden="true" />}
        {loading
          ? placeholders.map((_, index) => (
            <li className="timeline__item timeline__item--loading" key={index} aria-hidden="true">
              <img className="timeline__marker" src={timelineMarker} alt="" />
              <div className="timeline__content">
                <span className="timeline__skeleton timeline__skeleton--title" />
                <span className="timeline__skeleton timeline__skeleton--support" />
              </div>
            </li>
          ))
          : items.map((item) => (
            <li className="timeline__item" key={item.id}>
              <img className="timeline__marker" src={timelineMarker} alt="" aria-hidden="true" />
              <div className="timeline__content">
                <p className="timeline__title">{item.title}</p>
                {item.supportText && <p className="timeline__support">{item.supportText}</p>}
              </div>
            </li>
          ))}
      </ol>

      {canShowMore && <footer className="timeline__footer"><Button variant="secondary" size="sm" onClick={onShowMore}>{showMoreLabel}</Button></footer>}
    </section>
  );
}
