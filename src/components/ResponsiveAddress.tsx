import { useEffect, useState, useRef } from 'react';

interface ResponsiveAddressProps {
  address: string;
}

export const ResponsiveAddress = ({ address }: ResponsiveAddressProps) => {
  const [formattedAddress, setFormattedAddress] = useState(address);
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const updateAddressFormat = () => {
      if (!containerRef.current?.parentElement) return;
      
      const parentWidth = containerRef.current.parentElement.offsetWidth;
      const fontSize = 15;//might need to change
      const cutoff = (parentWidth-30)/(fontSize)
      if(cutoff < address.length/2){
        setFormattedAddress(`${address.slice(0, cutoff)}..${address.slice(-cutoff)}`);
      }else{
        setFormattedAddress(address);
      }


    };

    const observer = new ResizeObserver(updateAddressFormat);
    if (containerRef.current?.parentElement) {
      observer.observe(containerRef.current.parentElement);
    }

    // Initial format
    updateAddressFormat();

    return () => {
      observer.disconnect();
    };
  }, [address]);

  return <div style={{width: '100%'}}><span ref={containerRef}>{formattedAddress}</span></div>;
};