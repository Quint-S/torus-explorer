import { gql, useQuery } from '@apollo/client'
import React from "react";
import {TerminalLoading} from "../TerminalLoading.tsx";
import { DetailRow} from "../../pages/AccountDetails.tsx";

interface ExtrinsicEventsProps {
  extrinsicId: string;
}
export const GET_LAST_EVM_EVENT = gql`
  query GetLastEVMEvent($blockNumber: BigFloat!, $extrinsicId: Int!) {
    events(last: 1, filter: {and: {blockNumber: {equalTo: $blockNumber}, extrinsicId: {equalTo: $extrinsicId}}}) {
      nodes{
        data
      }
    }
  }
`

export const EthereumTransfer: React.FC<ExtrinsicEventsProps> = ({ extrinsicId }) => {
  const { loading, error, data } = useQuery(GET_LAST_EVM_EVENT, {
    variables: {
      blockNumber: extrinsicId.split('-')[0],
      extrinsicId: parseInt(extrinsicId.split('-')[1] || '0')
    }});

  return (
      <>
      {loading && <DetailRow><TerminalLoading /></DetailRow>}
      {error && <div>Error: {error.message}</div>}

      {data && JSON.stringify(JSON.parse(data.events.nodes[0].data)[0])
          // JSON.parse(data.events.nodes[0].data)[0] && (
          // <DetailRow>
          //   <DetailLabel>Transfer to Base:</DetailLabel>
          //   <DetailValue><a target={'_blank'} href={`https://basescan.org/address/${JSON.parse(data.events.nodes[0].data)[0]}`}>{JSON.parse(data.events.nodes[0].data)[0]}</a></DetailValue>
          // </DetailRow>
      }
      </>
  )
}