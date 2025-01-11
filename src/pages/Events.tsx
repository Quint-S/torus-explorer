import { gql, useQuery } from '@apollo/client'
import { TerminalWindow } from '../components/TerminalWindow'
import {useState} from "react";
import {TerminalLoading} from "../components/TerminalLoading.tsx";
import {PaginationControls} from "../components/PaginationControls.tsx";
import {DataTable} from "../components/DataTable.tsx";
import {Link} from "react-router-dom";
import {ResponsiveAddress} from "../components/ResponsiveAddress.tsx";

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
            totalCount={data?.events.totalCount}
            itemsPerPage={itemsPerPage}
            dataLength={data?.events.nodes.length}
            onNext={handleNext}
            onPrevious={handlePrevious}
        />}</>
  );
  return (
      <TerminalWindow title="events" footer={pageControls}>
        {loading && <TerminalLoading/>}
        {error && <div>Error: {error.message}</div>}
        {data && <DataTable names={['Block #', 'Event Idx', 'event']} records={data.events.nodes.map(event => {
          return {
            id: event.id, data: [event.blockNumber, event.id, `${event.module}::${event.eventName}`
            ]
          }
        })}/>}
      </TerminalWindow>
  )
}