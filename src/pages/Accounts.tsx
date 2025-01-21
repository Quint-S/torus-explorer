import { gql, useQuery } from '@apollo/client'
import { TerminalWindow } from '../components/TerminalWindow'
import { formatTORUS} from "../utils/utils.ts";
import { DataTable } from '../components/DataTable.tsx';
import { useState} from 'react';
import { PaginationControls } from '../components/PaginationControls.tsx';
import { TerminalLoading } from '../components/TerminalLoading.tsx';
import {Link} from "react-router-dom";
import {ResponsiveAddress} from "../components/ResponsiveAddress.tsx";
import { Helmet } from 'react-helmet-async';

const GET_ACCOUNTS = gql`
  query GetAccounts($first: Int!, $offset: Int!) {
    accounts(first: $first, offset: $offset, orderBy: BALANCE_TOTAL_DESC) {
      nodes {
        id
        address
        balanceTotal
        balanceFree
        balanceStaked
      }
      totalCount
    }
  }
`

export const Accounts = () => {
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 25;
  
    const { loading, error, data } = useQuery(GET_ACCOUNTS, {
      variables: { first: itemsPerPage, offset: currentPage * itemsPerPage }
    });

    const title = 'Accounts | TorEx - Torus Blockchain Explorer';
    const description = data 
      ? `Browse ${data.accounts.totalCount.toLocaleString()} accounts on the Torus blockchain - View balances, transfers, and account details`
      : 'Browse accounts on the Torus blockchain - View balances, transfers, and account details';


    const pageControls = (
<div className={'flex'}>
        {loading && <TerminalLoading/>}
        {data && <PaginationControls
          currentPage={currentPage}
          totalCount={data.accounts.totalCount}
          itemsPerPage={itemsPerPage}
          dataLength={data?.accounts.nodes.length}
          onPageChange={setCurrentPage}
        />}</div>
      );


    return (
        <>
          <Helmet>
            <title>{title}</title>
            <meta name="description" content={description} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:type" content="website" />
            <meta property="og:url" content={window.location.href} />
            <meta name="twitter:card" content="summary" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
          </Helmet>
          <TerminalWindow title="Accounts" footer={pageControls}>
            {loading && <TerminalLoading/>}
            {error && <div>Error: {error.message}</div>}

            {data && (
                <div >
                  <DataTable
                      names={['Address', 'Total Balance', 'Free', 'Staked']}
                      records={data.accounts.nodes.map((acc: { id: string; address: string; balanceTotal: number; balanceFree: number; balanceStaked: number; }) => ({
                        id: acc.id,
                        data: [
                            <Link to={`/account/${acc.address}`}><ResponsiveAddress address={acc.address}/></Link>,
                          formatTORUS(acc.balanceTotal),
                          formatTORUS(acc.balanceFree),
                          formatTORUS(acc.balanceStaked)
                        ]
                      }))}
                  />
                </div>
                
            )}
          </TerminalWindow>
        </>
    );
};