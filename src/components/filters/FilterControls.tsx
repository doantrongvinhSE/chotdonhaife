import { Search, Trash2, X } from 'lucide-react';

type FilterControlsProps = {
  searchTitle: string;
  onSearchTitleChange: (value: string) => void;
  filterStatus: string;
  onFilterStatusChange: (value: string) => void;
  onClearFilters: () => void;
  onDeleteSelected: () => void;
  selectedCount: number;
};

export function FilterControls({
  searchTitle,
  onSearchTitleChange,
  filterStatus,
  onFilterStatusChange,
  onClearFilters,
  onDeleteSelected,
  selectedCount,
}: FilterControlsProps) {
  const hasFilters = searchTitle || filterStatus;

  return (
    <div className="px-5 py-4 border-b border-slate-100">
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
        {/* Search Input */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTitle}
            onChange={(e) => onSearchTitleChange(e.target.value)}
            placeholder="Tìm kiếm tiêu đề..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
          />
          {searchTitle && (
            <button
              onClick={() => onSearchTitleChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Status Tabs */}
        <div className="flex items-center bg-slate-100 rounded-xl p-1 gap-1 overflow-x-auto">
          {[
            { key: '', label: 'Tất cả' },
            { key: 'Đang chạy', label: 'Đang chạy' },
            { key: 'Đã dừng', label: 'Đã dừng' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => onFilterStatusChange(tab.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                filterStatus === tab.key
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Delete Selected + Clear */}
        <div className="flex items-center gap-2">
          {hasFilters && (
            <button
              onClick={onClearFilters}
              className="flex items-center px-3 py-2 text-slate-500 hover:text-slate-700 text-sm font-medium transition-colors"
            >
              <X className="w-4 h-4 mr-1" />
              Xóa lọc
            </button>
          )}
          {selectedCount > 0 && (
            <button
              onClick={onDeleteSelected}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-sm font-medium rounded-xl transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Xóa {selectedCount} bài viết
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
