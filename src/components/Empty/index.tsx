import EmptyIcon from '@/assets/empty.png';
import React from 'react';
const Empty = () => {
  return (
    <div>
      <div className="text-center py-12 bg-[#F9FAFB] rounded-sm">
        <img
          width={49}
          height={49}
          className="m-auto"
          src={EmptyIcon}
          alt="alt"
        />
        <div style={{ color: '#718096' }}>No results</div>
      </div>
    </div>
  );
};

export default Empty;
