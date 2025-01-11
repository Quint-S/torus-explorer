import { gql, useQuery } from '@apollo/client'
import { TerminalWindow } from '../components/TerminalWindow'
import {useState} from "react";
import {TerminalLoading} from "../components/TerminalLoading.tsx";
import {PaginationControls} from "../components/PaginationControls.tsx";
import {DataTable} from "../components/DataTable.tsx";

const GET_AGENTS = gql`
  query GetAgents($first: Int!, $offset: Int!) {
    agents(first: $first, offset: $offset) {
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

  const handleNext = () => {
    setCurrentPage(prev => prev + 1);
  };

  const handlePrevious = () => {
    setCurrentPage(prev => Math.max(0, prev - 1));
  };

  const pageControls = (
      <>
        {loading && <TerminalLoading/>}
        {data && <PaginationControls
            currentPage={currentPage}
            totalCount={data?.agents.totalCount}
            itemsPerPage={itemsPerPage}
            dataLength={data?.agents.nodes.length}
            onNext={handleNext}
            onPrevious={handlePrevious}
        />}</>
  );
  return (
      <TerminalWindow title="agents" footer={pageControls}>
        {loading && <TerminalLoading/>}
        {error && <div>Error: {error.message}</div>}
        {data && <DataTable names={['Register Block #', 'name', 'key']} records={data.agents.nodes.map((agent: { id: string; registeredAt: string; name: string; }) => {
          return {
            id: agent.id, data: [agent.registeredAt, agent.name, `${agent.id}`
            ]
          }
        })}/>}
      </TerminalWindow>
  )
}