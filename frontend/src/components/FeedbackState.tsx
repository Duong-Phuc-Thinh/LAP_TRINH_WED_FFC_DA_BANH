import type { ReactNode } from 'react';

interface FeedbackStateProps {
  loading?: boolean;
  error?: string;
  empty?: boolean;
  emptyMessage?: string;
  children: ReactNode;
}

function FeedbackState({ loading, error, empty, emptyMessage = 'No data found.', children }: FeedbackStateProps) {
  if (loading) {
    return (
      <div className="page-state loading-state">
        <span className="loading-shimmer" />
        Loading tournament data...
      </div>
    );
  }

  if (error) {
    return <div className="page-state error-state">{error}</div>;
  }

  if (empty) {
    return <div className="page-state empty-state">{emptyMessage}</div>;
  }

  return <>{children}</>;
}

export default FeedbackState;
