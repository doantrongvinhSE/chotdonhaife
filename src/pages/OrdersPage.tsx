import React, { useMemo, useState } from 'react';
import { ShoppingCart, RefreshCw, Trash2, Plus, Wallet, Package } from 'lucide-react';
import { useOrders } from '../hooks/useOrders';
import OrdersTable from '../components/tables/OrdersTable';
import { Pagination } from '../components/ui/Pagination';
import OrderForm from '../components/forms/OrderForm';
import OrderFilters from '../components/filters/OrderFilters';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import { Toast } from '../components/ui/Toast';
import { ExportOrdersButton } from '../components/ui/ExportOrdersButton';
import { Order, OrderStatus } from '../types/posts';

const OrdersPage: React.FC = () => {
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [deletingOrder, setDeletingOrder] = useState<Order | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showBulkConfirmDialog, setShowBulkConfirmDialog] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const showToastMessage = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const {
    orders,
    loading,
    error,
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    searchTerm,
    statusFilter,
    updatingOrder,
    deletingOrder: isDeletingOrder,
    setCurrentPage,
    setSearchTerm,
    setStatusFilter,
    fetchOrders,
    updateOrder,
    deleteOrder,
    clearFilters,
    allOrders,
  } = useOrders(showToastMessage);

  const currentPageIds = useMemo(() => orders.map(o => o.id), [orders]);
  const allSelected = useMemo(
    () => currentPageIds.length > 0 && currentPageIds.every(id => selectedIds.includes(id)),
    [currentPageIds, selectedIds]
  );

  // Stats calculation
  const stats = useMemo(() => {
    const total = allOrders.length;
    const todayStr = new Date().toISOString().split('T')[0];
    const todayCount = allOrders.filter(o => o.createdAt.startsWith(todayStr)).length;
    const totalRevenue = allOrders.reduce((sum, o) => {
      return sum + (o.status === 'completed' ? (o.total_price || 0) : 0);
    }, 0);

    const formatRevenue = (num: number) => {
      if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1) + 'B';
      if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M';
      if (num >= 1_000) return (num / 1_000).toFixed(1) + 'K';
      return num.toString();
    };

    return { total, todayCount, revenue: formatRevenue(totalRevenue) };
  }, [allOrders]);

  const handleEditOrder = (order: Order) => {
    setEditingOrder(order);
  };

  const handleDeleteOrder = (order: Order) => {
    setDeletingOrder(order);
    setShowConfirmDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (deletingOrder) {
      try {
        await deleteOrder(deletingOrder.id);
        setShowConfirmDialog(false);
        setDeletingOrder(null);
      } catch (error) {
        console.error('Error deleting order:', error);
      }
    }
  };

  const handleSaveOrder = async (orderData: Omit<Order, 'id' | 'createdAt'>) => {
    try {
      if (editingOrder) {
        await updateOrder(editingOrder.id, orderData);
        setEditingOrder(null);
      }
    } catch (error) {
      console.error('Error saving order:', error);
    }
  };

  const handleCloseConfirmDialog = () => {
    setShowConfirmDialog(false);
    setDeletingOrder(null);
  };

  const handleToggleSelectAll = (checked: boolean) => {
    if (checked) {
      const merged = Array.from(new Set([...selectedIds, ...currentPageIds]));
      setSelectedIds(merged);
    } else {
      const remaining = selectedIds.filter(id => !currentPageIds.includes(id));
      setSelectedIds(remaining);
    }
  };

  const handleToggleSelectOne = (orderId: number, checked: boolean) => {
    setSelectedIds(prev => {
      if (checked) return prev.includes(orderId) ? prev : [...prev, orderId];
      return prev.filter(id => id !== orderId);
    });
  };

  const openBulkDelete = () => {
    if (selectedIds.length === 0) return;
    setShowBulkConfirmDialog(true);
  };

  const handleConfirmBulkDelete = async () => {
    try {
      const idsToDelete = [...selectedIds];
      await Promise.all(idsToDelete.map(id => deleteOrder(id)));
      setSelectedIds(prev => prev.filter(id => !idsToDelete.includes(id)));
      setShowBulkConfirmDialog(false);
    } catch (error) {
      console.error('Error bulk deleting orders:', error);
    }
  };

  return (
    <div className="min-h-full px-8 py-0" style={{ backgroundColor: '#f5f7fa' }}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-blue-500 text-white flex items-center justify-center flex-shrink-0">
            <ShoppingCart className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Quản lý Đơn hàng</h1>
            <p className="text-sm text-slate-400 mt-0.5">
              Theo dõi và quản lý hiệu suất bán hàng của bạn
            </p>
          </div>
        </div>
        <button
          onClick={() => {}}
          className="flex items-center gap-2 px-5 py-2.5 text-white text-sm font-semibold rounded-xl mt-4 sm:mt-0 transition-all duration-200"
          style={{
            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            boxShadow: '0 4px 14px rgba(59, 130, 246, 0.35)',
          }}
        >
          <Plus className="w-5 h-5" />
          Tạo đơn hàng mới
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        {/* Tổng Đơn Hàng */}
        <div className="relative overflow-hidden rounded-2xl p-4" style={{ background: 'linear-gradient(135deg, #0ea5e9, #3b82f6)', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)' }}>
          <div className="absolute top-0 right-0 w-20 h-20 rounded-full opacity-10" style={{ background: 'white', transform: 'translate(30%, -30%)' }} />
          <div className="relative flex items-start justify-between mb-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.15)' }}>
              <ShoppingCart className="w-5 h-5 text-white" strokeWidth={2} />
            </div>
            <span className="text-[10px] font-semibold px-2 py-1 rounded-full" style={{ background: 'rgba(255,255,255,0.2)', color: 'white' }}>
              +12% tháng trước
            </span>
          </div>
          <div>
            <p className="text-[40px] font-bold leading-none mb-1" style={{ color: 'white' }}>
              {stats.total.toLocaleString('vi-VN')}
            </p>
            <p className="text-[11px] font-semibold tracking-wider" style={{ color: 'rgba(255,255,255,0.7)' }}>
              TỔNG ĐƠN HÀNG
            </p>
          </div>
        </div>

        {/* Doanh Thu */}
        <div className="relative overflow-hidden rounded-2xl p-4" style={{ background: 'linear-gradient(135deg, #f59e0b, #f97316)', boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)' }}>
          <div className="absolute top-0 right-0 w-20 h-20 rounded-full opacity-10" style={{ background: 'white', transform: 'translate(30%, -30%)' }} />
          <div className="relative flex items-start justify-between mb-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.15)' }}>
              <Wallet className="w-5 h-5 text-white" strokeWidth={2} />
            </div>
            <span className="text-[10px] font-semibold px-2 py-1 rounded-full" style={{ background: 'rgba(255,255,255,0.2)', color: 'white' }}>
              Tháng này
            </span>
          </div>
          <div>
            <p className="text-[40px] font-bold leading-none mb-1" style={{ color: 'white' }}>
              {stats.revenue}
            </p>
            <p className="text-[11px] font-semibold tracking-wider" style={{ color: 'rgba(255,255,255,0.7)' }}>
              DOANH THU
            </p>
          </div>
        </div>

        {/* Đơn Hàng Mới */}
        <div className="relative overflow-hidden rounded-2xl p-4" style={{ background: 'linear-gradient(135deg, #10b981, #059669)', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)' }}>
          <div className="absolute top-0 right-0 w-20 h-20 rounded-full opacity-10" style={{ background: 'white', transform: 'translate(30%, -30%)' }} />
          <div className="relative flex items-start justify-between mb-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.15)' }}>
              <Package className="w-5 h-5 text-white" strokeWidth={2} />
            </div>
            <span className="text-[10px] font-semibold px-2 py-1 rounded-full" style={{ background: 'rgba(255,255,255,0.2)', color: 'white' }}>
              +{stats.todayCount} hôm nay
            </span>
          </div>
          <div>
            <p className="text-[40px] font-bold leading-none mb-1" style={{ color: 'white' }}>
              {stats.todayCount}
            </p>
            <p className="text-[11px] font-semibold tracking-wider" style={{ color: 'rgba(255,255,255,0.7)' }}>
              ĐƠN HÀNG MỚI
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <OrderFilters
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        onSearchChange={setSearchTerm}
        onStatusChange={setStatusFilter}
        onClearFilters={clearFilters}
      >
        <div className="flex items-center gap-2">
          <button
            onClick={fetchOrders}
            disabled={loading}
            className="flex items-center px-3 py-1.5 text-slate-500 bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-50 text-sm font-medium rounded-lg transition-colors"
          >
            <RefreshCw className={`w-4 h-4 mr-1.5 ${loading ? 'animate-spin' : ''}`} />
            Làm mới
          </button>
          <ExportOrdersButton orders={allOrders} />
        </div>
      </OrderFilters>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-400">Lỗi tải dữ liệu</h3>
              <div className="mt-2 text-sm text-red-300">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Actions */}
      {selectedIds.length > 0 && (
        <div className="flex items-center gap-3 mb-4">
          <span className="text-sm text-slate-500">
            Đã chọn <span className="font-semibold text-slate-700">{selectedIds.length}</span> đơn hàng
          </span>
          <button
            onClick={openBulkDelete}
            disabled={isDeletingOrder}
            className="flex items-center px-3 py-1.5 bg-red-50 hover:bg-red-100 disabled:bg-red-50 text-red-600 text-sm font-medium rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4 mr-1.5" />
            Xóa đã chọn
          </button>
        </div>
      )}

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
        <OrdersTable
          orders={orders}
          loading={loading}
          onEdit={handleEditOrder}
          onDelete={handleDeleteOrder}
          deletingOrder={isDeletingOrder}
          selectedIds={selectedIds}
          allSelected={allSelected}
          onToggleSelectAll={handleToggleSelectAll}
          onToggleSelectOne={handleToggleSelectOne}
          onShowToast={showToastMessage}
        />
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* Order Form Modal */}
      <OrderForm
        order={editingOrder}
        isOpen={!!editingOrder}
        onClose={() => setEditingOrder(null)}
        onSave={handleSaveOrder}
        loading={updatingOrder}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={showConfirmDialog}
        title="Xác nhận xóa đơn hàng"
        message={`Bạn có chắc chắn muốn xóa đơn hàng #${deletingOrder?.id} của ${deletingOrder?.customer_name}?`}
        confirmText="Xóa"
        cancelText="Hủy"
        onConfirm={handleConfirmDelete}
        onCancel={handleCloseConfirmDialog}
        loading={isDeletingOrder}
        type="danger"
      />

      {/* Confirm Bulk Delete Dialog */}
      <ConfirmDialog
        isOpen={showBulkConfirmDialog}
        title="Xác nhận xóa nhiều đơn hàng"
        message={`Bạn có chắc chắn muốn xóa ${selectedIds.length} đơn hàng đã chọn?`}
        confirmText="Xóa"
        cancelText="Hủy"
        onConfirm={handleConfirmBulkDelete}
        onCancel={() => setShowBulkConfirmDialog(false)}
        loading={isDeletingOrder}
        type="danger"
      />

      {/* Toast Notification */}
      {toastMessage && (
        <Toast
          message={toastMessage}
          isVisible={!!toastMessage}
          onClose={() => setToastMessage(null)}
        />
      )}
    </div>
  );
};

export default OrdersPage;
