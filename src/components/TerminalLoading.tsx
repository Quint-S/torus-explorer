import { useEffect, useState } from 'react';

export const TerminalLoading = () => {
  const [frame, setFrame] = useState(0);
  const frames = [
    '⠋', '⠙', '⠸', '⢠', '⣄', '⡠', '⠐', '⠁'
  ];  

    const startColor = [200, 0, 255];
    const endColor = [0, 234, 255];
  
    const interpolateColor = (start: number[], end: number[], factor: number): string => {
      const result = start.map((s, i) => Math.round(s + (end[i] - s) * factor));
      return `rgb(${result.join(',')})`;
    };

  useEffect(() => {
    const interval = setInterval(() => {
      setFrame(prev => (prev + 1) % frames.length);
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const colorFactor = frame / (frames.length - 1);
  const color = interpolateColor(startColor, endColor, colorFactor);

  return (
    <div style={{ color }}>
      {frames[frame]} Loading...
    </div>
  );
};