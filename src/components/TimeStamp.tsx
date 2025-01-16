import { useEffect, useState, useRef } from 'react';

interface TimeStampProps {
  timestamp: string;
}

export const TimeStamp = ({ timestamp }: TimeStampProps) => {
  const [formattedTime, setFormattedTime] = useState(new Date(timestamp).toLocaleTimeString('en-US', { timeZone: 'UTC' }));
  const containerRef = useRef<HTMLSpanElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const timeFormatted = new Date(timestamp).toLocaleTimeString('en-US', { timeZone: 'UTC' });

  useEffect(() => {
    const updateTimeStampFormat = () => {
      if (!containerRef.current?.parentElement) return;
      
      const parentWidth = containerRef.current.parentElement.offsetWidth;
      if(parentWidth < 320){
        setFormattedTime(new Date(timestamp).toLocaleString('en-US', { timeZone: 'UTC' }).split(',')[0]);
      }else{
        setFormattedTime(new Date(timestamp).toLocaleString('en-US', { timeZone: 'UTC' }));
      }
    };

    const observer = new ResizeObserver(updateTimeStampFormat);
    if (containerRef.current?.parentElement) {
      observer.observe(containerRef.current.parentElement);
    }

    updateTimeStampFormat();

    return () => {
      observer.disconnect();
    };
  }, [timestamp]);

  return (
    <div 
      style={{width: '100%'}}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span ref={containerRef}>
        {!isHovered ? formattedTime : timeFormatted}
      </span>
    </div>
  );
};