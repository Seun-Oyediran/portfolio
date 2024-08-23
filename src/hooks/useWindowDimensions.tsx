import { useState, useEffect } from 'react';

export default function useWindowDimensions() {
  const [dimensions, setDimensions] = useState({ width: 1, height: 1 });

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // Initial measurement
    updateDimensions();

    // Add event listener for window resize
    window.addEventListener('resize', updateDimensions);

    // Cleanup function to remove the event listener
    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);

  return dimensions;
}
