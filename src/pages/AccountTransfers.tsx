import { gql, useQuery } from '@apollo/client'
import { TerminalWindow } from '../components/TerminalWindow'
import { formatTORUS } from '../utils/utils.ts'
import {Link, useParams} from 'react-router-dom'
import { TerminalLoading } from '../components/TerminalLoading.tsx'
import {DataTable} from "../components/DataTable.tsx";
import {ResponsiveAddress} from "../components/ResponsiveAddress.tsx";
import {useState} from "react";
import {PaginationControls} from "../components/PaginationControls.tsx";

const GET_ACCOUNT_TRANSFERS = gql`
  query GetAccountTransfers($first: Int!, $offset: Int!, $address: String!) {
    transfers(first: $first, offset: $offset, filter: {or: [{from: {equalTo: $address}}, {to: {equalTo: $address}}]}, orderBy: BLOCK_NUMBER_DESC) {
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
// interface AccountTransfersProps {
//   title: string
//   children: React.ReactNode
//   footer?: React.ReactNode
// }
export const AccountTransfers = () => {
  const { address } = useParams()
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 25;

  const { loading, error, data } = useQuery(GET_ACCOUNT_TRANSFERS, {
    variables: { first: itemsPerPage, offset: currentPage * itemsPerPage, address }
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

  if (!address) {
    return <div>Error: No address provided</div>
  }

  return (
      <TerminalWindow title={`account_transfers`} footer={pageControls}>
        {loading && <TerminalLoading />}
        {error && <div>Error: {error.message}</div>}
        {!loading && !data?.transfers && <div>Error: {address} not found.</div>}

        {(data?.transfers?.totalCount ?? 0) > 0 && (
            <div style={{padding: '8px 0',
              borderTop: '1px solid #0050a1'}}>
            <DataTable names={['Amount', 'From', 'To', 'Height', 'Timestamp']} records={data.transfers.nodes.map((transfer: { id: string; amount: number; from: string; to: string; blockNumber: string; timestamp: string | number | Date }) => {
              const formattedFrom = <ResponsiveAddress address={transfer.from}/>;
              const formattedTo = <ResponsiveAddress address={transfer.to}/>;

              return {id: transfer.id, data: [formatTORUS(transfer.amount), transfer.from === address ? formattedFrom : <Link to={`/account/${transfer.from}`}>{formattedFrom}</Link>, transfer.to === address ? formattedTo : <Link to={`/account/${transfer.to}`}><ResponsiveAddress address={transfer.to}/></Link>, transfer.blockNumber, new Date(transfer.timestamp).toLocaleString()
                ]}
            })} /></div>
        )}
      </TerminalWindow>
  )
}