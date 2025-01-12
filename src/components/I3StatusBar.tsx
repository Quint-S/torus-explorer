import { useEffect, useState } from 'react';
import styled from 'styled-components';

const StatusBarContainer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #282A36;
  color: #f8f8f2;
  font-family: monospace;
  padding: 4px 8px;
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  border-top: 1px solid #44475a;
  z-index: 1000;
`;

const StatusItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0 8px;
  &:not(:last-child) {
    border-right: 1px solid #44475a;
  }
`;

interface DexScreenerResponse {
  pairs: Array<{
    priceUsd: string;
    volume: { h24: number };
    liquidity: { usd: number };
  }>;
}

export const I3StatusBar = () => {
  const [price, setPrice] = useState<string | null>(null);
  const [volume24h, setVolume24h] = useState<number | null>(null);
  const [liquidity, setLiquidity] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [time, setTime] = useState(new Date().toLocaleTimeString('en-US', { timeZone: 'UTC' }));

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const response = await fetch('https://api.dexscreener.com/latest/dex/tokens/0x78EC15C5FD8EfC5e924e9EEBb9e549e29C785867');
        const data: DexScreenerResponse = await response.json();
        
        // Get the USDC pair data (first pair in the response)
        const pairData = data.pairs[0];
        
        setPrice(pairData.priceUsd);
        setVolume24h(pairData.volume.h24);
        setLiquidity(pairData.liquidity.usd);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching price:', error);
        setPrice('Error');
        setLoading(false);
      }
    };

    fetchPrice();
    const interval = setInterval(fetchPrice, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timeInterval = setInterval(() => {
      setTime(new Date().toLocaleString('en-US', { timeZone: 'UTC' }));
    }, 1000);

    return () => clearInterval(timeInterval);
  }, []);

  const formatUSD = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  return (
    <StatusBarContainer>
      <StatusItem>
        <span>TORUS:</span>
        {loading ? (
          <span>Loading...</span>
        ) : (
          <span>${price}</span>
        )}
      </StatusItem>
      {!loading && volume24h && (
        <StatusItem>
          <span>VOL:</span>
          <span>{formatUSD(volume24h)}</span>
        </StatusItem>
      )}
      {!loading && liquidity && (
        <StatusItem>
          <span>LIQ:</span>
          <span>{formatUSD(liquidity)}</span>
        </StatusItem>
      )}
      <StatusItem>
        {time}
      </StatusItem>
    </StatusBarContainer>
  );
}; 