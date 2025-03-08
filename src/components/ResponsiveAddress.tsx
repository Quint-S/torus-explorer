import { useEffect, useState, useRef } from 'react';
import {Link} from "react-router-dom";

interface ResponsiveAddressProps {
  address: string;
  linkPath?: string;
}
const ADDRESS_BOOK = [
  { name: "BASE BRIDGE", address: "5DDXwRsgvdfukGZbq2o27n43qyDaAnZ6rsfeckGxnaQ1ih2D" },
];

export const ResponsiveAddress = ({ address, linkPath }: ResponsiveAddressProps) => {
  const [formattedAddress, setFormattedAddress] = useState(`${address.slice(0, 1)}..${address.slice(-1)}`);
  const containerRef = useRef<HTMLAnchorElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const addressEntry = ADDRESS_BOOK.find(entry => entry.address === address);
  const displayName = addressEntry?.name;

  useEffect(() => {
    const updateAddressFormat = () => {
      if (!containerRef.current?.parentElement) return;
      const parentWidth = containerRef.current.parentElement.offsetWidth;

      const fontWidth = 8*2;
      const cutoff = parentWidth < 80 ? Math.min(2, (address.length-2)/2) : (parentWidth-32)/(fontWidth);

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


  return linkPath ? (
      <Link to={`/${linkPath}/${address}`} ref={containerRef} >
      <span style={{background: 'inherit'}}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}>
        {isHovered ? formattedAddress : (displayName || formattedAddress)}
      </span>
      </Link>
  ) : (
      <span ref={containerRef} style={{background: 'inherit'}}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}>
        {isHovered ? formattedAddress : (displayName || formattedAddress)}
      </span>
  );
};