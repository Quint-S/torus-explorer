import {useEffect, useState} from 'react';
import styled from 'styled-components';
import {TerminalLoading} from "./TerminalLoading.tsx";
import {gql, useQuery} from "@apollo/client";
import {formatTORUS} from "../utils/utils.ts";

const StatusBarContainer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #282A36;
  color: #f8f8f2;
  text-shadow: 2px 2px 0 #0b0b0b;
  //font-family: monospace;
  padding: 4px 8px;
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid #44475a;
  z-index: 1000;
`;

const StatusItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0 8px;
  &:not(:first-child) {
    border-left: 1px solid #44475a;
  }
`;

const TimeStatusItem = styled(StatusItem)`
  @media (max-width: 475px) {
    display: none;
  }
`;

export interface DexScreenerResponse {
  pairs: Array<{
    priceUsd: string;
    volume: { h24: number };
    liquidity: { usd: number };
  }>;
}

const GET_SUPPLY = gql`
  query GetSupply {
    circSupply: chainInfo(id: "CircSupply") {
      value
    }
    totalStake: chainInfo(id: "TotalStake") {
      value
    }
  }
`
export let currentPrice = 0;
export const StatusBar = () => {
  const { loading, error, data } = useQuery(GET_SUPPLY);
  const [price, setPrice] = useState<string | null>(null);
  const [loadingPrice, setLoadingPrice] = useState(true);
  const [time, setTime] = useState(new Date().toLocaleTimeString('en-US', { timeZone: 'UTC' }));

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const response = await fetch('https://api.dexscreener.com/latest/dex/tokens/0x78EC15C5FD8EfC5e924e9EEBb9e549e29C785867');
        const data: DexScreenerResponse = await response.json();
        const pairData = data.pairs[0];
        setPrice(pairData.priceUsd);
        currentPrice = parseFloat(pairData.priceUsd);
        setLoadingPrice(false);
      } catch (error) {
        console.error('Error fetching price:', error);
        setPrice('');
        setLoadingPrice(false);
      }
    };

    fetchPrice();
    const interval = setInterval(fetchPrice, 30_000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timeInterval = setInterval(() => {
      setTime(new Date().toLocaleString('en-US', { timeZone: 'UTC' }));
    }, 1000);

    return () => clearInterval(timeInterval);
  }, []);

  // const formatUSD = (value: number) => {
  //   return new Intl.NumberFormat('en-US', {
  //     style: 'currency',
  //     currency: 'USD',
  //     minimumFractionDigits: 2,
  //     maximumFractionDigits: 2,
  //   }).format(value);
  // };



  return (
    <StatusBarContainer>
      {!loading && !error && (
          <StatusItem>
            <span>Circulating:</span>
            <span>{loading ? <TerminalLoading/> : <>♓︎{formatTORUS(parseInt(data.circSupply.value))}︎</>}</span>
          </StatusItem>
      )}
      <StatusItem>
        {loadingPrice ? (
          <span><TerminalLoading/></span>
        ) : (
          <span>${price}</span>
        )}
      </StatusItem>

      <TimeStatusItem>
        {time}
      </TimeStatusItem>
    </StatusBarContainer>
  );
}; 