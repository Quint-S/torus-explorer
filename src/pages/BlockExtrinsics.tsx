import { gql, useQuery } from '@apollo/client'
import { TerminalLoading } from '../components/TerminalLoading.tsx'
import { DataTable } from "../components/DataTable.tsx";
import { Link } from "react-router-dom";
import { ResponsiveAddress } from "../components/ResponsiveAddress.tsx";
import React from "react";

const GET_BLOCK_EXTRINSICS = gql`
  query GetBlockExtrinsics($height: Int!) {
    extrinsics(filter: {blockNumber: {equalTo: $height}}, orderBy: EXTRINSIC_ID_ASC) {
      nodes {
        id
        blockNumber
        extrinsicId
        hash
        method
        module
        signer
        success
      }
    }
  }
`

interface BlockExtrinsicsProps {
  blockHeight: string;
}

export const BlockExtrinsics: React.FC<BlockExtrinsicsProps> = ({ blockHeight }) => {
  const { loading, error, data } = useQuery(GET_BLOCK_EXTRINSICS, {
    variables: {
      height: blockHeight
    }
  })

  return (
    <div>
      {loading && <TerminalLoading />}
      {error && <div>Error: {error.message}</div>}

      {data && <DataTable 
        names={['Extrinsic ID', 'Call', 'Signer', 'Success']} 
        records={data.extrinsics.nodes.map((extrinsic: { 
          id: string; 
          module: string; 
          method: string; 
          signer: string; 
          success: boolean; 
        }) => {
          return {
            id: extrinsic.id, 
            data: [
              <Link to={`/extrinsic/${extrinsic.id}`}>{extrinsic.id}</Link>,
              `${extrinsic.module}::${extrinsic.method}`,
              extrinsic.signer ? <ResponsiveAddress linkPath={'account'} address={extrinsic.signer}/> : '-',
              extrinsic.success ? <span style={{color: '#6cffb9'}}>✓</span> : <span style={{color: '#ff6c6c'}}>✗</span>
            ]
          }
        })} 
      />}
      {!loading && data?.extrinsics?.nodes?.length === 0 && (
        <div>No extrinsics found for this block</div>
      )}
    </div>
  )
} 