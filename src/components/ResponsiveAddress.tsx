import { useEffect, useState, useRef } from 'react';

interface ResponsiveAddressProps {
  address: string;
}
// ... existing imports ...

const ADDRESS_BOOK = [
  { name: "BASE BRIDGE", address: "5DDXwRsgvdfukGZbq2o27n43qyDaAnZ6rsfeckGxnaQ1ih2D" },
  // Add more entries as needed
];

export const ResponsiveAddress = ({ address }: ResponsiveAddressProps) => {
  const [formattedAddress, setFormattedAddress] = useState(`${address.slice(0, 1)}..${address.slice(-1)}`);
  const containerRef = useRef<HTMLSpanElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Find matching address in address book
  const addressEntry = ADDRESS_BOOK.find(entry => entry.address === address);
  const displayName = addressEntry?.name;

  useEffect(() => {
    const updateAddressFormat = () => {
      if (!containerRef.current?.parentElement) return;
      
      const parentWidth = containerRef.current.parentElement.offsetWidth;
      const fontWidth = 8*2;
      const cutoff = (parentWidth-32)/(fontWidth);

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

    updateAddressFormat();

    return () => {
      observer.disconnect();
    };
  }, [address, displayName]);

  return (
    <div 
      style={{width: '100%'}}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span ref={containerRef}>
        {!isHovered ? formattedAddress : (displayName || formattedAddress)}
      </span>
    </div>
  );
};