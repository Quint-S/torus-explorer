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
import {FilterBar} from "../components/FilterBar.tsx";

const GET_AGENTS = gql`
  query GetAgents($first: Int!, $offset: Int!, $orderBy: [AgentsOrderBy!]) {
    agents(
    first: $first
    offset: $offset
    orderBy: $orderBy
    ) {
    nodes {
      id
      registeredAt
      timestamp
      extrinsicId
      metadata
      name
      stakingFee
      url
      weightControlFee
      weightPenaltyFactor
    }
    totalCount
    }
  }
`
const GET_FILTERED_AGENTS = gql`
  query GetFilteredAgents($first: Int!, $offset: Int!, $name: String!, $orderBy: [AgentsOrderBy!]) {
    agents(
    first: $first
    offset: $offset
    filter: { name: { includes: $name } }
    orderBy: $orderBy
    ) {
    nodes {
      id
      registeredAt
      timestamp
      extrinsicId
      metadata
      name
      stakingFee
      url
      weightControlFee
      weightPenaltyFactor
    }
    totalCount
    }
  }
`

export const Agents = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 25;
  const [name, setName] = useState('');
  const [sortOrder, setSortOrder] = useState<'REGISTERED_AT_ASC' | 'REGISTERED_AT_DESC' | 'NAME_ASC' | 'NAME_DESC'>('REGISTERED_AT_DESC');

  const {loading, error, data} = useQuery(name !== '' ? GET_FILTERED_AGENTS : GET_AGENTS, {
    variables: {first: itemsPerPage, offset: currentPage * itemsPerPage, name: name, orderBy: sortOrder}
  });

  const handleColumnHeaderClick = (_columnIndex: number, columnName: string) => {
    if (columnName === 'extrinsic' || columnName === 'register date') {
      setSortOrder(prev => prev === 'REGISTERED_AT_ASC' ? 'REGISTERED_AT_DESC' : 'REGISTERED_AT_ASC');
      setCurrentPage(0);  
    }else if (columnName === 'name') {
      setSortOrder(prev => prev === 'NAME_ASC' ? 'NAME_DESC' : 'NAME_ASC');
      setCurrentPage(0);  
    }
  };

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
        <div
          className={'bg-black bg-opacity-20 flex justify-center border-b border-b-1 border-white/30'}
        >
          <FilterBar
            placeholder={'filter by agent name'}
            type={'agents/'}
            onSearch={(agentName) => { setName(agentName.toLowerCase()) }}
          />
        </div>
        {loading && <TerminalLoading/>}
        {error && <div>Error: {error.message}</div>}
        {data && <DataTable 
          names={['name', 'key', 'register date', 'extrinsic']} 
          records={data.agents.nodes.map((agent: { id: string; registeredAt: string; name: string; metadata: string; extrinsicId: number; url: string; timestamp: any;}) => {
          
          return {
            id: agent.id,
            data: [
              <Link to={`/agent/${agent.id}`}>{agent.name}</Link>,
              <ResponsiveAddress linkPath={'agent'} address={agent.id} />,
              <TimeStamp timestamp={agent.timestamp}/>,
              <Link to={`/extrinsic/${agent.registeredAt}-${formattedNumber(agent.extrinsicId)}`}>{agent.registeredAt}-{formattedNumber(agent.extrinsicId)}</Link>
            ]
          }
        })}
          onColumnHeaderClick={handleColumnHeaderClick}
        />}
      </TerminalWindow>
  )
}