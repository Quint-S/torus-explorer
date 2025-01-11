import { useEffect, useState } from 'react';

export const TerminalLoading = () => {
  const [frame, setFrame] = useState(0);
  const frames = ['|', '/', '-', '\\'];
  
  useEffect(() => {
    const interval = setInterval(() => {
      setFrame(prev => (prev + 1) % frames.length);
    }, 100); // Adjust speed by changing interval duration

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="">
      {frames[frame]} Loading...
    </div>
  );
};