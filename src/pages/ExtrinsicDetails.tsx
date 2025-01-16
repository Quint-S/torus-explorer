import { gql, useQuery } from '@apollo/client'
import {TerminalTabs, TerminalWindow} from '../components/TerminalWindow'
import {useParams} from 'react-router-dom'
import { TerminalLoading } from '../components/TerminalLoading.tsx'
import {CopyButton} from "../components/CopyButton.tsx";
// import {ExtrinsicEvents} from "./ExtrinsicEvents.tsx";
import { DetailValue } from './AccountDetails.tsx'
import { DetailLabel } from './AccountDetails.tsx'
import { DetailRow } from './AccountDetails.tsx'
import { ExtrinsicEvents } from './ExtrinsicEvents.tsx';
import { Helmet } from 'react-helmet-async';

export const GET_EXTRINSIC = gql`
  query GetExtrinsic($id: String!) {
    extrinsic(id: $id) {
      id
      module
      method
      blockNumber
      extrinsicId
      tip
      version
      signer
      success
      hash
      args
    }
  }
`

export const GET_EXTRINSIC_BY_HASH = gql`
  query GetExtrinsic($id: String!) {
    extrinsics(first: 1, filter: {hash: {equalTo: $id}}) {
    nodes{
      id
      module
      method
      blockNumber
      extrinsicId
      tip
      version
      signer
      success
      hash
      args
      }
    }
  }
`


export const ExtrinsicDetails = () => {
  const { id } = useParams()
  const { loading, error, data } = useQuery(id?.startsWith('0x') ? GET_EXTRINSIC_BY_HASH : GET_EXTRINSIC, {
    variables: { id }
  })
    let extrinsic = data?.extrinsic;
    if(id?.startsWith('0x') && data){
        extrinsic = data.extrinsics.nodes[0];
    }

  if (!id) {
    return <div>Error: No extrinsic ID provided</div>
  }

  const title = extrinsic ? `Extrinsic ${extrinsic.module}::${extrinsic.method} | Torus Explorer` : 'Extrinsic Details | Torus Explorer';
  const description = extrinsic 
    ? `Extrinsic ${extrinsic.id} - ${extrinsic.module}::${extrinsic.method} called by ${extrinsic.signer} - Status: ${extrinsic.success ? 'Success' : 'Failed'}`
    : 'View extrinsic details on Torus Explorer';

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        {extrinsic && (
          <>
            <meta property="og:url" content={window.location.href} />
            <meta name="twitter:card" content="summary" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
          </>
        )}
      </Helmet>
      <TerminalWindow title={`view_extrinsic`}>
      {loading && <TerminalLoading />}
      {error && <div>Error: {error.message}</div>}
      {!loading && !data && <div>Error: Extrinsic {id} not found.</div>}
      {extrinsic && (
        <div>
          <DetailRow>
            <DetailLabel>Extrinsic ID:</DetailLabel>
            <DetailValue>{extrinsic.id} <CopyButton textToCopy={extrinsic.id}/></DetailValue>
          </DetailRow>
          <DetailRow>
            <DetailLabel>Block Number:</DetailLabel>
            <DetailValue>{extrinsic.blockNumber}</DetailValue>
          </DetailRow>
          <DetailRow>
            <DetailLabel>Module:</DetailLabel>
            <DetailValue>{extrinsic.module}</DetailValue>
          </DetailRow>
          <DetailRow>
            <DetailLabel>Method:</DetailLabel>
            <DetailValue>{extrinsic.method}</DetailValue>
          </DetailRow>
          <DetailRow>
            <DetailLabel>Signer:</DetailLabel>
            <DetailValue>{extrinsic.signer} <CopyButton textToCopy={extrinsic.signer}/></DetailValue>
          </DetailRow>
          <DetailRow>
            <DetailLabel>Status:</DetailLabel>
            <DetailValue>{extrinsic.success ? 'Success' : 'Failed'}</DetailValue>
          </DetailRow>
          <DetailRow>
            <DetailLabel>Hash:</DetailLabel>
            <DetailValue>{extrinsic.hash} <CopyButton textToCopy={extrinsic.hash}/></DetailValue>
          </DetailRow>
          <DetailRow>
            <DetailLabel>Arguments:</DetailLabel>
            <DetailValue>{extrinsic.args}</DetailValue>
          </DetailRow>
            <TerminalTabs
                tabs={[
                    {
                        label: 'Events',
                        content: <ExtrinsicEvents extrinsicId={extrinsic.id} />
                    }
                ]}
            />
        </div>

      )}


    </TerminalWindow>
    </>
  )
}