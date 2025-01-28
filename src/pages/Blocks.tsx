import { gql, useQuery } from '@apollo/client'
import { TerminalWindow } from '../components/TerminalWindow'
import {useState} from "react";
import {PaginationControls} from "../components/PaginationControls.tsx";
import {TerminalLoading} from "../components/TerminalLoading.tsx";
import {DataTable} from "../components/DataTable.tsx";
import {ResponsiveAddress} from "../components/ResponsiveAddress.tsx";
import {Link} from "react-router-dom";

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



  const pageControls = (
      <>
        {loading && <TerminalLoading/>}
        {data && <PaginationControls
            currentPage={currentPage}
            totalCount={data?.blocks.totalCount}
            itemsPerPage={itemsPerPage}
            dataLength={data?.blocks.nodes.length}
            
          onPageChange={setCurrentPage}
        />}</>
  );
  return (
      <TerminalWindow title="Blocks" footer={pageControls}>
        {loading && <TerminalLoading/>}
        {error && <div>Error: {error.message}</div>}
        {data && <DataTable names={['Height', 'Hash', 'Timestamp']} records={data.blocks.nodes.map((block: { id: string; height: number; hash: string; timestamp: string | number | Date; }) => {
          return {id: block.id, data: [<Link to={`/block/${block.height}`}>{block.height}</Link>, <ResponsiveAddress linkPath={'block'} address={block.hash}/> , new Date(block.timestamp).toLocaleString()
            ]}
        })} />}
      </TerminalWindow>
  )
}