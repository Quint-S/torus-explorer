import { gql, useQuery } from '@apollo/client'
import { TerminalWindow } from '../components/TerminalWindow'
import {formatTORUS} from "../utils/utils.ts";
import {ASCIILogo} from "../components/ASCIILogo.tsx";
import {DetailLabel, DetailRow, DetailValue} from "./AccountDetails.tsx";
import { Helmet } from 'react-helmet-async';

const GET_NETWORK_INFO = gql`
  query {
    _metadata {
      lastProcessedHeight
      lastProcessedTimestamp
      targetHeight
      chain
      specName
    }
    circSupply: chainInfo(id: "CircSupply") {
      value
    }
    totalStake: chainInfo(id: "TotalStake") {
      value
    }
  }
`

export const Home = () => {
  const { loading, error, data } = useQuery(GET_NETWORK_INFO)

  const title = 'TorEx - Torus Blockchain Explorer';
  const description = data 
    ? `Explore the Torus blockchain - Current block height: ${data._metadata.lastProcessedHeight}, Circulating supply: ${formatTORUS(data.circSupply.value)} TORUS`
    : 'Explore the Torus blockchain - View blocks, transactions, accounts, and network statistics';

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
      </Helmet>
      <TerminalWindow title="Network Overview">
        {loading && <div>Loading...</div>}
        {error && <div>Error: {error.message}</div>}
        {data && (
          <div className="flex flex-col h-full">
            <div className={'p-2'}>
              <DetailRow>
                <DetailLabel>Chain:</DetailLabel>
                <DetailValue>{data._metadata.chain}</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>Spec:</DetailLabel>
                <DetailValue>{data._metadata.specName}</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>Last Processed Block:</DetailLabel>
                <DetailValue>{data._metadata.lastProcessedHeight}</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>Last Timestamp:</DetailLabel>
                <DetailValue>{new Date(parseInt(data._metadata.lastProcessedTimestamp)).toLocaleString('en-US', { timeZone: 'UTC' })} UTC</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>Target Height:</DetailLabel>
                <DetailValue>{data._metadata.targetHeight}</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>Total Supply:</DetailLabel>
                <DetailValue>{formatTORUS("144000000000000000000000000")} ♓︎TORUS</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>Circulating supply:</DetailLabel>
                <DetailValue>{formatTORUS((BigInt(data.circSupply.value) + BigInt(data.totalStake.value)).toString())} ♓︎TORUS</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>Staked:</DetailLabel>
                <DetailValue>{formatTORUS(data.totalStake.value)} ♓︎TORUS</DetailValue>
              </DetailRow>
            </div>
            <div className="flex-grow flex items-center justify-center">
              <ASCIILogo/>
            </div>
          </div>
        )}
      </TerminalWindow>
    </>
  )
}