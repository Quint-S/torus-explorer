import { gql, useQuery } from '@apollo/client'
import {useParams} from 'react-router-dom'
import { TerminalLoading } from '../components/TerminalLoading.tsx'
import {DataTable} from "../components/DataTable.tsx";
import React from "react";

const GET_EXTRINSIC_EVENTS = gql`
  query GetExtrinsicEvents($blockNumber: BigFloat!, $extrinsicId: Int!) {
      events(filter: {and: {blockNumber: {equalTo: $blockNumber}, extrinsicId: {equalTo: $extrinsicId}}}) {
    nodes{
      id
      blockNumber
      extrinsicId
      eventName
      module
      data
      }
    }
  }
`

interface ExtrinsicEventsProps {
  extrinsicId: string;
}

export const ExtrinsicEvents: React.FC<ExtrinsicEventsProps> = ({ extrinsicId }) => {
  const { id } = useParams()
  const { loading, error, data } = useQuery(GET_EXTRINSIC_EVENTS, {
    variables: {
      blockNumber: extrinsicId?.split('-')[0],
      extrinsicId: parseInt(extrinsicId?.split('-')[1] || '0')
    }
  })

  if (!id) {
    return <div>Error: No extrinsic ID provided</div>
  }

  return (
    <div>
      {loading && <TerminalLoading />}
      {error && <div>Error: {error.message}</div>}

      {data && <DataTable names={['Event Idx', 'event', 'data']} records={data.events.nodes.map((event: {
        data: string;
        id: string; blockNumber: string; module: string; eventName: string; }) => {
        return {
          id: event.id, data: [event.id, `${event.module}::${event.eventName}`, event.data
          ]
        }
      })}/>}
      {!loading && data?.events?.nodes?.length === 0 && (
          <div>No events found for this extrinsic</div>
      )}

    </div>
  )
}