import React from 'react';
import { Search, Calendar, Filter, X } from 'lucide-react';
import { OrderStatus } from '../../types/posts';

interface OrderFiltersProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onClearFilters: () => void;
  activeStatus?: OrderStatus | 'all';
  onStatusChange?: (status: OrderStatus | 'all') => void;
  statusTabs?: { key: OrderStatus | 'all'; label: string }[];
}

const defaultTabs: { key: OrderStatus | 'all'; label: string }[] = [
  { key: 'all', label: 'Tất cả' },
  { key: 'processing', label: 'Đang xử lý' },
  { key: 'completed', label: 'Hoàn thành' },
  { key: 'cancelled', label: 'Đã hủy' },
];

const OrderFilters: React.FC<OrderFiltersProps & { children?: React.ReactNode }> = ({
  searchTerm,
  onSearchChange,
  onClearFilters,
  activeStatus = 'all',
  onStatusChange,
  statusTabs,
  children,
}) => {
  const tabs = statusTabs || defaultTabs;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 mb-4">
      <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">

        {/* Left side: filters */}
        <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center flex-1">

          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Tìm kiếm mã đơn, khách hàng..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Date Range Input */}
          <div className="relative min-w-[160px]">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="date"
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
            />
          </div>

          {/* Status Tabs */}
          {onStatusChange && (
            <div className="flex items-center bg-slate-100 rounded-xl p-1 gap-1 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => onStatusChange(tab.key)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                    activeStatus === tab.key
                      ? 'bg-blue-500 text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-700 hover:bg-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          )}

          {/* Filter Button */}
          <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 transition-all">
            <Filter className="w-4 h-4" />
            Bộ lọc
          </button>

        </div>

        {/* Right side: additional actions */}
        {children && (
          <div className="flex items-center gap-2 flex-shrink-0">
            {children}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderFilters;
