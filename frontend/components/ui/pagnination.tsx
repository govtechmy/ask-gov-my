'use client';

import React from 'react';
import RightArrow from '@/icons/rightarrow';
import LeftArrow from '@/icons/leftarrow';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
  totalItems: number;
  setPaginatedItems: (items: any[]) => void;
  items: any[];
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  totalItems,
  setPaginatedItems,
  items,
}) => {
  React.useEffect(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    const endIdx = startIdx + itemsPerPage;
    const currentItems = items.slice(startIdx, endIdx);
    setPaginatedItems(currentItems);
  }, [currentPage, items]);

  const renderPageNumbers = () => {
    const pageNumbers = [];
    pageNumbers.push(
      <button
        key={1}
        onClick={() => onPageChange(1)}
        className={`rounded-lg h-10 w-10 ${
          currentPage === 1
            ? 'bg-[#F4EFFF] text-[#702FF9] dark:bg-[#201636] dark:text-[#9E70FF]'
            : 'bg-transparent text-black-700 dark:text-[#D4D4D8]'
        }`}
      >
        {1}
      </button>,
    );

    if (currentPage > 1) {
      pageNumbers.push(
        <span key="ellipsis-start" className="px-2 py-2">
          ...
        </span>,
      );
    }

    let startPage, endPage;
    if (currentPage <= 2) {
      startPage = 2;
      endPage = Math.min(4, totalPages - 1);
    } else if (currentPage >= totalPages - 2) {
      startPage = Math.max(2, totalPages - 3);
      endPage = totalPages - 1;
    } else {
      startPage = Math.max(2, currentPage - 1);
      endPage = Math.min(currentPage + 1, totalPages - 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`rounded-lg h-10 w-10 ${
            i === currentPage
              ? 'bg-[#F4EFFF] text-[#702FF9] dark:bg-[#201636] dark:text-[#9E70FF]'
              : 'bg-transparent text-black-700 dark:text-[#D4D4D8]'
          }`}
        >
          {i}
        </button>,
      );
    }

    if (currentPage < totalPages - 2) {
      pageNumbers.push(
        <span key="ellipsis-end" className="px-2 py-2 rounded-lg">
          ...
        </span>,
      );
    }

    if (totalPages > 1) {
      pageNumbers.push(
        <button
          key={totalPages}
          onClick={() => onPageChange(totalPages)}
          className={`rounded-lg h-10 w-10 ${
            totalPages === currentPage
              ? 'bg-[#F4EFFF] dark:bg-[#201636] text-[#702FF9] dark:text-[#9E70FF]'
              : 'bg-transparent text-black-700 dark:text-[#D4D4D8]'
          }`}
        >
          {totalPages}
        </button>,
      );
    }

    return <div className="flex rounded items-center">{pageNumbers}</div>;
  };

  return (
    <div className="mt-4 rounded-lg flex items-center justify-center pb-7">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`rounded-lg h-10 w-10 bg-[#FFFFFF] dark:bg-[#18181B] shadow-button text-[#FFFFFF] border-[1px] border-[#E4E4E7] dark:border-[#27272A] ${
          currentPage === 1 ? 'opacity-30' : 'opacity-100'
        }`}
      >
        <div className="h-10 w-10 rounded-lg flex items-center justify-center">
          <div className="flex items-center justify-center h-5 w-5">
            <LeftArrow className="stroke-[#18181B] dark:stroke-[#FFFFFF]" />
          </div>
        </div>
      </button>

      <div className="rounded-lg p-3">{renderPageNumbers()}</div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`rounded-lg h-10 w-10 bg-[#FFFFFF] dark:bg-[#18181B] shadow-button text-[#FFFFFF] border-[1px] border-[#E4E4E7] dark:border-[#27272A] ${
          currentPage === totalPages ? 'opacity-30' : 'opacity-100'
        }`}
      >
        <div className="h-10 w-10 rounded-lg flex items-center justify-center">
          <div className="flex items-center justify-center h-5 w-5">
            <RightArrow className="stroke-[#18181B] dark:stroke-[#FFFFFF]" />
          </div>
        </div>
      </button>
    </div>
  );
};

export default Pagination;
