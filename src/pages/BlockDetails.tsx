import { gql, useQuery } from '@apollo/client'
import {TerminalTabs, TerminalWindow} from '../components/TerminalWindow'
import {useParams} from 'react-router-dom'
import { TerminalLoading } from '../components/TerminalLoading.tsx'
import {CopyButton} from "../components/CopyButton.tsx";
import { DetailValue } from './AccountDetails.tsx'
import { DetailLabel } from './AccountDetails.tsx'
import { DetailRow } from './AccountDetails.tsx'
import { Helmet } from 'react-helmet-async';
import { BlockExtrinsics } from './BlockExtrinsics.tsx';
import { ResponsiveAddress } from '../components/ResponsiveAddress.tsx';

const GET_BLOCK = gql`
  query GetBlock($id: String!) {
    block(id: $id) {
      id
      height
      hash
      parentHash
      eventCount
      extrinsicCount
      specVersion
      timestamp
    }
  }
`

const GET_BLOCK_BY_HASH = gql`
  query GetBlockByHash($id: String!) {
    blocks(first: 1, filter: {hash: {equalTo: $id}}) {
      nodes {
        id
        height
        hash
        parentHash
        eventCount
        extrinsicCount
        specVersion
        timestamp
      }
    }
  }
`

export const BlockDetails = () => {
  const { height } = useParams()
  const { loading, error, data } = useQuery(height?.startsWith('0x') ? GET_BLOCK_BY_HASH : GET_BLOCK, {
    variables: { id: height }
  })

  if (!height) {
    return <div>Error: No block height or hash provided</div>
  }

  let block = data?.block;
  if (height?.startsWith('0x') && data) {
    block = data.blocks.nodes[0];
  }

  const title = block ? `Block #${block.height} | Torus Explorer` : 'Block Details | Torus Explorer';
  const description = block 
    ? `Block #${block.height} with ${block.extrinsicCount} extrinsics and ${block.eventCount} events at ${new Date(block.timestamp).toLocaleString()}`
    : 'View block details on Torus Explorer';

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        {block && (
          <>
            <meta property="og:url" content={window.location.href} />
            <meta name="twitter:card" content="summary" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
          </>
        )}
      </Helmet>
      <TerminalWindow title={`view_block`}>
        {loading && <TerminalLoading />}
        {error && <div>Error: {error.message}</div>}
        {!loading && !block && <div>Error: Block {height} not found.</div>}
        {block && (
          <div>
            <DetailRow>
              <DetailLabel>Height:</DetailLabel>
              <DetailValue>{block.height}</DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel>Hash:</DetailLabel>
              <DetailValue><ResponsiveAddress address={block.hash}/> <CopyButton textToCopy={block.hash}/></DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel>Parent Hash:</DetailLabel>
              <DetailValue><ResponsiveAddress linkPath='block' address={block.parentHash}/> <CopyButton textToCopy={block.parentHash}/></DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel>Extrinsic Count:</DetailLabel>
              <DetailValue>{block.extrinsicCount}</DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel>Event Count:</DetailLabel>
              <DetailValue>{block.eventCount}</DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel>Timestamp:</DetailLabel>
              <DetailValue>{new Date(block.timestamp).toLocaleString()}</DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel>Spec Version:</DetailLabel>
              <DetailValue>{block.specVersion}</DetailValue>
            </DetailRow>
          </div>
        )}

        <TerminalTabs
          tabs={[
            {
              label: 'Extrinsics',
              content: block ? <BlockExtrinsics blockHeight={block.height.toString()} /> : null
            }
          ]}
        />
      </TerminalWindow>
    </>
  )
} 