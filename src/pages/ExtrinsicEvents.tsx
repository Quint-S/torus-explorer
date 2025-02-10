import React from "react";
import { DataTable } from "../components/DataTable.tsx";
import { JsonView } from "react-json-view-lite";
import { TerminalLoading } from '../components/TerminalLoading.tsx';

interface ExtrinsicEventsProps {
  loading: boolean;
  error?: any;
  events: Array<{
    id: string;
    blockNumber: string;
    extrinsicId: string;
    eventName: string;
    module: string;
    data: string;
  }>;
}

export const ExtrinsicEvents: React.FC<ExtrinsicEventsProps> = ({ loading, error, events }) => {
  if (loading) return <TerminalLoading />;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>


      <DataTable 
        names={['Event Idx', 'event', 'data']} 
        records={events.map((event) => ({
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
                                                                                      }))}
                                                                                    />
                                                                                    {events.length === 0 && (
                                                                                      <div>No events found for this extrinsic</div>
                                                                                    )}
                                                                                  </div>
                                                                                );
                                                                              };