import React, { useState } from 'react';
import { AlarmClockCheck, MessageSquare, MessageSquareDashed, Search } from 'lucide-react';
import { useComments } from '../hooks/useComments';
import { useOrders } from '../hooks/useOrders';
import CommentsTable from '../components/tables/CommentsTable';
import CreateOrderModal from '../components/forms/CreateOrderModal';
import DateRangeFilter from '../components/filters/DateRangeFilter';
import { Toast, ToastType } from '../components/ui/Toast';
import { Comment } from '../types/posts';

const CommentsPage: React.FC = () => {
  const [toastMessage, setToastMessage] = useState<string>('');
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState<ToastType>('success');
  const [showCreateOrderModal, setShowCreateOrderModal] = useState(false);
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null);
  const [searchKeyword, setSearchKeyword] = useState('');

  const showToastMessage = (message: string, type: ToastType = 'success') => {
    setToastType(type);
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const {
    comments,
    loading,
    error,
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    isRealTime,
    lastUpdate,
    todayCount,
    updateCommentStatus,
    fetchComments,
    setCurrentPage,
    filterCommentsByDate,
    clearDateFilter,
    phoneFilter,
    togglePhoneFilter,
    notificationsEnabled,
    toggleNotifications,
    highlightedIds,
  } = useComments(showToastMessage);

  const { addOrder, addingOrder } = useOrders(showToastMessage);

  const handleRefresh = () => {
    setCurrentPage(1);
    fetchComments(false, 1);
  };

  const handleCreateOrder = (comment: Comment) => {
    setSelectedComment(comment);
    setShowCreateOrderModal(true);
  };

  const handleCloseCreateOrderModal = () => {
    setShowCreateOrderModal(false);
    setSelectedComment(null);
  };

  const handleSubmitOrder = async (orderData: {
    product_name: string;
    customer_name: string;
    phone: string;
    address: string;
    note: string;
    price: number;
    quality: number;
    total_price: number;
  }) => {
    try {
      await addOrder({
        ...orderData,
        avatar_customer: selectedComment?.avatar_user || undefined,
        status: 'pending',
      });
      handleCloseCreateOrderModal();
    } catch {
      // Error handling được thực hiện trong useOrders hook
    }
  };

  return (
    <div className="min-h-full py-4 px-8 space-y-4" style={{ backgroundColor: '#f5f7fa' }}>
      {/* Header Section */}
      <div className="rounded-2xl overflow-hidden px-5 pt-0 pb-0" style={{ backgroundColor: '#f5f7fa' }}>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          {/* Left: Title & Description */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-blue-500 text-white flex items-center justify-center flex-shrink-0">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-slate-800">Danh sách bình luận</h1>
              <p className="text-xs text-slate-500">
                Quản lý và tương tác với khách hàng thông qua các phản hồi từ mạng xã hội
                {isRealTime && (
                  <span className="ml-2 text-emerald-500 animate-pulse">• Cập nhật lần cuối: {lastUpdate}</span>
                )}
              </p>
            </div>
          </div>

          {/* Right: Stat Cards */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Total Card */}
            <div className="rounded-xl border border-slate-100 bg-white px-4 py-3 flex items-center gap-3 shadow-sm min-w-[180px] transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg hover:border-blue-200 hover:bg-blue-50/30 active:scale-[0.99]">
              <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <MessageSquareDashed className="w-4 h-4 text-blue-500" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide">Tổng số</p>
                <p className="text-base font-bold text-slate-800 leading-tight">{totalItems.toLocaleString()}</p>
              </div>
            </div>

            {/* Today Card */}
            <div className="rounded-xl border border-slate-100 bg-white px-4 py-3 flex items-center gap-3 shadow-sm min-w-[200px] transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg hover:border-orange-200 hover:bg-orange-50/30 active:scale-[0.99]">
              <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                <AlarmClockCheck className="w-4 h-4 text-orange-500" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide">Hôm nay</p>
                <div className="flex items-center gap-2">
                  <p className="text-base font-bold text-green-600 leading-tight">{todayCount.toLocaleString()}</p>
                  <span className="text-[10px] font-semibold text-red-500 bg-red-50 px-1.5 py-0.5 rounded">Mới</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px" style={{ backgroundColor: '#dde3ec' }}></div>

      {/* Actions Bar */}
      <div className="rounded-2xl bg-white overflow-hidden px-5 py-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-nowrap items-center gap-3">
            <div className="relative w-full min-w-[220px] max-w-[280px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="Tìm kiếm..."
                className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="date"
                onChange={(e) => {
                  const endDateInput = e.target.closest('.flex')?.querySelector('input[type="date"]:last-of-type') as HTMLInputElement;
                  if (endDateInput?.value) {
                    filterCommentsByDate(e.target.value, endDateInput.value);
                  }
                }}
                className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
              <span className="text-sm text-slate-400">—</span>
              <input
                type="date"
                onChange={(e) => {
                  const startDateInput = e.target.closest('.flex')?.querySelector('input[type="date"]:first-of-type') as HTMLInputElement;
                  if (startDateInput?.value) {
                    filterCommentsByDate(startDateInput.value, e.target.value);
                  }
                }}
                className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="flex flex-nowrap items-center gap-2">
            <DateRangeFilter
              onDateRangeChange={filterCommentsByDate}
              onClear={clearDateFilter}
              phoneFilter={phoneFilter}
              onTogglePhoneFilter={togglePhoneFilter}
              notificationsEnabled={notificationsEnabled}
              onToggleNotifications={toggleNotifications}
              loading={loading}
            />
          </div>
        </div>
      </div>

      <CommentsTable
        comments={comments}
        loading={loading}
        error={error}
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onStatusChange={updateCommentStatus}
        onPageChange={setCurrentPage}
        onCreateOrder={handleCreateOrder}
        compact={false}
        onShowToast={showToastMessage}
        highlightedIds={highlightedIds}
      />

      <CreateOrderModal
        isOpen={showCreateOrderModal}
        onClose={handleCloseCreateOrderModal}
        comment={selectedComment}
        onSubmit={handleSubmitOrder}
        loading={addingOrder}
      />

      <Toast
        message={toastMessage}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
        type={toastType}
      />
    </div>
  );
};

export default CommentsPage;
