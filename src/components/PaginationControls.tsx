
interface PaginationControlsProps {
  currentPage: number;
  totalCount: number;
  itemsPerPage: number;
  dataLength?: number;
  onNext: () => void;
  onPrevious: () => void;
}

export const PaginationControls = ({
  currentPage,
  totalCount,
  itemsPerPage,
  dataLength,
  onNext,
  onPrevious
}: PaginationControlsProps) => {
  return (
    <div className={'flex items-center'}>
        <div style={{borderRight: '1px solid #00c4ff'}}>
      <button
        onClick={onPrevious}
        disabled={currentPage === 0}
        className={'p-1 bg-transparent border-0 hover:text-blue-400'}
      >
        ⟵
      </button>
      <span>{currentPage + 1} of {Math.ceil(totalCount/itemsPerPage)}</span>
      <button
        onClick={onNext}
        disabled={Boolean((dataLength && dataLength < itemsPerPage))}
        className={'p-1 bg-transparent border-0 hover:text-blue-400'}
      >
        ⟶
      </button>
        </div>
        <div>
            <span style={{paddingLeft: '5px'}}>[{Math.min(((currentPage)*itemsPerPage)+1, totalCount)}..{Math.min((currentPage+1)*itemsPerPage, totalCount)} of {totalCount}]</span>
        </div>
    </div>
  );
};