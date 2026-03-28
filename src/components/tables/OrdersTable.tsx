import React, { useState } from 'react';
import { Edit, Trash2, Copy, Check } from 'lucide-react';
import { Order, OrderStatus } from '../../types/posts';

interface OrdersTableProps {
  orders: Order[];
  loading: boolean;
  onEdit?: (order: Order) => void;
  onDelete?: (order: Order) => void;
  deletingOrder?: boolean;
  selectedIds?: number[];
  allSelected?: boolean;
  onToggleSelectAll?: (checked: boolean) => void;
  onToggleSelectOne?: (orderId: number, checked: boolean) => void;
  onShowToast?: (message: string) => void;
}

const getStatusStyle = (status?: OrderStatus) => {
  switch (status) {
    case 'processing':
      return { bg: '#dbeafe', text: '#2563eb', dot: '#3b82f6', label: 'Đang xử lý' };
    case 'completed':
      return { bg: '#dcfce7', text: '#16a34a', dot: '#22c55e', label: 'Đã giao' };
    case 'cancelled':
      return { bg: '#fef2f2', text: '#dc2626', dot: '#ef4444', label: 'Đã hủy' };
    case 'pending':
      return { bg: '#fef3c7', text: '#d97706', dot: '#f59e0b', label: 'Đang chờ' };
    default:
      return { bg: '#f3f4f6', text: '#6b7280', dot: '#9ca3af', label: 'Không xác định' };
  }
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('vi-VN').format(value) + 'đ';
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${hours}:${minutes}, ${day}/${month}/${year}`;
};

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const getAvatarColor = (name: string) => {
  const colors = [
    { bg: '#dbeafe', text: '#2563eb' },
    { bg: '#dcfce7', text: '#16a34a' },
    { bg: '#fef3c7', text: '#d97706' },
    { bg: '#f3e8ff', text: '#7c3aed' },
    { bg: '#fce7f3', text: '#db2777' },
    { bg: '#e0f2fe', text: '#0284c7' },
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
};

const OrdersTable: React.FC<OrdersTableProps> = ({
  orders,
  loading,
  onEdit,
  onDelete,
  deletingOrder = false,
  selectedIds = [],
  allSelected = false,
  onToggleSelectAll,
  onToggleSelectOne,
  onShowToast,
}) => {
  const [copiedOrderId, setCopiedOrderId] = useState<number | null>(null);

  const copyOrderInfo = async (order: Order) => {
    const textToCopy = `${order.customer_name}\t${order.phone}\t${order.address}`;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopiedOrderId(order.id);
      setTimeout(() => setCopiedOrderId(null), 2000);
      if (onShowToast) onShowToast('Đã copy thông tin đơn hàng');
    } catch {
      if (onShowToast) onShowToast('Không thể copy dữ liệu');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="animate-spin rounded-full h-10 w-10 border-3 border-blue-500 border-t-transparent" />
        <span className="ml-4 text-slate-400">Đang tải đơn hàng...</span>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-slate-700 mb-1">Chưa có đơn hàng nào</h3>
        <p className="text-sm text-slate-400">Đơn hàng sẽ được hiển thị ở đây</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-100">
            {onToggleSelectAll && (
              <th className="px-4 py-4 w-12">
                <button
                  onClick={() => onToggleSelectAll(!allSelected)}
                  className={`w-[18px] h-[18px] rounded-[5px] flex items-center justify-center transition-all duration-200 cursor-pointer ${
                    allSelected
                      ? 'bg-[#007AFF] border-2 border-[#007AFF]'
                      : 'bg-white border-2 border-slate-300 hover:border-[#007AFF]'
                  }`}
                >
                  {allSelected && (
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </button>
              </th>
            )}
            <th className="px-4 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Mã đơn
            </th>
            <th className="px-4 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Khách hàng
            </th>
            <th className="px-4 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
              SĐT
            </th>
            <th className="px-4 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Địa chỉ
            </th>
            <th className="px-4 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Ghi chú
            </th>
            <th className="px-4 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Sản phẩm
            </th>
            <th className="px-3 py-4 text-center text-xs font-semibold text-slate-400 uppercase tracking-wider w-16">
              SL
            </th>
            <th className="px-4 py-4 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Đơn giá
            </th>
            <th className="px-4 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Ngày đặt
            </th>
            <th className="px-4 py-4 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Tổng tiền
            </th>
            <th className="px-4 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Trạng thái
            </th>
            <th className="px-4 py-4 text-center text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Thao tác
            </th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => {
            const status = getStatusStyle(order.status);
            const qty = order.quality || 1;
            const unitPrice = order.price || 0;
            const total = order.total_price || unitPrice * qty;
            const avatarColor = order.avatar_customer
              ? { bg: 'transparent', text: 'transparent' }
              : getAvatarColor(order.customer_name);
            const orderCode = `#ORD-${order.id}`;

            return (
              <tr
                key={order.id}
                className={`border-b border-slate-50 hover:bg-slate-50/50 transition-colors ${
                  selectedIds.includes(order.id) ? 'bg-blue-50' : ''
                }`}
              >
                {onToggleSelectOne && (
                  <td className="px-4 py-4">
                    <button
                      onClick={() => onToggleSelectOne(order.id, !selectedIds.includes(order.id))}
                      className={`w-[18px] h-[18px] rounded-[5px] flex items-center justify-center transition-all duration-200 cursor-pointer ${
                        selectedIds.includes(order.id)
                          ? 'bg-[#007AFF] border-2 border-[#007AFF]'
                          : 'bg-white border-2 border-slate-300 hover:border-[#007AFF]'
                      }`}
                    >
                      {selectedIds.includes(order.id) && (
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                          <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </button>
                  </td>
                )}

                {/* Mã đơn */}
                <td className="px-4 py-4">
                  <span className="text-sm font-semibold text-blue-500 cursor-pointer hover:text-blue-600">
                    {orderCode}
                  </span>
                </td>

                {/* Khách hàng */}
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    {order.avatar_customer ? (
                      <img
                        src={order.avatar_customer}
                        alt={order.customer_name}
                        className="w-8 h-8 rounded-full flex-shrink-0 object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                    ) : null}
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${order.avatar_customer ? 'hidden' : ''}`}
                      style={{ backgroundColor: avatarColor.bg, color: avatarColor.text }}
                    >
                      {getInitials(order.customer_name)}
                    </div>
                    <span className="text-sm font-medium text-slate-700">
                      {order.customer_name}
                    </span>
                  </div>
                </td>

                {/* SĐT */}
                <td className="px-4 py-4">
                  <span className="text-sm text-slate-600">
                    {order.phone || '-'}
                  </span>
                </td>

                {/* Địa chỉ */}
                <td className="px-4 py-4">
                  <span className="text-sm text-slate-500 max-w-[180px] truncate block" title={order.address}>
                    {order.address || '-'}
                  </span>
                </td>

                {/* Ghi chú */}
                <td className="px-4 py-4">
                  <span className="text-sm text-slate-500 max-w-[180px] truncate block" title={order.note}>
                    {order.note || '-'}
                  </span>
                </td>

                {/* Sản phẩm */}
                <td className="px-4 py-4">
                  <span className="text-sm text-slate-600 max-w-[200px] truncate block" title={order.product_name}>
                    {order.product_name}
                  </span>
                </td>

                {/* Số lượng */}
                <td className="px-3 py-4 text-center">
                  <span className="text-sm font-semibold text-slate-700">
                    {qty}
                  </span>
                </td>

                {/* Đơn giá */}
                <td className="px-4 py-4 text-right">
                  <span className="text-sm text-slate-600">
                    {unitPrice > 0 ? formatCurrency(unitPrice) : '-'}
                  </span>
                </td>

                {/* Ngày đặt */}
                <td className="px-4 py-4">
                  <span className="text-sm text-slate-500">
                    {formatDate(order.createdAt)}
                  </span>
                </td>

                {/* Tổng tiền */}
                <td className="px-4 py-4 text-right">
                  <span className="text-sm font-bold text-slate-800">
                    {total > 0 ? formatCurrency(total) : '-'}
                  </span>
                </td>

                {/* Trạng thái */}
                <td className="px-4 py-4">
                  <span
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
                    style={{ backgroundColor: status.bg, color: status.text }}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: status.dot }}
                    />
                    {status.label}
                  </span>
                </td>

                {/* Thao tác */}
                <td className="px-4 py-4">
                  <div className="flex items-center justify-center gap-1">
                    <button
                      onClick={() => copyOrderInfo(order)}
                      className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Copy thông tin"
                    >
                      {copiedOrderId === order.id ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4 text-blue-400" />
                      )}
                    </button>
                    {onEdit && (
                      <button
                        onClick={() => onEdit(order)}
                        className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Chỉnh sửa"
                      >
                        <Edit className="w-4 h-4 text-blue-500" />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(order)}
                        disabled={deletingOrder}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                        title="Xóa"
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
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
  );
};

export default OrdersTable;
