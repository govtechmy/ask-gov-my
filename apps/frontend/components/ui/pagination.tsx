'use client';

import React from 'react';
import RightArrow from '@/icons/rightarrow';
import LeftArrow from '@/icons/leftarrow';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const getPageNumbers = () => {
    const pageNumbers = [];

    pageNumbers.push(1);

    if (currentPage > 2) {
      pageNumbers.push('ellipsis-start');
    }

    let startPage, endPage;
    if (currentPage <= 2) {
      startPage = 2;
      endPage = Math.min(4, totalPages - 1);
    } else if (currentPage >= totalPages - 2) {
      startPage = Math.max(2, totalPages - 3);
      endPage = totalPages - 1;
    } else {
      startPage = currentPage - 1;
      endPage = currentPage + 1;
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    if (currentPage < totalPages - 2) {
      pageNumbers.push('ellipsis-end');
    }

    if (totalPages > 1) {
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  const renderPageNumbers = () => {
    const pageNumbers = getPageNumbers();

    return (
      <div className="flex rounded items-center">
        {pageNumbers.map((pageNumber, index) => {
          if (typeof pageNumber === 'number') {
            return (
              <button
                key={index}
                onClick={() => onPageChange(pageNumber)}
                className={`rounded-lg h-10 w-10 ${
                  pageNumber === currentPage
                    ? 'bg-[#F4EFFF] text-[#702FF9] dark:bg-[#201636] dark:text-[#9E70FF]'
                    : 'bg-transparent text-black-700 dark:text-[#D4D4D8]'
                }`}
              >
                {pageNumber}
              </button>
            );
          } else {
            return (
              <span key={index} className="px-2 py-2">
                ...
              </span>
            );
          }
        })}
      </div>
    );
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
