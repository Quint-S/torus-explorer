import { gql, useQuery } from '@apollo/client'
import { TerminalWindow } from '../components/TerminalWindow'
import { useParams } from 'react-router-dom'
import { TerminalLoading } from '../components/TerminalLoading.tsx'
import { CopyButton } from "../components/CopyButton.tsx"
import { DetailValue } from './AccountDetails.tsx'
import { DetailLabel } from './AccountDetails.tsx'
import { DetailRow } from './AccountDetails.tsx'
import { Helmet } from 'react-helmet-async'
import { ResponsiveAddress } from '../components/ResponsiveAddress.tsx'
import { TimeStamp } from '../components/TimeStamp.tsx'
import { Link } from 'react-router-dom'
import { formattedNumber } from '../utils/utils.ts'
import { AgentMetadata } from '../components/AgentMetadata'

const GET_AGENT = gql`
  query GetAgent($id: String!) {
    agent(id: $id) {
      id
      registeredAt
      timestamp
      extrinsicId
      metadata
      url
      stakingFee
      weightControlFee
      weightPenaltyFactor
      name
    }
  }
`

export const AgentDetails = () => {
  const { id } = useParams()
  const { loading, error, data } = useQuery(GET_AGENT, {
    variables: { id }
  })

  if (!id) {
    return <div>Error: No agent ID provided</div>
  }

  const agent = data?.agent

  const title = agent ? `Agent ${agent.name} | Torus Explorer` : 'Agent Details | Torus Explorer'
  const description = agent 
    ? `Agent ${agent.name} registered at block ${agent.registeredAt}`
    : 'View agent details on Torus Explorer'

  const isValidUrl = (url: string) => {
    try {
      const parsedUrl = new URL(url)
      return ['http:', 'https:'].includes(parsedUrl.protocol) && parsedUrl.hostname.includes('.')
    } catch {
      return false
    }
  }

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        {agent && (
          <>
            <meta property="og:url" content={window.location.href} />
            <meta name="twitter:card" content="summary" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
          </>
        )}
      </Helmet>
      <TerminalWindow title="view_agent">
        {loading && <TerminalLoading />}
        {error && <div>Error: {error.message}</div>}
        {!loading && !agent && <div>Error: Agent {id} not found.</div>}
        {agent && (
          <div>
            <DetailRow>
              <DetailLabel>Name:</DetailLabel>
              <DetailValue>
                {isValidUrl(agent.url) 
                  ? <a href={agent.url} target="_blank" rel="noopener noreferrer">{agent.name}</a> 
                  : agent.name}
              </DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel>Key:</DetailLabel>
              <DetailValue><ResponsiveAddress address={agent.id} linkPath={'account'}/> <CopyButton textToCopy={agent.id}/></DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel>Registration Block:</DetailLabel>
              <DetailValue><Link to={`/block/${agent.registeredAt}`}>{agent.registeredAt}</Link></DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel>Registration Extrinsic:</DetailLabel>
              <DetailValue>
                <Link to={`/extrinsic/${agent.registeredAt}-${formattedNumber(agent.extrinsicId)}`}>
                  {agent.registeredAt}-{formattedNumber(agent.extrinsicId)}
                </Link>
              </DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel>Registration date:</DetailLabel>
              <DetailValue><TimeStamp timestamp={agent.timestamp}/></DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel>URL:</DetailLabel>
              <DetailValue>
                {isValidUrl(agent.url) 
                  ? <a href={agent.url} target="_blank" rel="noopener noreferrer">{agent.url}</a> 
                  : agent.url}
              </DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel>Staking Fee:</DetailLabel>
              <DetailValue>{agent.stakingFee}</DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel>Weight Control Fee:</DetailLabel>
              <DetailValue>{agent.weightControlFee}</DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel>Weight Penalty Factor:</DetailLabel>
              <DetailValue>{agent.weightPenaltyFactor}</DetailValue>
            </DetailRow>

                {agent.metadata.startsWith('ipfs://') 
                  ? <AgentMetadata metadataIpfs={agent.metadata} />
                  : ( <DetailRow><DetailLabel>Metadata:</DetailLabel><DetailValue>{agent.metadata}</DetailValue></DetailRow>)
                }

          </div>
        )}
      </TerminalWindow>
    </>
  )
}