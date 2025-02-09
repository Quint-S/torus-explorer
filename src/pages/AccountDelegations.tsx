import { gql, useQuery } from '@apollo/client'
import { TerminalWindow } from '../components/TerminalWindow'
import { formattedNumber, formatTORUS } from '../utils/utils.ts'
import { Link, useParams } from 'react-router-dom'
import { TerminalLoading } from '../components/TerminalLoading.tsx'
import { DataTable } from "../components/DataTable.tsx"
import { useState } from "react"
import { PaginationControls } from "../components/PaginationControls.tsx"

const GET_ACCOUNT_DELEGATIONS = gql`
  query GetAccountDelegations($first: Int!, $offset: Int!, $address: String!) {
    delegationEvents(
      first: $first
      offset: $offset
      filter: { account: { equalTo: $address } }
      orderBy: HEIGHT_DESC
    ) {
      nodes {
        id
        height
        extrinsicId
        account
        agent
        amount
        action
      }
      totalCount
    }
    agents {
      nodes {
        id
        name
      }
    }
  }
`

export const AccountDelegations = () => {
  const { address } = useParams()
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 25;

  const { loading, error, data } = useQuery(GET_ACCOUNT_DELEGATIONS, {
    variables: { first: itemsPerPage, offset: currentPage * itemsPerPage, address }
  });

  const getAgentName = (agentId: string) => {
    const agent = data?.agents?.nodes?.find((a: { id: string; name: string }) => a.id === agentId);
    return agent?.name || agentId;
  };

  const pageControls = (
    <>
      {loading && <TerminalLoading />}
      {data && <PaginationControls
        currentPage={currentPage}
        totalCount={data?.delegationEvents.totalCount}
        itemsPerPage={itemsPerPage}
        dataLength={data?.delegationEvents.nodes.length}
        onPageChange={setCurrentPage}
      />}
    </>
  );

  if (!address) {
    return <div>Error: No address provided</div>
  }

  return (
    <TerminalWindow title={`account_delegations`} footer={pageControls}>
      {loading && <TerminalLoading />}
      {error && <div>Error: {error.message}</div>}
      {!loading && !data?.delegationEvents && <div>Error: {address} not found.</div>}

      {(data?.delegationEvents?.totalCount ?? 0) > 0 && (
        <div style={{
          padding: '8px 0',
          borderTop: '1px solid #0050a1'
        }}>
          <DataTable
            names={['Action', 'Amount', 'Agent', 'Height', 'Extrinsic']}
            records={data.delegationEvents.nodes.map((event: {
              id: string;
              height: number;
              extrinsicId: number;
              agent: string;
              amount: number;
              action: string;
            }) => ({
              id: event.id,
              data: [
                event.action,
                formatTORUS(event.amount),
                <Link to={`/agent/${event.agent}`}>{getAgentName(event.agent)}</Link>,
                event.height,
                <Link to={`/extrinsic/${event.height}-${formattedNumber(event.extrinsicId)}`}>
                  {event.height}-{formattedNumber(event.extrinsicId)}
                </Link>
              ]
            }))}
          />
        </div>
      )}
    </TerminalWindow>
  )
} 