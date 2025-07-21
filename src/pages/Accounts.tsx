import { gql, useQuery } from '@apollo/client'
import { TerminalWindow } from '../components/TerminalWindow'
import { formatTORUS} from "../utils/utils.ts";
import { DataTable } from '../components/DataTable.tsx';
import { useState, useEffect} from 'react';
import { PaginationControls } from '../components/PaginationControls.tsx';
import { TerminalLoading } from '../components/TerminalLoading.tsx';
import {ResponsiveAddress} from "../components/ResponsiveAddress.tsx";
import { Helmet } from 'react-helmet-async';

const GET_ACCOUNTS = gql`
  query GetAccounts($first: Int!, $offset: Int!) {
    accounts(first: $first
        offset: $offset
        orderBy: BALANCE_TOTAL_DESC) {
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

const GET_ACCOUNTS_FAST = gql`
  query GetAccountsFast($first: Int!, $offset: Int!) {
    accounts(first: $first
        offset: $offset
        orderBy: BALANCE_TOTAL_DESC
        filter: { balanceTotal: { greaterThan: "400000000000000000000000" } }) {
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
    const [useFullData, setUseFullData] = useState(false);
    const itemsPerPage = 25;
  
    // Fast initial query for high-balance accounts
    const { loading: fastLoading, error: fastError, data: fastData } = useQuery(GET_ACCOUNTS_FAST, {
      variables: { first: itemsPerPage, offset: currentPage * itemsPerPage },
      skip: useFullData
    });

    // Full query that loads in background
    const { loading: fullLoading, error: fullError, data: fullData } = useQuery(GET_ACCOUNTS, {
      variables: { first: itemsPerPage, offset: currentPage * itemsPerPage },
      fetchPolicy: 'cache-and-network'
    });

    // Switch to full data once it's loaded and we're on the first page
    useEffect(() => {
      if (fullData && !fullLoading && currentPage === 0 && !useFullData) {
        setUseFullData(true);
      }
    }, [fullData, fullLoading, currentPage, useFullData]);

    // When user navigates to other pages, immediately use full data
    useEffect(() => {
      if (currentPage > 0) {
        setUseFullData(true);
      }
    }, [currentPage]);

    // Determine which data to use
    const isLoading = useFullData ? fullLoading : fastLoading;
    const error = useFullData ? fullError : fastError;
    const data = useFullData ? fullData : fastData;

    const title = 'Accounts | TorEx - Torus Blockchain Explorer';
    const description = data 
      ? `Browse ${data.accounts.totalCount.toLocaleString()} accounts on the Torus blockchain - View balances, transfers, and account details`
      : 'Browse accounts on the Torus blockchain - View balances, transfers, and account details';

    const pageControls = (
<div className={'flex'}>
        {isLoading && <TerminalLoading/>}
        {data && <PaginationControls
          currentPage={currentPage}
          totalCount={data.accounts.totalCount}
          itemsPerPage={itemsPerPage}
          dataLength={data?.accounts.nodes.length}
          onPageChange={setCurrentPage}
          isLoadingTotal={!useFullData && fullLoading}
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
            {isLoading && <TerminalLoading/>}
            {error && <div>Error: {error.message}</div>}

            {data && (
                <div >
                  <DataTable
                      names={['Address', 'Total Balance', 'Free', 'Staked']}
                      records={data.accounts.nodes.map((acc: { id: string; address: string; balanceTotal: number; balanceFree: number; balanceStaked: number; }) => ({
                        id: acc.id,
                        data: [
                            <ResponsiveAddress linkPath={'account'} address={acc.address}/>,
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