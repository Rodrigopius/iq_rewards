import React, { useEffect } from 'react';

const SocialBar: React.FC = () => {
  useEffect(() => {
    // Dynamically add the ad script to the component
    const script = document.createElement('script');
    script.src = '//pl24930952.profitablecpmrate.com/c4/4d/25/c44d25b6f1b2e28de99411a15c1054fb.js';
    script.type = 'text/javascript';
    script.async = true;
    document.body.appendChild(script);

    // Cleanup script on component unmount
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return <div className="social-bar-ad" />;
};

export default SocialBar;
