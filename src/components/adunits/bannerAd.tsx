import React, { useEffect } from 'react';

const BannerAd: React.FC = () => {
  useEffect(() => {
    // Define the atOptions object
    const atOptions = {
      key: '1ab6501e38afce528eed9edd0776ffa3',
      format: 'iframe',
      height: 60,
      width: 468,
      params: {},
    };

    // Add atOptions to the global window object
    (window as any).atOptions = atOptions;

    // Create and append the script element
    const script = document.createElement('script');
    script.src = '//www.highperformanceformat.com/1ab6501e38afce528eed9edd0776ffa3/invoke.js';
    script.async = true;
    document.body.appendChild(script);

    // Cleanup the script on component unmount
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return <div style={{ width: 468, height: 60 }} />;
};

export default BannerAd;
