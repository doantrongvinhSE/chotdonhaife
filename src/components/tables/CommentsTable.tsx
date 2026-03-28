import React, { useState } from 'react';
import { Comment, CommentStatus } from '../../types/posts';
import StatusDropdown from '../ui/StatusDropdown';
import { Pagination } from '../ui/Pagination';
import { ShoppingCart, RefreshCw } from 'lucide-react';
import { removeVietnameseAccents } from '../../utils/textUtils';
import { ToastType } from '../ui/Toast';

interface CommentsTableProps {
  comments: Comment[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onStatusChange: (commentId: string, status: CommentStatus) => void;
  onPageChange: (page: number) => void;
  onCreateOrder?: (comment: Comment) => void;
  compact?: boolean;
  onShowToast?: (message: string, type?: ToastType) => void;
}

const CommentsTable: React.FC<CommentsTableProps> = ({
  comments,
  loading,
  error,
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onStatusChange,
  onPageChange,
  onCreateOrder,
  compact = false,
  onShowToast,
}) => {
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [syncingPhone, setSyncingPhone] = useState<string | null>(null);

  const tdPad = compact ? 'px-3 py-2.5' : 'px-5 py-3.5';

  const abbreviate = (text: string, maxLength = 20) => {
    if (!text) return '';
    const actualMaxLength = compact ? Math.min(maxLength, 15) : maxLength;
    return text.length > actualMaxLength ? `${text.slice(0, actualMaxLength)}...` : text;
  };

  const abbreviateUrl = (url: string, maxLength = 48) => {
    if (url.length <= maxLength) return url;
    const keep = Math.floor((maxLength - 3) / 2);
    return url.slice(0, keep) + '...' + url.slice(-keep);
  };


  const copyPhone = async (phone: string) => {
    try {
      await navigator.clipboard.writeText(phone);
      if (onShowToast) {
        onShowToast(`Đã copy số điện thoại: ${phone}`, 'success');
      }
    } catch (err) {
      console.error('Failed to copy phone:', err);
      if (onShowToast) {
        onShowToast('Không thể copy số điện thoại', 'error');
      }
    }
  };

  // Lấy số điện thoại đầu tiên nếu có nhiều số
  const getFirstPhone = (phone: string | null): string | null => {
    if (!phone) return null;
    // Tách số điện thoại bằng dấu phẩy hoặc khoảng trắng
    const phones = phone.split(/[,，\s]+/).map(p => p.trim()).filter(p => p);
    return phones.length > 0 ? phones[0] : null;
  };

  const syncPhone = async (phone: string) => {
    // Lấy người gọi từ localStorage
    const selectedCallerKey = localStorage.getItem('selectedCaller');
    if (!selectedCallerKey) {
      if (onShowToast) {
        onShowToast('Vui lòng chọn người gọi trong Setting Call', 'warning');
      }
      return;
    }

    // Lấy tên người gọi gốc (có dấu) từ danh sách
    const DEFAULT_CALLERS = ['Hải', 'Hằng', 'Hoa', 'Hương', 'Hà', 'Linh', 'Thu', 'Liên'];
    const callerName = DEFAULT_CALLERS.find(caller => removeVietnameseAccents(caller) === selectedCallerKey) || selectedCallerKey;

    // Lấy số điện thoại đầu tiên
    const firstPhone = getFirstPhone(phone);
    if (!firstPhone) {
      if (onShowToast) {
        onShowToast('Không tìm thấy số điện thoại', 'warning');
      }
      return;
    }

    setSyncingPhone(firstPhone);
    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify(firstPhone);

      const requestOptions = {
        method: "PUT",
        headers: myHeaders,
        body: raw,
        redirect: "follow" as RequestRedirect
      };

      const url = `https://phoneasync-default-rtdb.firebaseio.com/${selectedCallerKey}.json`;
      const response = await fetch(url, requestOptions);
      
      if (response.ok) {
        if (onShowToast) {
          onShowToast(`Đã đồng bộ số điện thoại: ${firstPhone} cho ${callerName}`, 'success');
        }
      } else {
        throw new Error('Sync failed');
      }
    } catch (err) {
      console.error('Failed to sync phone:', err);
      if (onShowToast) {
        onShowToast('Không thể đồng bộ số điện thoại', 'error');
      }
    } finally {
      setSyncingPhone(null);
    }
  };


  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);

    const formatter = new Intl.DateTimeFormat('vi-VN', {
      timeZone: 'Asia/Ho_Chi_Minh',
      hour12: false,
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    const parts = Object.fromEntries(
      formatter.formatToParts(date).map(({ type, value }) => [type, value])
    );

    return {
      date: `${parts.day}/${parts.month}/${parts.year}`,
      time: `${parts.hour}:${parts.minute}:${parts.second}`,
    };
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-20 bg-white rounded-2xl">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500/30 border-t-blue-500"></div>
          <div className="absolute inset-0 animate-ping rounded-full h-16 w-16 border-4 border-blue-500/20"></div>
        </div>
        <span className="mt-6 text-xl text-slate-700 font-medium">Đang tải dữ liệu...</span>
        <span className="mt-2 text-slate-400">Vui lòng chờ trong giây lát</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <div className="bg-white border border-red-200 rounded-2xl p-8 max-w-md mx-auto shadow-sm">
          <div className="text-red-500 text-xl font-semibold mb-4">Lỗi tải dữ liệu</div>
          <div className="text-slate-600 mb-6">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  if (comments.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="bg-white rounded-2xl p-12 max-w-md mx-auto">
          <div className="text-6xl mb-4">💬</div>
          <div className="text-2xl text-slate-700 font-semibold mb-2">Chưa có comment nào</div>
          <div className="text-slate-400">Dữ liệu comment sẽ hiển thị ở đây khi có</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${compact ? 'text-xs' : ''}`}>
      {/* Table */}
      <div className="rounded-2xl bg-white relative z-10 border border-slate-200 shadow-sm overflow-visible">
        <div className="overflow-x-auto overflow-y-visible relative">
          <table className={`min-w-full ${compact ? 'table-auto' : 'table-fixed'}`}>
            <colgroup>
              {compact ? (
                <>
                  <col style={{ width: '8.5rem' }} />
                  <col style={{ width: '14rem' }} />
                  <col style={{ width: '9.5rem' }} />
                  <col style={{ width: '15rem' }} />
                  <col style={{ width: '8rem' }} />
                  <col style={{ width: '9rem' }} />
                  <col style={{ width: '7.5rem' }} />
                </>
              ) : (
                <>
                  <col style={{ width: '10rem' }} />
                  <col style={{ width: '18rem' }} />
                  <col style={{ width: '8.5rem' }} />
                  <col style={{ width: '21rem' }} />
                  <col style={{ width: '10rem' }} />
                  <col style={{ width: '9.5rem' }} />
                  <col style={{ width: '9rem' }} />
                </>
              )}
            </colgroup>
            <thead className="bg-[#f1f3f5]">
              <tr>
                <th className={`${compact ? 'px-3 py-2' : 'px-5 py-3'} text-left text-[11px] font-bold text-slate-700 uppercase tracking-[0.08em]`}>
                  THỜI GIAN
                </th>
                <th className={`${compact ? 'px-3 py-2' : 'px-5 py-3'} text-left text-[11px] font-bold text-slate-700 uppercase tracking-[0.08em]`}>
                  BÀI VIẾT
                </th>
                <th className={`${compact ? 'px-3 py-2' : 'px-5 py-3'} text-left text-[11px] font-bold text-slate-700 uppercase tracking-[0.08em]`}>
                  HỒ SƠ FACEBOOK
                </th>
                <th className={`${compact ? 'px-3 py-2' : 'px-5 py-3'} text-left text-[11px] font-bold text-slate-700 uppercase tracking-[0.08em]`}>
                  NỘI DUNG BÌNH LUẬN
                </th>
                <th className={`${compact ? 'px-3 py-2' : 'px-5 py-3'} text-left text-[11px] font-bold text-slate-700 uppercase tracking-[0.08em]`}>
                  SỐ ĐIỆN THOẠI
                </th>
                <th className={`${compact ? 'px-3 py-2' : 'px-5 py-3'} text-left text-[11px] font-bold text-slate-700 uppercase tracking-[0.08em]`}>
                  TRẠNG THÁI
                </th>
                <th className={`${compact ? 'px-3 py-2' : 'px-5 py-3'} text-center text-[11px] font-bold text-slate-700 uppercase tracking-[0.08em]`}>
                  THAO TÁC
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {comments.map((comment) => {
                const time = formatTimestamp(comment.timestamp);
                const hasPhone = Boolean(comment.phone);

                return (
                  <tr key={comment.id} className="bg-white hover:bg-slate-50/70 transition-colors [&>td]:align-middle">
                    <td className={`${tdPad} align-middle`}>
                      <div className="flex flex-col leading-tight">
                        <span className="text-sm font-semibold text-slate-800">{time.time}</span>
                        <span className="mt-0.5 text-xs text-slate-500">{time.date}</span>
                      </div>
                    </td>

                    <td className={`${tdPad} align-middle`}>
                      <div className="space-y-1.5">
                        <div className="truncate text-sm font-semibold text-slate-800" title={comment.post.name}>
                          {abbreviate(comment.post.name, compact ? 22 : 28)}
                        </div>
                        {comment.post.link && (
                          <a
                            href={comment.post.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block text-xs text-[#2563eb] hover:text-[#1d4ed8]"
                            title={comment.post.link}
                          >
                            {abbreviateUrl(comment.post.link, compact ? 22 : 28)}
                          </a>
                        )}
                      </div>
                    </td>

                    <td className={`${tdPad} align-middle`}>
                      <div className="flex items-center gap-3">
                        {comment.avatar_user ? (
                          <img
                            src={comment.avatar_user}
                            alt={comment.fb_name || 'Facebook avatar'}
                            className="h-8 w-8 shrink-0 rounded-full object-cover transition-transform duration-200 hover:scale-110 hover:ring-2 hover:ring-blue-200"
                            loading="lazy"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="h-8 w-8 shrink-0 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 font-bold text-sm">
                            {comment.fb_name ? comment.fb_name.charAt(0).toUpperCase() : '?'}
                          </div>
                        )}
                        <div className="min-w-0">
                          <button
                            onClick={() => window.open(`https://www.facebook.com/${comment.uid}`, '_blank')}
                            className="block max-w-full truncate whitespace-nowrap text-left text-sm text-[#2563ee] hover:text-[#1d4ed8] hover:underline hover:underline-offset-2 leading-5 font-medium transition-colors"
                            title={comment.fb_name || comment.uid}
                          >
                            {abbreviate(comment.fb_name || '-', compact ? 14 : 18)}
                          </button>
                          <div className="mt-0.5 text-xs text-slate-500 truncate" title={comment.uid}>
                            {comment.uid}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className={`${tdPad} align-middle`}>
                      <div className="truncate text-sm leading-5 text-slate-800" title={comment.content}>
                        {abbreviate(comment.content, compact ? 32 : 45)}
                      </div>
                    </td>

                    <td className={`${tdPad} align-middle`}>
                      {hasPhone ? (
                        <div className="inline-flex items-center gap-2">
                          <button
                            onClick={() => copyPhone(comment.phone!)}
                            className="text-sm font-bold text-[#2563ee] hover:text-[#1d4ed8] hover:underline hover:underline-offset-2 transition-colors"
                            title="Click để copy số điện thoại"
                          >
                            {comment.phone}
                          </button>
                          <button
                            onClick={() => syncPhone(comment.phone!)}
                            disabled={syncingPhone === getFirstPhone(comment.phone)}
                            className="p-1 hover:bg-slate-100 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Đồng bộ số điện thoại"
                          >
                            {syncingPhone === getFirstPhone(comment.phone) ? (
                              <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />
                            ) : (
                              <RefreshCw className="w-4 h-4 text-slate-400 hover:text-blue-500" />
                            )}
                          </button>
                        </div>
                      ) : (
                        <span className="italic text-sm text-slate-400">Không có</span>
                      )}
                    </td>

                    <td className={`${tdPad} align-middle`}>
                      <div className="flex items-center min-h-[36px]">
                        <StatusDropdown
                        currentStatus={comment.status}
                        onStatusChange={async (status) => {
                          if (updatingId) return;
                          setUpdatingId(comment.id);
                          try {
                            onStatusChange(comment.id, status);
                          } finally {
                            setUpdatingId(null);
                          }
                        }}
                        compact={compact}
                        loading={updatingId === comment.id}
                        disabled={updatingId !== null}
                      />
                      </div>
                    </td>

                    <td className={`${tdPad} align-middle text-center`}>
                      <div className="flex items-center justify-center min-h-[36px]">
                        {onCreateOrder && (
                        <button
                          onClick={() => onCreateOrder(comment)}
                          className={`mx-auto inline-flex items-center gap-1.5 ${compact ? 'px-2.5 py-1.5 text-xs' : 'px-4 py-2 text-sm'} bg-[#2563ee] hover:bg-[#1d4ed8] text-white font-semibold rounded-[10px] transition-all duration-200 ease-out shadow-sm hover:-translate-y-0.5 hover:shadow-[0_10px_20px_-10px_rgba(37,99,238,0.75)] active:translate-y-0 active:scale-[0.98]`}
                          title="Tạo đơn hàng từ comment này"
                        >
                          <ShoppingCart className={`${compact ? 'w-3 h-3' : 'w-4 h-4'}`} />
                          <span>Tạo đơn</span>
                        </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
        />
      )}

      {/* Summary */}
      {!compact && (
        <div className="text-sm text-slate-500 text-center">
          Hiển thị {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, totalItems)} trong tổng số {totalItems} comment
        </div>
      )}
    </div>
  );
};

export default CommentsTable;
