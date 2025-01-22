import { gql, useQuery } from '@apollo/client'
import {TerminalTabs, TerminalWindow} from '../components/TerminalWindow'
import { formatTORUS } from '../utils/utils.ts'
import {useParams} from 'react-router-dom'
import { TerminalLoading } from '../components/TerminalLoading.tsx'
import styled from 'styled-components'
import {AccountTransfers} from "./AccountTransfers.tsx";
import {AccountExtrinsics} from "./AccountExtrinsics.tsx";
import {CopyButton} from "../components/CopyButton.tsx";
import { Helmet } from 'react-helmet-async';

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

export const DetailRow = styled.div`
  display: flex;
  padding: 1px 0;
  border-bottom: 1px solid #0050a1;


  
  &:last-child {
    border-bottom: none;
  }
`

export const DetailLabel = styled.div`
  width: 200px;
  padding-left: 5px;
  color: #00c4ff;
`

export const DetailValue = styled.div`
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

  const accountData = data?.account;
  const title = accountData ? `Account ${address.slice(0, 8)}... | Torus Explorer` : 'Account Details | Torus Explorer';
  const description = accountData 
    ? `Account ${address} with total balance of ${formatTORUS(accountData.balanceTotal)} TORUS`
    : 'View account details on Torus Explorer';

  return (
      <>
        <Helmet>
          <title>{title}</title>
          <meta name="description" content={description} />
          <meta property="og:title" content={title} />
          <meta property="og:description" content={description} />
          <meta property="og:type" content="website" />
          {accountData && (
            <>
              <meta property="og:url" content={window.location.href} />
              <meta name="twitter:card" content="summary" />
              <meta name="twitter:title" content={title} />
              <meta name="twitter:description" content={description} />
            </>
          )}
        </Helmet>
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

        </TerminalWindow>
      </>
  )
}