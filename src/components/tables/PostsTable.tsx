import React from 'react';
import { Trash2, Edit, ArrowUp, ArrowUpDown, ExternalLink } from 'lucide-react';
import { RunningPost } from '../../types/posts';
import { formatRelativeTime, formatDateTime } from '../../utils/posts';

type PostsTableProps = {
  items: RunningPost[];
  selectAll: boolean;
  onToggleSelectAll: () => void;
  onToggleSelectOne: (id: string) => void;
  onToggleItemVisibility?: (id: string) => void;
  onDeletePost: (id: string) => void;
  onEditPost: (post: RunningPost) => void;
  onSort: (column: string) => void;
  onClickTodayComments?: (post: RunningPost) => void;
};

export function PostsTable({
  items,
  selectAll,
  onToggleSelectAll,
  onToggleSelectOne,
  onDeletePost,
  onEditPost,
  onSort,
  onClickTodayComments,
}: PostsTableProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-slate-700 mb-1">Chưa có bài viết nào</h3>
        <p className="text-sm text-slate-400">Bài viết sẽ được hiển thị ở đây</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-100" style={{ backgroundColor: '#f1f3f5' }}>
            <th className="px-4 py-4 w-12">
              <button
                onClick={onToggleSelectAll}
                className={`w-[18px] h-[18px] rounded-[5px] flex items-center justify-center transition-all duration-200 cursor-pointer ${
                  selectAll
                    ? 'bg-[#007AFF] border-2 border-[#007AFF]'
                    : 'bg-white border-2 border-slate-300 hover:border-[#007AFF]'
                }`}
              >
                {selectAll && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </button>
            </th>
            <th className="px-4 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
              STT
            </th>
            <th className="px-4 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Bài viết
            </th>
            <th className="px-4 py-4 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Comment hôm nay
            </th>
            <th className="px-4 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <button
                onClick={() => onSort('lastComment')}
                className="flex items-center gap-1 hover:text-[#007AFF] transition-colors"
              >
                Comment gần nhất
                <ArrowUpDown className="w-3 h-3" strokeWidth={2.5} />
              </button>
            </th>
            <th className="px-4 py-4 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Thao tác
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, idx) => (
            <tr
              key={item.id}
              className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors group"
            >
              {/* Checkbox */}
              <td className="px-4 py-4">
                <button
                  onClick={() => onToggleSelectOne(item.id)}
                  className={`w-[18px] h-[18px] rounded-[5px] flex items-center justify-center transition-all duration-200 cursor-pointer ${
                    item.selected
                      ? 'bg-[#007AFF] border-2 border-[#007AFF]'
                      : 'bg-white border-2 border-slate-300 hover:border-[#007AFF]'
                  }`}
                >
                  {item.selected && (
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </button>
              </td>

              {/* STT */}
              <td className="px-4 py-4">
                <span className="text-sm font-semibold text-slate-400">{idx + 1}</span>
              </td>

              {/* Bài viết */}
              <td className="px-4 py-4">
                <div className="flex flex-col gap-1 max-w-xl">
                  <span className="text-sm font-semibold text-slate-700 truncate" title={item.title}>
                    {item.title}
                  </span>
                  <div className="flex items-center gap-2">
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-[#007AFF] hover:text-[#0056CC] transition-colors"
                    >
                      <ExternalLink className="w-3 h-3" strokeWidth={2.2} />
                      <span className="underline underline-offset-2 truncate max-w-[400px]">{item.url}</span>
                    </a>
                  </div>
                </div>
              </td>

              {/* Comment hôm nay */}
              <td className="px-4 py-4 text-center">
                <button
                  onClick={() => onClickTodayComments && onClickTodayComments(item)}
                  className={
                    'inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[13px] font-semibold border transition-all active:scale-95 ' +
                    ((item.commentCountToday || 0) > 0
                      ? 'text-[#34C759] bg-[#34C759]/10 border-[#34C759]/20 hover:bg-[#34C759]/15 shadow-sm'
                      : 'text-slate-400 bg-slate-100 border-slate-200 hover:bg-slate-200')
                  }
                  title="Xem comment hôm nay"
                >
                  <ArrowUp className="w-3.5 h-3.5" strokeWidth={2.5} />
                  <span className="tabular-nums">{item.commentCountToday || 0}</span>
                </button>
              </td>

              {/* Comment gần nhất */}
              <td className="px-4 py-4">
                {item.lastCommentAt ? (
                  (() => {
                    const now = Date.now();
                    const diffMs = now - new Date(item.lastCommentAt!).getTime();
                    const diffMin = Math.floor(diffMs / 60000);
                    const diffHours = Math.floor(diffMin / 60);
                    const diffDays = Math.floor(diffHours / 24);
                    let timeColor = '#94a3b8';
                    let timeBg = 'rgba(148, 163, 184, 0.1)';
                    if (diffMin < 5) { timeColor = '#16a34a'; timeBg = 'rgba(22, 163, 74, 0.1)'; }
                    else if (diffMin < 30) { timeColor = '#16a34a'; timeBg = 'rgba(22, 163, 74, 0.08)'; }
                    else if (diffHours < 2) { timeColor = '#d97706'; timeBg = 'rgba(217, 119, 6, 0.08)'; }
                    else if (diffHours < 6) { timeColor = '#ea580c'; timeBg = 'rgba(234, 88, 12, 0.08)'; }
                    else if (diffDays < 1) { timeColor = '#dc2626'; timeBg = 'rgba(220, 38, 38, 0.08)'; }
                    else { timeColor = '#dc2626'; timeBg = 'rgba(220, 38, 38, 0.1)'; }
                    return (
                      <div className="flex flex-col gap-0.5">
                        <span
                          className="text-[11px] font-semibold px-2 py-1 rounded-lg inline-block w-fit"
                          style={{ color: timeColor, background: timeBg }}
                        >
                          {formatRelativeTime(new Date(item.lastCommentAt!))}
                        </span>
                        <span className="text-[11px] text-slate-400 font-medium">
                          {formatDateTime(new Date(item.lastCommentAt!))}
                        </span>
                      </div>
                    );
                  })()
                ) : (
                  <span className="text-xs text-slate-400">—</span>
                )}
              </td>

              {/* Thao tác */}
              <td className="px-4 py-4">
                <div className="flex items-center justify-center gap-1">
                  <button
                    onClick={() => onEditPost(item)}
                    className="p-2 rounded-lg transition-all active:scale-90"
                    style={{ background: 'rgba(0, 122, 255, 0.08)' }}
                    title="Chỉnh sửa"
                  >
                    <Edit className="w-[15px] h-[15px]" style={{ color: '#007AFF' }} strokeWidth={2.2} />
                  </button>
                  <button
                    onClick={() => onDeletePost(item.id)}
                    className="p-2 rounded-lg transition-all active:scale-90"
                    style={{ background: 'rgba(255, 59, 48, 0.08)' }}
                    title="Xóa bài viết"
                  >
                    <Trash2 className="w-[15px] h-[15px]" style={{ color: '#FF3B30' }} strokeWidth={2.2} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
