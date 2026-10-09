import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface AdminPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize?: number;
  onPageChange: (page: number) => void;
  className?: string;
  itemUnit?: string;
}

export const AdminPagination: React.FC<AdminPaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  pageSize = 10,
  onPageChange,
  className = '',
  itemUnit = '条'
}) => {
  if (totalItems === 0) return null;

  // Calculate visible page numbers with ellipsis or sliding window
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      if (currentPage > 3) {
        pages.push('...');
      }
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      if (currentPage < totalPages - 2) {
        pages.push('...');
      }
      pages.push(totalPages);
    }
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className={`p-4 border-t border-slate-800 bg-slate-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-400 ${className}`}>
      <div className="flex items-center gap-2 font-mono">
        <span>共 <strong className="text-slate-200">{totalItems}</strong> {itemUnit}数据</span>
        <span className="text-slate-600">|</span>
        <span>每页 <strong className="text-slate-200">{pageSize}</strong> {itemUnit}</span>
        <span className="text-slate-600">|</span>
        <span>第 <strong className="text-indigo-400">{currentPage}</strong> / {totalPages || 1} 页</span>
      </div>

      <div className="flex items-center gap-1.5 self-end sm:self-auto">
        {/* 上一页 */}
        <button
          type="button"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          className="px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition flex items-center gap-1 font-medium border border-slate-700/60 shadow-xs"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>上一页</span>
        </button>

        {/* 页码列表 */}
        <div className="flex items-center gap-1">
          {pageNumbers.map((p, idx) => {
            if (p === '...') {
              return (
                <span key={`ellipsis-${idx}`} className="w-7 h-7 flex items-center justify-center text-slate-500 font-mono select-none">
                  ...
                </span>
              );
            }

            const pageNum = p as number;
            const isActive = pageNum === currentPage;

            return (
              <button
                key={pageNum}
                type="button"
                onClick={() => onPageChange(pageNum)}
                className={`w-7 h-7 rounded-lg text-xs font-mono font-bold flex items-center justify-center transition cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-xs border border-indigo-500'
                    : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/60'
                }`}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        {/* 下一页 */}
        <button
          type="button"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          className="px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition flex items-center gap-1 font-medium border border-slate-700/60 shadow-xs"
        >
          <span>下一页</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
