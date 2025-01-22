import { gql, useQuery } from '@apollo/client'
import React from "react";
import {TerminalLoading} from "../TerminalLoading.tsx";
import {DetailLabel, DetailRow, DetailValue} from "../../pages/AccountDetails.tsx";

interface ExtrinsicEventsProps {
  extrinsicId: string;
}
export const GET_LAST_EVM_EVENT = gql`
  query GetLastEVMEvent($blockNumber: BigFloat!, $extrinsicId: Int!) {
    events(filter: {and: {blockNumber: {equalTo: $blockNumber}, extrinsicId: {equalTo: $extrinsicId}}}) {
      nodes{
        data
        eventName
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
  const executed = data && JSON.parse(data.events.nodes.find((event: { eventName: string; }) => { return event.eventName === 'Executed'}).data)[0];

  return (
      <>
      {loading && <DetailRow><TerminalLoading /></DetailRow>}
      {error && <div>Error: {error.message}</div>}

      {executed && (
          <DetailRow>
            <DetailLabel>EVM account:</DetailLabel>
            <DetailValue><a target={'_blank'} href={`https://basescan.org/address/${executed}`}>{executed}↗</a></DetailValue>
          </DetailRow>)
      }
      </>
  )
}