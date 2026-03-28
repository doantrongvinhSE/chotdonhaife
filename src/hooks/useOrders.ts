import { useState, useEffect, useMemo } from 'react';
import { Order, OrdersResponse } from '../types/posts';
import { API_ENDPOINTS } from '../config/api';

export function useOrders(showToastMessage?: (message: string) => void) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [addingOrder, setAddingOrder] = useState(false);
  const [updatingOrder, setUpdatingOrder] = useState(false);
  const [deletingOrder, setDeletingOrder] = useState(false);
  const itemsPerPage = 10;

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_ENDPOINTS.ORDERS);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result: OrdersResponse = await response.json();
      
      if (result.success && result.data) {
        // Sort by createdAt descending (newest first)
        const sortedOrders = result.data.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        
        setOrders(sortedOrders);
        setTotalItems(sortedOrders.length);
        setTotalPages(Math.ceil(sortedOrders.length / itemsPerPage));
        setCurrentPage(1);
        setError(null);
      } else {
        throw new Error('Dữ liệu không hợp lệ');
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Không thể tải dữ liệu đơn hàng từ server');
      setOrders([]);
      setTotalItems(0);
      setTotalPages(1);
      setCurrentPage(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Filter orders based on search term
  const filteredOrders = useMemo(() => {
    if (!searchTerm.trim()) return orders;
    
    const term = searchTerm.toLowerCase();
    return orders.filter(order => 
      order.customer_name.toLowerCase().includes(term) ||
      order.product_name.toLowerCase().includes(term) ||
      order.phone.includes(term) ||
      order.address.toLowerCase().includes(term) ||
      (order.note && order.note.toLowerCase().includes(term))
    );
  }, [orders, searchTerm]);

  // Get paginated orders
  const getPaginatedOrders = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredOrders.slice(startIndex, endIndex);
  };

  // Update pagination when filtered results change
  useEffect(() => {
    setTotalItems(filteredOrders.length);
    setTotalPages(Math.ceil(filteredOrders.length / itemsPerPage));
    setCurrentPage(1);
  }, [filteredOrders.length, itemsPerPage]);

  const addOrder = async (orderData: Omit<Order, 'id' | 'createdAt'>) => {
    try {
      setAddingOrder(true);
      const response = await fetch(API_ENDPOINTS.ORDERS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success && result.data) {
        const newOrder = result.data;
        setOrders(prev => [newOrder, ...prev]);
        
        if (showToastMessage) {
          showToastMessage('Đã thêm đơn hàng thành công!');
        }
      } else {
        throw new Error(result.message || 'Thêm đơn hàng thất bại');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      if (showToastMessage) {
        showToastMessage('Không thể thêm đơn hàng. Vui lòng thử lại.');
      }
      throw error;
    } finally {
      setAddingOrder(false);
    }
  };

  const updateOrder = async (id: number, orderData: Omit<Order, 'id' | 'createdAt'>) => {
    try {
      setUpdatingOrder(true);
      const response = await fetch(`${API_ENDPOINTS.ORDERS}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success && result.data) {
        const updatedOrder = result.data;
        setOrders(prev => 
          prev.map(order => order.id === id ? updatedOrder : order)
        );
        
        if (showToastMessage) {
          showToastMessage('Đã cập nhật đơn hàng thành công!');
        }
      } else {
        throw new Error(result.message || 'Cập nhật đơn hàng thất bại');
      }
    } catch (error) {
      console.error('Error updating order:', error);
      if (showToastMessage) {
        showToastMessage('Không thể cập nhật đơn hàng. Vui lòng thử lại.');
      }
      throw error;
    } finally {
      setUpdatingOrder(false);
    }
  };

  const deleteOrder = async (id: number) => {
    try {
      setDeletingOrder(true);
      const response = await fetch(`${API_ENDPOINTS.ORDERS}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        setOrders(prev => prev.filter(order => order.id !== id));
        if (showToastMessage) {
          showToastMessage('Đã xóa đơn hàng thành công!');
        }
      } else {
        throw new Error('Xóa đơn hàng thất bại');
      }
    } catch (error) {
      console.error('Error deleting order:', error);
      if (showToastMessage) {
        showToastMessage('Không thể xóa đơn hàng. Vui lòng thử lại.');
      }
      throw error;
    } finally {
      setDeletingOrder(false);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
  };

  return {
    orders: getPaginatedOrders(),
    allOrders: orders,
    filteredOrders,
    loading,
    error,
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    searchTerm,
    addingOrder,
    updatingOrder,
    deletingOrder,
    setCurrentPage,
    setSearchTerm,
    fetchOrders,
    addOrder,
    updateOrder,
    deleteOrder,
    clearFilters,
  };
}
