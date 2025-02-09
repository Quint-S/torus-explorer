import { gql, useQuery } from '@apollo/client'
import { TerminalWindow } from '../components/TerminalWindow'
import {useState} from "react";
import {PaginationControls} from "../components/PaginationControls.tsx";
import {TerminalLoading} from "../components/TerminalLoading.tsx";
import {DataTable} from "../components/DataTable.tsx";
import {ResponsiveAddress} from "../components/ResponsiveAddress.tsx";
import {Link} from "react-router-dom";

const GET_LAST_HEIGHT = gql`
  query {
    _metadata {
      lastProcessedHeight
    }
  }
`

const GET_BLOCKS = gql`
  query GetBlocks($firstBlock: Int!, $lastBlock: Int!) {
    blocks(orderBy: HEIGHT_DESC,
      filter: {height: {greaterThanOrEqualTo: $firstBlock, lessThanOrEqualTo: $lastBlock}}
    ) {
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

  const { data: metadataData, loading: metadataLoading } = useQuery(GET_LAST_HEIGHT);
  const lastProcessedHeight = metadataData?._metadata?.lastProcessedHeight;

  const { loading: blocksLoading, error, data } = useQuery(GET_BLOCKS, {
    variables: {
      lastBlock: lastProcessedHeight ? lastProcessedHeight - (currentPage * itemsPerPage) : 0,
      firstBlock: lastProcessedHeight ? lastProcessedHeight - (currentPage * itemsPerPage) - itemsPerPage + 1 : 0
    },
    skip: !lastProcessedHeight
  });

  const loading = metadataLoading || blocksLoading;

  const pageControls = (
    <>
      {metadataLoading && <TerminalLoading/>}
      {metadataData && <PaginationControls
        currentPage={currentPage}
        totalCount={lastProcessedHeight || 0}
        itemsPerPage={itemsPerPage}
        dataLength={data?.blocks.nodes.length ?? itemsPerPage}
        onPageChange={setCurrentPage}
      />}
    </>
  );

  return (
    <TerminalWindow title="Blocks" footer={pageControls}>
      {loading && <TerminalLoading/>}
      {error && <div>Error: {error.message}</div>}
      {data && <DataTable 
        names={['Height', 'Hash', 'Timestamp']} 
        records={data.blocks.nodes.map((block: { id: string; height: number; hash: string; timestamp: string | number | Date; }) => {
          return {
            id: block.id, 
            data: [
              <Link to={`/block/${block.height}`}>{block.height}</Link>,
              <ResponsiveAddress linkPath={'block'} address={block.hash}/>,
              new Date(block.timestamp).toLocaleString()
            ]
          }
        })} 
      />}
    </TerminalWindow>
  )
}