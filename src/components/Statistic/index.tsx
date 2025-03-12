import { Skeleton } from 'antd';
import React from 'react';

const Statistic = (props: {
  label: string;
  value: number | string;
  loading: boolean;
}) => {
  const { label, value, loading } = props;
  return (
    <div
      className="py-2"
      style={{ width: 120, height: 56, textAlign: 'center' }}
    >
      <div className="text-xs" style={{ color: '#6B7280' }}>
        {label}
      </div>
      {loading ? (
        <div className="mt-1">
          <Skeleton.Input
            size="small"
            active
            style={{ minWidth: 90, height: 20, width: 90 }}
          />
        </div>
      ) : (
        <div
          className="text-sm mt-1"
          style={{ color: '#3C465A', fontWeight: 700 }}
        >
          {value}
        </div>
      )}
    </div>
  );
};

export default Statistic;
