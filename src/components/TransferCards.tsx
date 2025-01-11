

export interface TableRecord {
  id: string;
  data: string[];
}
export interface RecordData {
  name: string;
  data: string;
  url?: string;
}

interface TableProps {
  names: string[];
  records: TableRecord[];
}


export const TransferCards = ({ names, records }: TableProps) => {
    return (
      <div className="flex flex-col">
          <div className="flex justify-stretch border-b border-b-blue-950">
        {names.map((record) => (
                  <div className="font-medium w-full text-center">{record}</div>
        ))}
          </div>

        {records.map((record) => (
            <div className="flex justify-stretch">
              {record.data.map((data, index) => (
                  <span className="text-sm font-medium w-full text-center">{data}</span>
              ))}
            </div>
        ))}
      </div>
    );
  };