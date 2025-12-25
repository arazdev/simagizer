import React from 'react';
import SummaryItem from './SummaryItem';

function SummaryList({ summaries, onDelete, onUpdate, apiKey, settings }) {
  return (
    <div className="summary-list">
      {summaries.map((summary) => (
        <SummaryItem
          key={summary.id}
          summary={summary}
          onDelete={() => onDelete(summary.id)}
          onUpdate={(updates) => onUpdate(summary.id, updates)}
          apiKey={apiKey}
          settings={settings}
        />
      ))}
    </div>
  );
}

export default SummaryList;
