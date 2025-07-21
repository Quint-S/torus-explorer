import { useEffect, useState } from "react";

interface PaginationControlsProps {
  currentPage: number;
  totalCount: number;
  itemsPerPage: number;
  dataLength?: number;
  onPageChange: (page: number) => void;
  isLoadingTotal?: boolean;
}

export const PaginationControls = ({
  currentPage,
  totalCount,
  itemsPerPage,
  dataLength,
  onPageChange,
  isLoadingTotal = false
}: PaginationControlsProps) => {
  const [inputValue, setInputValue] = useState((currentPage + 1).toString());

  const totalPages = Math.ceil(totalCount / itemsPerPage);
  
  useEffect(() => {
  setInputValue((currentPage + 1).toString());
}, [currentPage]);
const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setInputValue(e.target.value);
};
const handlePageChange = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (e.key === 'Enter') {
    const page = parseInt(inputValue);
    if (!isNaN(page) && page > 0 && page <= totalPages) {
      onPageChange(page - 1);
    } else {
      // Reset to current page if invalid
      setInputValue((currentPage + 1).toString());
    }
  }
};

  return (
    <div className={'flex items-center whitespace-nowrap'}>
      <div style={{borderRight: '1px solid #00c4ff'}} className="flex items-center">
        <button
          onClick={() => onPageChange(currentPage-1)}
          disabled={currentPage === 0}
          className={'p-1 bg-transparent border-0 hover:text-blue-400'}
        >
          ⟵
        </button>
        <input
  // type="number"
  min={1}
  max={totalPages}
  value={inputValue}
  onChange={handleInputChange}
  onKeyDown={handlePageChange}
  className="w-12 mx-1 text-center bg-transparent border border-gray-400 rounded-none focus:outline-none appearance-none"
  style={{ WebkitAppearance: 'none', MozAppearance: 'textfield' }}
/>
        <span>of {isLoadingTotal ? '...' : totalPages}</span>
        <button
          onClick={() => onPageChange(currentPage+1)}
          disabled={Boolean((dataLength && dataLength < itemsPerPage))}
          className={'p-1 bg-transparent border-0 hover:text-blue-400'}
        >
          ⟶
        </button>
      </div>
      <div>
        <span style={{paddingLeft: '5px'}}>[{Math.min(((currentPage)*itemsPerPage)+1, totalCount)}..{Math.min((currentPage+1)*itemsPerPage, totalCount)} of {isLoadingTotal ? '...' : totalCount.toLocaleString()}]</span>
      </div>
    </div>
  );
};