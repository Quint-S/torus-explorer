import { gql, useQuery } from '@apollo/client'
import { TerminalWindow } from '../components/TerminalWindow'
import { formatTORUS} from "../utils/utils.ts";
import { DataTable } from '../components/DataTable.tsx';
import { useState} from 'react';
import { PaginationControls } from '../components/PaginationControls.tsx';
import { TerminalLoading } from '../components/TerminalLoading.tsx';
import {Link, useNavigate} from "react-router-dom";
import {ResponsiveAddress} from "../components/ResponsiveAddress.tsx";
import {SearchBar} from "../components/SearchBar.tsx";

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
    const onsearch = (search: string) => {
        navigate(`/account/${search}`)
    }
    const pageControls = (
<div className={'flex'}>
        {loading && <TerminalLoading/>}
        {data && <PaginationControls
          currentPage={currentPage}
          totalCount={data.accounts.totalCount}
          itemsPerPage={itemsPerPage}
          dataLength={data?.accounts.nodes.length}
          onPageChange={setCurrentPage}
        />}<SearchBar placeholder={'Enter address to lookup..'} onSearch={onsearch}/></div>
      );

    const navigate = useNavigate();

    return (
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
    );
};