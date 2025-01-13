import { gql, useQuery } from '@apollo/client'
import {TerminalTabs, TerminalWindow} from '../components/TerminalWindow'
import { formatTORUS } from '../utils/utils.ts'
import {useParams} from 'react-router-dom'
import { TerminalLoading } from '../components/TerminalLoading.tsx'
import styled from 'styled-components'
import {AccountTransfers} from "./AccountTransfers.tsx";
import {AccountExtrinsics} from "./AccountExtrinsics.tsx";
import {CopyButton} from "../components/CopyButton.tsx";

const GET_ACCOUNT = gql`
  query GetAccount($address: String!) {
account(id: $address) {
    id
    balanceFree
    balanceStaked
    balanceTotal
    updatedAt
  }
    
  }
`

const DetailRow = styled.div`
  display: flex;
  padding: 8px 0;
  border-bottom: 1px solid #0050a1;


  
  &:last-child {
    border-bottom: none;
  }
`

const DetailLabel = styled.div`
  width: 200px;
  padding-left: 5px;
  color: #00c4ff;
  font-weight: bold;
`

const DetailValue = styled.div`
  flex-grow: 1;
  color: #ffffff;
`

export const AccountDetails = () => {
  const { address } = useParams()
  const { loading, error, data } = useQuery(GET_ACCOUNT, {
    variables: { address }
  })

  if (!address) {
    return <div>Error: No address provided</div>
  }

  return (
      <TerminalWindow title={`view_account`}>
        {loading && <TerminalLoading />}
        {error && <div>Error: {error.message}</div>}
        {!loading && !data?.account && <div>Error: {address} not found.</div>}
        {data?.account && (
            <div>
              <DetailRow>
                <DetailLabel>Address:</DetailLabel>
                <DetailValue>{data.account.id} <CopyButton textToCopy={data.account.id}/></DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>Total Balance:</DetailLabel>
                <DetailValue>{formatTORUS(data.account.balanceTotal)}</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>Free Balance:</DetailLabel>
                <DetailValue>{formatTORUS(data.account.balanceFree)}</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>Staked Balance:</DetailLabel>
                <DetailValue>{formatTORUS(data.account.balanceStaked)}</DetailValue>
              </DetailRow>
            </div>
        )}

        <TerminalTabs
            tabs={[
              {
                label: 'Transfers',
                content: <AccountTransfers />
              },
              {
                label: 'Extrinsics',
                content: <AccountExtrinsics/>
              },
              {
                label: 'Delegations',
                content: <div>Coming soon..</div>
              }
            ]}
        />

        {/*<AccountTransfers />*/}
        {/*{(data?.transfers?.totalCount ?? 0) > 0 && (*/}
        {/*    <div style={{padding: '8px 0',*/}
        {/*      borderTop: '1px solid #0050a1'}}>*/}
        {/*    <DataTable names={['Amount', 'From', 'To', 'Height', 'Timestamp']} records={data.transfers.nodes.map((transfer: { id: string; amount: number; from: string; to: string; blockNumber: string; timestamp: string | number | Date }) => {*/}
        {/*      return {id: transfer.id, data: [formatTORUS(transfer.amount), <Link to={`/account/${transfer.from}`}><ResponsiveAddress address={transfer.from}/></Link>, <Link to={`/account/${transfer.to}`}><ResponsiveAddress address={transfer.to}/></Link>, transfer.blockNumber, new Date(transfer.timestamp).toLocaleString()*/}
        {/*        ]}*/}
        {/*    })} /></div>*/}
        {/*)}*/}
      </TerminalWindow>
  )
}