import React from 'react';

interface EventCounterProps {
  count: string | number;
  label: string;
}

const EventCounter: React.FC<EventCounterProps> = ({ count, label }) => {
  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow-md w-full h-36">
        <div className="text-sm text-gray-600 mb-4">{label}</div>
      <div className="text-4xl font-bold text-gray-900">{count}</div>
    </div>
  );
};

export default EventCounter;
