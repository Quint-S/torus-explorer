import { gql, useQuery } from '@apollo/client'
import { TerminalLoading } from '../components/TerminalLoading.tsx'
import { DataTable } from "../components/DataTable.tsx";
import React from "react";
import {JsonView} from "react-json-view-lite";

const GET_BLOCK_EVENTS = gql`
  query GetBlockEvents($height: Int!) {
    events(filter: {blockNumber: {equalTo: $height}}, orderBy: ID_ASC) {
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

interface BlockEventsProps {
  blockHeight: string;
}

export const BlockEvents: React.FC<BlockEventsProps> = ({ blockHeight }) => {
  const { loading, error, data } = useQuery(GET_BLOCK_EVENTS, {
    variables: {
      height: blockHeight
    }
  })

  return (
    <div>
      {loading && <TerminalLoading />}
      {error && <div>Error: {error.message}</div>}

      {data && (
        <DataTable
          names={['Event Idx', 'event', 'data']}
          records={
            [...data.events.nodes]
              .sort((a, b) => a.id.localeCompare(b.id))
              .map((event: {
                data: string;
                id: string;
                blockNumber: string;
                module: string;
                eventName: string;
              }) => {
                return {
                  id: event.id,
                  data: [
                    event.id,
                    `${event.module}::${event.eventName}`,
                    <JsonView
                      data={JSON.parse(event.data)}
                      shouldExpandNode={() => false}
                      style={{
                        "container": "break-all text-left",
                        "basicChildStyle": "pl-5",
                        "childFieldsContainer": "_child-fields-container_78paz_60",
                        "label": "text-blue-400",
                        "clickableLabel": "cursor-pointer text-blue-300",
                        "nullValue": "_value-null-light_78paz_82",
                        "undefinedValue": "_value-undefined-light_78paz_86",
                        "stringValue": "_value-string-light_78paz_90",
                        "booleanValue": "_value-boolean-light_78paz_98",
                        "numberValue": "_value-number-light_78paz_94",
                        "otherValue": "_value-other-light_78paz_102",
                        "punctuation": "_punctuation-light_78paz_77 _punctuation-base_78paz_12",
                        "collapseIcon": "collapse-icon",
                        "expandIcon": "expand-icon",
                        "collapsedContent": "_collapsed-content-light_78paz_118 _collapsed-content-base_78paz_40 _pointer_78paz_21",
                        "noQuotesForStringValues": false,
                        "quotesForFieldNames": false
                      }}
                    />
                  ]
                }
              })
          }
        />
      )}
      {!loading && data?.extrinsics?.nodes?.length === 0 && (
        <div>No events found in this block</div>
      )}
    </div>
  )
} 