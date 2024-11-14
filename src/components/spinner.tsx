import React from 'react';

const Spinner: React.FC = () => {
  return (
    <div className="loader" style={loaderStyle} />
  );
};

// Spinner styles
const loaderStyle: React.CSSProperties = {
  width: '50px',
  height: '50px', // Add height for consistent sizing across all browsers
  aspectRatio: '1',
  borderRadius: '50%',
  background: 'white', // Set color to white
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto', // Center the spinner horizontally
  WebkitMask: 'repeating-conic-gradient(#0000 0deg, #000 1deg 70deg, #0000 71deg 90deg), radial-gradient(farthest-side, #0000 calc(100% - 8px - 1px), #000 calc(100% - 8px))',
  WebkitMaskComposite: 'destination-in',
  maskComposite: 'intersect',
  animation: 'rotate 1s infinite linear',
};

// Keyframes for animation
const styles = `
  @keyframes rotate {
    to { transform: rotate(0.5turn); }
  }
`;

// Append keyframes to the document
const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default Spinner;
