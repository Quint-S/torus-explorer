import { gql, useQuery } from '@apollo/client'
import { TerminalWindow } from '../components/TerminalWindow'
import {formatTORUS} from "../utils/utils.ts";
import {ASCIILogo} from "../components/ASCIILogo.tsx";
import {DetailLabel, DetailRow, DetailValue} from "./AccountDetails.tsx";

const GET_NETWORK_INFO = gql`
  query {
    _metadata {
      lastProcessedHeight
      lastProcessedTimestamp
      targetHeight
      chain
      specName
    }
    chainInfo(id: "CircSupply") {
      value
    }
  }
`

export const Home = () => {
  const { loading, error, data } = useQuery(GET_NETWORK_INFO)

  return (
    <TerminalWindow title="Network Overview">
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error.message}</div>}
      {data && (

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
                  <DetailValue>{new Date(parseInt(data._metadata.lastProcessedTimestamp)).toLocaleString()}</DetailValue>
              </DetailRow>
              <DetailRow>
                  <DetailLabel>Target Height:</DetailLabel>
                  <DetailValue>{data._metadata.targetHeight}</DetailValue>
              </DetailRow>
              <DetailRow>
                  <DetailLabel>Circulating supply:</DetailLabel>
                  <DetailValue>{formatTORUS(data.chainInfo.value)} ♓︎TORUS</DetailValue>
              </DetailRow>
          </div>
      )}
        <div className="flex justify-center"><ASCIILogo/></div>

    </TerminalWindow>
)
}