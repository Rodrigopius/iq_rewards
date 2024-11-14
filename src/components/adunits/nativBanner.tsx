import React, { useEffect } from 'react';

const NativeBanner: React.FC = () => {
  useEffect(() => {
    // Create and append the script element
    const script = document.createElement('script');
    script.src = '//pl24930403.profitablecpmrate.com/f66b06de2c173b4c185abd705f142a3b/invoke.js';
    script.async = true;
    script.setAttribute('data-cfasync', 'false');
    document.body.appendChild(script);

    // Cleanup the script on component unmount
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return <div id="container-f66b06de2c173b4c185abd705f142a3b" />;
};

export default NativeBanner;
