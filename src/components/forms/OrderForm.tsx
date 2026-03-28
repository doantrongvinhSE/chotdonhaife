import React, { useState, useEffect } from 'react';
import { Order } from '../../types/posts';
import {
  X, ShoppingCart, User, Truck, Package, Receipt,
  Trash2, Minus, Plus, Pencil, Lightbulb, ShieldCheck,
  MessageCircle, CheckCircle2, Edit3
} from 'lucide-react';
import AddressSelector, { AddressDetail } from '../ui/AddressSelector';

interface ProductItem {
  id: string;
  name: string;
  code: string;
  image?: string;
  quantity: number;
  price: number;
}

interface OrderFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (orderData: {
    product_name: string;
    customer_name: string;
    phone: string;
    address: string;
    avatar_customer?: string;
    note: string;
    price: number;
    quality: number;
    total_price: number;
    status?: string;
  }) => Promise<void>;
  order?: Order | null;
  loading?: boolean;
}

const OrderForm: React.FC<OrderFormProps> = ({
  isOpen,
  onClose,
  onSave,
  order,
  loading = false,
}) => {
  const [formData, setFormData] = useState({
    product_name: '',
    customer_name: '',
    phone: '',
    address: '',
    note: '',
    status: 'pending',
    avatar_customer: '',
  });

  const [addressDetail, setAddressDetail] = useState<AddressDetail>({
    province: null,
    district: null,
    ward: null,
    street: '',
    fullAddress: '',
  });

  const [products, setProducts] = useState<ProductItem[]>([
    {
      id: '1',
      name: '',
      code: '',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&q=80',
      quantity: 1,
      price: 0,
    },
  ]);

  const [shippingFee, setShippingFee] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [editingShipping, setEditingShipping] = useState(false);
  const [shippingInput, setShippingInput] = useState('0');
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [priceInput, setPriceInput] = useState('');

  const subtotal = products.reduce((sum, p) => sum + p.price * p.quantity, 0);
  const total = subtotal + shippingFee - discount;

  const isEditMode = !!order;

  // Reset or populate form when order changes
  useEffect(() => {
    if (isOpen) {
      if (order) {
        // Edit mode - populate with order data
        setFormData({
          product_name: order.product_name || '',
          customer_name: order.customer_name || '',
          phone: order.phone || '',
          address: order.address || '',
          note: order.note || '',
          status: order.status || 'pending',
          avatar_customer: order.avatar_customer || '',
        });
        setAddressDetail({ province: null, district: null, ward: null, street: '', fullAddress: '' });
        setProducts([{
          id: '1',
          name: order.product_name || '',
          code: '',
          image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&q=80',
          quantity: order.quality || 1,
          price: order.price || 0,
        }]);
      } else {
        // Create mode - reset form
        setFormData({
          product_name: '',
          customer_name: '',
          phone: '',
          address: '',
          note: '',
          status: 'pending',
          avatar_customer: '',
        });
        setAddressDetail({ province: null, district: null, ward: null, street: '', fullAddress: '' });
        setProducts([{
          id: '1',
          name: '',
          code: '',
          image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&q=80',
          quantity: 1,
          price: 0,
        }]);
        setShippingFee(0);
        setDiscount(0);
      }
    }
  }, [order, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const addressToUse = addressDetail.fullAddress || formData.address;
      const product = products[0];
      const quality = product.quantity;
      const price = product.price;
      const total_price = price * quality + shippingFee;
      await onSave({
        product_name: product.name || formData.product_name,
        customer_name: formData.customer_name,
        phone: formData.phone,
        address: addressToUse,
        avatar_customer: formData.avatar_customer || undefined,
        note: formData.note,
        price: price,
        quality: quality,
        total_price: total_price,
        status: formData.status,
      });
    } catch {
      // Error handled in parent
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const updateQuantity = (id: string, delta: number) => {
    setProducts(prev =>
      prev.map(p =>
        p.id === id ? { ...p, quantity: Math.max(1, p.quantity + delta) } : p
      )
    );
  };

  const removeProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const startEditPrice = (product: ProductItem) => {
    setEditingPriceId(product.id);
    setPriceInput(new Intl.NumberFormat('vi-VN').format(product.price));
  };

  const handlePriceChange = (value: string) => {
    const raw = value.replace(/[^\d]/g, '');
    setPriceInput(new Intl.NumberFormat('vi-VN').format(parseInt(raw) || 0));
  };

  const savePrice = (id: string) => {
    const num = parseInt(priceInput.replace(/[^\d]/g, '')) || 0;
    setProducts(prev => prev.map(p => p.id === id ? { ...p, price: num } : p));
    setEditingPriceId(null);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
  };

  const parseShippingFee = (value: string) => {
    const num = parseInt(value.replace(/[^\d]/g, '')) || 0;
    setShippingFee(num);
    setShippingInput(new Intl.NumberFormat('vi-VN').format(num));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fadeIn"
        onClick={onClose}
      />

      {/* Slide-in Panel from right */}
      <div
        className="relative ml-auto h-full bg-white shadow-2xl flex flex-col animate-slideInRight overflow-hidden"
        style={{ width: '100%', maxWidth: '1200px' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-slate-100 flex-shrink-0">
          <div className="flex items-center gap-4">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
              }}
            >
              {isEditMode ? <Edit3 className="w-5 h-5 text-white" /> : <ShoppingCart className="w-5 h-5 text-white" />}
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">
                {isEditMode ? `Chỉnh sửa Đơn hàng #${order?.id}` : 'Tạo Đơn Hàng Mới'}
              </h2>
              <p className="text-sm text-slate-400">
                {isEditMode ? 'Cập nhật thông tin đơn hàng' : 'Vui lòng điền đầy đủ thông tin'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-500 border border-slate-200 rounded-xl hover:bg-slate-50 hover:text-slate-700 transition-all duration-200"
          >
            <X className="w-4 h-4" />
            Đóng
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 pb-4">
          {/* Main Grid: Left (Customer + Products) | Right (Address + Summary) */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

            {/* === LEFT: Khách hàng + Sản phẩm stacked === */}
            <div className="lg:col-span-3 flex flex-col gap-4">

              {/* Khách hàng */}
              <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
                <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-50">
                  <User className="w-5 h-5 text-blue-500" />
                  <h3 className="text-sm font-semibold text-slate-700">Khách hàng</h3>
                </div>
                <div className="p-5 space-y-4">
                  {/* Tên sản phẩm */}
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-2">
                      Tên sản phẩm
                    </label>
                    <input
                      type="text"
                      name="product_name"
                      value={formData.product_name}
                      onChange={handleChange}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                      placeholder="Nhập tên sản phẩm..."
                    />
                  </div>

                  {/* Tên khách hàng */}
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-2">
                      Tên khách hàng
                    </label>
                    <input
                      type="text"
                      name="customer_name"
                      value={formData.customer_name}
                      onChange={handleChange}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                      placeholder="Nhập tên khách hàng..."
                    />
                  </div>

                  {/* Số điện thoại */}
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-2">
                      Số điện thoại
                    </label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                      placeholder="Nhập số điện thoại..."
                    />
                  </div>

                  {/* Ghi chú */}
                  <div>
                    <label className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-2">
                      <MessageCircle className="w-3.5 h-3.5" />
                      Ghi chú
                    </label>
                    <textarea
                      name="note"
                      value={formData.note}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-300 resize-none outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                      placeholder="Nhập ghi chú..."
                    />
                  </div>

                  {/* Trạng thái (chỉ hiển thị khi edit) */}
                  {isEditMode && (
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-2">
                        Trạng thái
                      </label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                      >
                        <option value="pending">Đang xử lý</option>
                        <option value="processing">Đang giao hàng</option>
                        <option value="completed">Hoàn thành</option>
                        <option value="cancelled">Đã hủy</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>

              {/* Danh sách sản phẩm */}
              <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-50">
                  <div className="flex items-center gap-2">
                    <Package className="w-5 h-5 text-blue-500" />
                    <h3 className="text-sm font-semibold text-slate-700">Danh sách sản phẩm</h3>
                  </div>
                  <button
                    type="button"
                    className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    + Thêm sản phẩm
                  </button>
                </div>
                <div className="p-4 space-y-2">
                  <div className="grid grid-cols-12 gap-3 px-3 text-[10px] font-semibold text-slate-400 uppercase tracking-wide">
                    <div className="col-span-5">Sản phẩm</div>
                    <div className="col-span-2 text-center">SL</div>
                    <div className="col-span-2 text-right">Đơn giá</div>
                    <div className="col-span-2 text-right">T.Tiền</div>
                    <div className="col-span-1"></div>
                  </div>

                  {products.map(product => (
                    <div key={product.id} className="flex items-center gap-3 p-3 bg-slate-50/80 rounded-xl">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-10 h-10 rounded-lg object-cover flex-shrink-0 bg-slate-200"
                      />
                      <div className="flex-1 min-w-0">
                        <input
                          type="text"
                          value={product.name}
                          onChange={(e) => setProducts(prev => prev.map(p => p.id === product.id ? { ...p, name: e.target.value } : p))}
                          className="w-full px-2 py-1 text-xs font-semibold text-slate-800 bg-white border border-slate-200 rounded-lg outline-none focus:border-blue-400"
                          placeholder="Tên sản phẩm..."
                        />
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => updateQuantity(product.id, -1)}
                          className="w-6 h-6 rounded-md bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-100 transition-colors"
                        >
                          <Minus className="w-3 h-3 text-slate-500" />
                        </button>
                        <span className="w-8 text-center text-xs font-bold text-slate-700">
                          {String(product.quantity).padStart(2, '0')}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(product.id, 1)}
                          className="w-6 h-6 rounded-md bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-100 transition-colors"
                        >
                          <Plus className="w-3 h-3 text-slate-500" />
                        </button>
                      </div>

                      <div className="w-[90px] text-right">
                        {editingPriceId === product.id ? (
                          <input
                            autoFocus
                            value={priceInput}
                            onChange={(e) => handlePriceChange(e.target.value)}
                            onBlur={() => savePrice(product.id)}
                            onKeyDown={(e) => e.key === 'Enter' && savePrice(product.id)}
                            className="w-full px-1.5 py-1 text-xs font-medium text-right text-slate-700 border border-blue-400 rounded-md outline-none bg-white"
                          />
                        ) : (
                          <button
                            type="button"
                            onClick={() => startEditPrice(product)}
                            className="text-xs font-medium text-slate-600 hover:text-blue-600 transition-colors cursor-pointer"
                          >
                            {formatPrice(product.price)}
                          </button>
                        )}
                      </div>

                      <div className="w-[90px] text-right">
                        <span className="text-xs font-bold text-blue-600">{formatPrice(product.price * product.quantity)}</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeProduct(product.id)}
                        className="p-1 text-slate-400 hover:text-red-500 transition-colors rounded-md hover:bg-red-50"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* === RIGHT: Địa chỉ + Summary stacked === */}
            <div className="lg:col-span-2 flex flex-col gap-4">

              {/* Địa chỉ giao hàng */}
              <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
                <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-50">
                  <Truck className="w-5 h-5 text-blue-500" />
                  <h3 className="text-sm font-semibold text-slate-700">Địa chỉ giao hàng</h3>
                </div>
                <div className="p-5 space-y-3">
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-2">
                      Tỉnh / Thành phố
                    </label>
                    <AddressSelector
                      value={addressDetail}
                      onChange={setAddressDetail}
                      placeholder="Chọn tỉnh/thành phố..."
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-2">
                      Địa chỉ chi tiết
                    </label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={handleChange}
                      name="address"
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-300 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                      placeholder="Số nhà, tên đường..."
                    />
                  </div>
                </div>
              </div>

              {/* Thông tin thanh toán */}
              <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
                <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-50">
                  <Receipt className="w-5 h-5 text-blue-500" />
                  <h3 className="text-sm font-semibold text-slate-700">Thông tin thanh toán</h3>
                </div>
                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">Tạm tính</span>
                    <span className="text-sm font-semibold text-slate-700">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">Phí vận chuyển</span>
                    <div className="flex items-center gap-2">
                      {editingShipping ? (
                        <input
                          autoFocus
                          value={shippingInput}
                          onChange={(e) => parseShippingFee(e.target.value)}
                          onBlur={() => setEditingShipping(false)}
                          onKeyDown={(e) => e.key === 'Enter' && setEditingShipping(false)}
                          className="w-32 px-2 py-1 text-sm text-right font-medium text-slate-700 border border-blue-400 rounded-lg outline-none bg-white"
                        />
                      ) : (
                        <span className="text-sm font-semibold text-slate-700">{formatPrice(shippingFee)}</span>
                      )}
                      <button
                        type="button"
                        onClick={() => setEditingShipping(true)}
                        className="p-1 text-slate-400 hover:text-blue-500 transition-colors"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  {discount > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-500">Giảm giá</span>
                      <span className="text-sm font-semibold text-orange-500">- {formatPrice(discount)}</span>
                    </div>
                  )}

                  <div className="h-px bg-slate-100" />

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-base font-bold text-slate-800">Tổng thanh toán</span>
                    <div className="text-right">
                      <p className="text-2xl font-bold" style={{ color: '#2563eb' }}>{formatPrice(total)}</p>
                      <p className="text-[11px] text-slate-400 font-medium">Đã bao gồm VAT</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tip */}
              <div
                className="flex items-start gap-3 p-4 rounded-xl border"
                style={{ background: '#eff6ff', borderColor: '#bfdbfe' }}
              >
                <Lightbulb className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-blue-700 leading-relaxed">
                  {isEditMode
                    ? 'Thay đổi thông tin đơn hàng và nhấn xác nhận để cập nhật.'
                    : 'Đơn hàng sẽ tự động gửi thông báo xác nhận qua tin nhắn cho khách hàng ngay sau khi tạo.'}
                </p>
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex-shrink-0 px-8 py-5 border-t border-slate-100 bg-white">
          <button
            type="button"
            disabled={loading}
            onClick={handleSubmit}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-white font-bold text-sm transition-all duration-200"
            style={{
              background: loading
                ? '#93c5fd'
                : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              boxShadow: loading ? 'none' : '0 4px 14px rgba(59, 130, 246, 0.35)'
            }}
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/40 rounded-full animate-spin" style={{ borderTopColor: 'white' }} />
                <span>{isEditMode ? 'Đang cập nhật...' : 'Đang tạo đơn hàng...'}</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5" />
                {isEditMode ? 'XÁC NHẬN CẬP NHẬT ĐƠN HÀNG' : 'XÁC NHẬN TẠO ĐƠN HÀNG'}
              </>
            )}
          </button>
          <div className="flex items-center justify-center gap-2 mt-2.5">
            <ShieldCheck className="w-4 h-4" style={{ color: '#22c55e' }} />
            <span className="text-xs font-medium" style={{ color: '#22c55e' }}>Giao dịch an toàn & bảo mật</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderForm;
