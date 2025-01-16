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

export const DataTable = ({ names, records }: TableProps) => {
  return (
      <table className="divide-y divide-blue-950 w-full">
        <thead>
          <tr>
            {names.map((name, index) => (
              <th
                key={index}
                className="py-2 text-center text-gray-400 uppercase"
              >
                {name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <tr key={record.id}>
              {record.data.map((data, index) => (
                <td
                  key={index}
                  className="px-1 text-center"
                >
                  {data}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
  );
};