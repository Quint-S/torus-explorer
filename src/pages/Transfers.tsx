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


import {formatAddress, formatTORUS} from "../utils/utils.ts";
import {DataTable} from "../components/DataTable.tsx";
import {useState} from "react";
import {PaginationControls} from "../components/PaginationControls.tsx";
import {TerminalLoading} from "../components/TerminalLoading.tsx";
import {Link} from "react-router-dom";
import {ResponsiveAddress} from "../components/ResponsiveAddress.tsx";

export const Transfers = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 25;

  const { loading, error, data } = useQuery(GET_TRANSFERS, {
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
            totalCount={data?.transfers.totalCount}
            itemsPerPage={itemsPerPage}
            dataLength={data?.transfers.nodes.length}
            onNext={handleNext}
            onPrevious={handlePrevious}
        />}</>
  );
  return (
    <TerminalWindow title="Transfers" footer={pageControls}>
      {loading && <TerminalLoading/>}
      {error && <div>Error: {error.message}</div>}
      {data && <DataTable names={['Amount', 'From', 'To', 'Height', 'Timestamp']} records={data.transfers.nodes.map(transfer => {
        return {id: transfer.id, data: [<div className={'text-left pl-2'}>{formatTORUS(transfer.amount)}</div>, <Link to={`/account/${transfer.from}`}><ResponsiveAddress address={transfer.from}/></Link>, <Link to={`/account/${transfer.to}`}><ResponsiveAddress address={transfer.to}/></Link>, transfer.blockNumber, new Date(transfer.timestamp).toLocaleString()
          ]}
      })} />}
    </TerminalWindow>
  )
}