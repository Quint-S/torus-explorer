import React from 'react';
import { ResponsiveAddress } from './ResponsiveAddress';
import { DataTable } from './DataTable';
import {DetailLabel, DetailValue} from "../pages/AccountDetails.tsx";
import {CopyButton} from "./CopyButton.tsx";

interface TransferDetailsProps {
  data: string;
}

export const TransferDetails: React.FC<TransferDetailsProps> = ({ data }) => {
  const [from, to, amountHex] = JSON.parse(data);
  const amount = BigInt(amountHex).toString();

  return ( <div style={{borderBottom: "1px solid #0050a1"}}>
          <DetailLabel>Transfer:</DetailLabel>
    <DataTable
      names={['From', 'To', 'Amount']}
      records={[{
        id: '1',
        data: [
          <ResponsiveAddress linkPath="account" address={from} />,
          <ResponsiveAddress linkPath="account" address={to} />,
          amount
        ]
      }]}
    /></div>
  );
};