import { gql, useQuery } from '@apollo/client'
import { TerminalWindow } from '../components/TerminalWindow'

const GET_NETWORK_INFO = gql`
  query {
    _metadata {
      lastProcessedHeight
      lastProcessedTimestamp
      targetHeight
      chain
      specName
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
            <p>{data._metadata.chain}</p>
            <p>Spec: {data._metadata.specName}</p>
            <p>Last Processed Block: {data._metadata.lastProcessedHeight}</p>
            <p>Last Processed
              Timestamp: {new Date(parseInt(data._metadata.lastProcessedTimestamp)).toLocaleString()}</p>
            <p>Target Height: {data._metadata.targetHeight}</p>
          </div>
      )}
    </TerminalWindow>
  )
}