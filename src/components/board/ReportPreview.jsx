/**
 * Renders active slide (light #F8F9FA) using BoardSlideCard.
 */
import BoardSlideCard from './BoardSlideCard';

export default function ReportPreview({ slide }) {
  return (
    <div style={{ width: '100%', minHeight: 360 }}>
      <BoardSlideCard slide={slide} />
    </div>
  );
}
