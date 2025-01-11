import { gql, useQuery } from '@apollo/client'
import { TerminalWindow } from '../components/TerminalWindow'
import {useState} from "react";
import {PaginationControls} from "../components/PaginationControls.tsx";
import {TerminalLoading} from "../components/TerminalLoading.tsx";
import {DataTable} from "../components/DataTable.tsx";
import {ResponsiveAddress} from "../components/ResponsiveAddress.tsx";

const GET_BLOCKS = gql`
  query GetBlocks($first: Int!, $offset: Int!) {
    blocks(first: $first, offset: $offset, orderBy: HEIGHT_DESC) {
      nodes {
        id
        height
        hash
        timestamp
      }
      totalCount
    }
  }
`

export const Blocks = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 25;

  const { loading, error, data } = useQuery(GET_BLOCKS, {
    variables: { first: itemsPerPage, offset: currentPage * itemsPerPage }
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
            totalCount={data?.blocks.totalCount}
            itemsPerPage={itemsPerPage}
            dataLength={data?.blocks.nodes.length}
            onNext={handleNext}
            onPrevious={handlePrevious}
        />}</>
  );
  return (
      <TerminalWindow title="Blocks" footer={pageControls}>
        {loading && <TerminalLoading/>}
        {error && <div>Error: {error.message}</div>}
        {data && <DataTable names={['Height', 'Hash', 'Timestamp']} records={data.blocks.nodes.map((block: { id: string; height: number; hash: string; timestamp: string | number | Date; }) => {
          return {id: block.id, data: [block.height, <ResponsiveAddress address={block.hash}/> , new Date(block.timestamp).toLocaleString()
            ]}
        })} />}
      </TerminalWindow>
  )
}