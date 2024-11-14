import React, { useEffect } from 'react';

const PopUnder = () => {
  useEffect(() => {
    // Create the script element
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = '//pl24930926.profitablecpmrate.com/37/5f/87/375f87db0f9099b9843f43ba72ff83fb.js';

    // Append the script to the component's div
    document.getElementById('ad-container')?.appendChild(script);

    // Cleanup to remove the script when the component unmounts
    return () => {
      document.getElementById('ad-container')?.removeChild(script);
    };
  }, []);

  return (
    <div id="ad-container" style={{ textAlign: 'center', margin: '20px 0' }}>
      {/* The ad script will load here */}
      <p>Loading ad...</p>
    </div>
  );
};

export default PopUnder;
