import { gql, useQuery } from '@apollo/client'
import { TerminalWindow } from '../components/TerminalWindow'
import {useState} from "react";
import {TerminalLoading} from "../components/TerminalLoading.tsx";
import {PaginationControls} from "../components/PaginationControls.tsx";
import {DataTable} from "../components/DataTable.tsx";
import {ResponsiveAddress} from "../components/ResponsiveAddress.tsx";
import {TimeStamp} from "../components/TimeStamp.tsx";
import {Link} from "react-router-dom";
import {formattedNumber} from "../utils/utils.ts";

const GET_AGENTS = gql`
  query GetAgents($first: Int!, $offset: Int!) {
    agents(first: $first, offset: $offset, orderBy: REGISTERED_AT_ASC) {
    nodes {
      registeredAt
      timestamp
      name
      metadata
      id
      extrinsicId
    }
    totalCount
    }
  }
`

export const Agents = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 25;

  const {loading, error, data} = useQuery(GET_AGENTS, {
    variables: {first: itemsPerPage, offset: currentPage * itemsPerPage}
  });


  const pageControls = (
      <>
        {loading && <TerminalLoading/>}
        {data && <PaginationControls
            currentPage={currentPage}
            totalCount={data?.agents.totalCount}
            itemsPerPage={itemsPerPage}
            dataLength={data?.agents.nodes.length}
            onPageChange={setCurrentPage}
        />}</>
  );
  return (
      <TerminalWindow title="agents" footer={pageControls}>
        {loading && <TerminalLoading/>}
        {error && <div>Error: {error.message}</div>}
        {data && <DataTable names={['name', 'key', 'register date', 'extrinsic']} records={data.agents.nodes.map((agent: { id: string; registeredAt: string; name: string; metadata: string; extrinsicId: number; timestamp: any;}) => {
          const isValidUrl = (url: string) => {
            try {
              const parsedUrl = new URL(url);
              return ['http:', 'https:'].includes(parsedUrl.protocol) && parsedUrl.hostname.includes('.');
            } catch {
              return false;
            }
          };
          
          return {
            id: agent.id,
            data: [
              isValidUrl(agent.metadata) ? <a className="whitespace-nowrap" href={agent.metadata} target="_blank" rel="noopener noreferrer">{agent.name}</a> : agent.name,
              <ResponsiveAddress linkPath={'account'} address={agent.id} />,
              <TimeStamp timestamp={agent.timestamp}/>,
              <Link to={`/extrinsic/${agent.registeredAt}-${formattedNumber(agent.extrinsicId)}`}>{agent.registeredAt}-{formattedNumber(agent.extrinsicId)}</Link>
            ]
          }
        })}/>}
      </TerminalWindow>
  )
}