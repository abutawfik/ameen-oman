import type { SearchResult } from '@/mocks/searchData';
import TravelerCard from './TravelerCard';

interface Props {
  results: SearchResult[];
  isAr: boolean;
}

export default function ResultCardView({ results, isAr }: Props) {
  return (
    <div style={{ padding: '16px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 12 }}>
      {results.map(r => (
        <TravelerCard key={r.id} result={r} isAr={isAr} />
      ))}
    </div>
  );
}
