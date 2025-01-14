import { gql, useQuery } from '@apollo/client'
import { TerminalWindow } from '../components/TerminalWindow'
import {useState} from "react";
import {TerminalLoading} from "../components/TerminalLoading.tsx";
import {PaginationControls} from "../components/PaginationControls.tsx";
import {DataTable} from "../components/DataTable.tsx";

const GET_EVENTS = gql`
  query GetEvents($first: Int!, $offset: Int!) {
    events(first: $first, offset: $offset, orderBy: BLOCK_NUMBER_DESC) {
nodes {
      blockNumber
      data
      eventName
      extrinsicId
      id
      module
      nodeId
    }
    totalCount
      }
  }
`

export const Events = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 25;

  const {loading, error, data} = useQuery(GET_EVENTS, {
    variables: {first: itemsPerPage, offset: currentPage * itemsPerPage}
  });



  const pageControls = (
      <>
        {loading && <TerminalLoading/>}
        {data && <PaginationControls
            currentPage={currentPage}
            totalCount={data?.events.totalCount}
            itemsPerPage={itemsPerPage}
            dataLength={data?.events.nodes.length}
            onPageChange={setCurrentPage}
        />}</>
  );
  return (
      <TerminalWindow title="events" footer={pageControls}>
        {loading && <TerminalLoading/>}
        {error && <div>Error: {error.message}</div>}
        {data && <DataTable names={['Block #', 'Event Idx', 'event']} records={data.events.nodes.map((event: { id: string; blockNumber: string; module: string; eventName: string; }) => {
          return {
            id: event.id, data: [event.blockNumber, event.id, `${event.module}::${event.eventName}`
            ]
          }
        })}/>}
      </TerminalWindow>
  )
}