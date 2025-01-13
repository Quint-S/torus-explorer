import { gql, useQuery } from '@apollo/client'
import { TerminalWindow } from '../components/TerminalWindow'
import {Link, useParams} from 'react-router-dom'
import { TerminalLoading } from '../components/TerminalLoading.tsx'
import {DataTable} from "../components/DataTable.tsx";
import {ResponsiveAddress} from "../components/ResponsiveAddress.tsx";
import {useState} from "react";
import {PaginationControls} from "../components/PaginationControls.tsx";

const GET_ACCOUNT_EXTRINSICS = gql`
  query GetAccountExtrinsics($first: Int!, $offset: Int!, $address: String!) {
    extrinsics(first: $first, offset: $offset, filter: {signer: {equalTo: $address}}, orderBy: BLOCK_NUMBER_DESC) {
      nodes {
        args
        blockNumber
        extrinsicId
        hash
        id
        method
        module
        nodeId
        signer
        success
        tip
        version
      }
      totalCount
    }
  }
`

export const AccountExtrinsics = () => {
  const { address } = useParams()
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 25;

  const { loading, error, data } = useQuery(GET_ACCOUNT_EXTRINSICS, {
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
            totalCount={data?.extrinsics.totalCount}
            itemsPerPage={itemsPerPage}
            dataLength={data?.extrinsics.nodes.length}
            onNext={handleNext}
            onPrevious={handlePrevious}
        />}</>
  );

  if (!address) {
    return <div>Error: No address provided</div>
  }

  return (
      <TerminalWindow title="Account Extrinsics" footer={pageControls}>
        {loading && <TerminalLoading/>}
        {error && <div>Error: {error.message}</div>}
        {data && <DataTable names={['Block #','Extrinsic Idx', 'Call', 'Account', 'Success']} records={data.extrinsics.nodes.map((extrinsic: { id: string; blockNumber: string; module: string; method: string; args: string; signer: string; success: boolean; }) => {
          return {id: extrinsic.id, data: [extrinsic.blockNumber, extrinsic.id, `${extrinsic.module}::${extrinsic.method}`, <Link to={`/account/${extrinsic.signer}`}><ResponsiveAddress address={extrinsic.signer}/></Link>, extrinsic.success.toString()
            ]}
        })} />}
      </TerminalWindow>
  )
}