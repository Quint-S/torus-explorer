import { gql, useQuery } from '@apollo/client'
import { TerminalWindow } from '../components/TerminalWindow'
const GET_TRANSFERS = gql`
  query GetTransfers($first: Int!, $offset: Int!) {
    transfers(first: $first, offset: $offset, orderBy: BLOCK_NUMBER_DESC) {
      nodes {
        id
        blockNumber
        extrinsicId
        from
        to
        amount
        timestamp
        }
        totalCount
    }
  }
`


import {formatTORUS} from "../utils/utils.ts";
import {DataTable} from "../components/DataTable.tsx";
import {useState} from "react";
import {PaginationControls} from "../components/PaginationControls.tsx";
import {TerminalLoading} from "../components/TerminalLoading.tsx";
import {Link} from "react-router-dom";
import {ResponsiveAddress} from "../components/ResponsiveAddress.tsx";
import {TimeStamp} from "../components/TimeStamp.tsx";
export const Transfers = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 25;

  const { loading, error, data } = useQuery(GET_TRANSFERS, {
    variables: { first: itemsPerPage, offset: currentPage * itemsPerPage }
  });

  const pageControls = (
      <>
        {loading && <TerminalLoading/>}
        {data && <PaginationControls
            currentPage={currentPage}
            totalCount={data?.transfers.totalCount}
            itemsPerPage={itemsPerPage}
            dataLength={data?.transfers.nodes.length}
            onPageChange={setCurrentPage}
        />}</>
  );

  return (
    <TerminalWindow title="Transfers" footer={pageControls}>
      {loading && <TerminalLoading/>}
      {error && <div>Error: {error.message}</div>}
      {data && <DataTable names={['Amount', 'From', 'To', 'Height', 'Timestamp']} records={data.transfers.nodes.map((transfer: { id: string; amount: number; from: string; to: string; blockNumber: string; timestamp: string; }) => {
        return {id: transfer.id, data: [<div className={'text-left pl-2'}>{formatTORUS(transfer.amount)}</div>, <ResponsiveAddress linkPath={'account'} address={transfer.from}/>, <ResponsiveAddress linkPath={'account'} address={transfer.to}/>, <Link to={`/block/${transfer.blockNumber}`}>{transfer.blockNumber}</Link>, <TimeStamp timestamp={transfer.timestamp}/>
          ]}
      })} />}
    </TerminalWindow>
  )
}