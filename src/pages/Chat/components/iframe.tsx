import React from 'react';
const SwapIframe = (props) => {
  const { src } = props;
  return (
    <div>
      <iframe
        src={src}
        style={{
          marginTop: 10,
          border: '1px solid rgba(0, 0, 0, 0.1)',
          borderRadius: 16,
        }}
        height="500px"
        width="100%"
        frameborder="0"
      ></iframe>
    </div>
  );
};

export default SwapIframe;
