import { useState, useMemo, useEffect } from 'react';
import { FileText, Trash2, MessageSquare, X, Search } from 'lucide-react';
import { Comment, RunningPost, CommentStatus } from '../types/posts';
import { usePosts } from '../hooks/usePosts';
import { useOrders } from '../hooks/useOrders';
import { useFilters } from '../hooks/useFilters';
import { PostForm } from '../components/forms/PostForm';
import { BulkAddModal } from '../components/forms/BulkAddModal';
import { PostsTable } from '../components/tables/PostsTable';
import { Toast, ToastType } from '../components/ui/Toast';
import { Pagination } from '../components/ui/Pagination';
import { ExportButton } from '../components/ui/ExportButton';
import { EditPostModal } from '../components/forms/EditPostModal';
import CreateOrderModal from '../components/forms/CreateOrderModal';
import CommentsTable from '../components/tables/CommentsTable';
import { API_ENDPOINTS } from '../config/api';

export default function PostsPage() {
  const {
    allItems,
    loading,
    error,
    addingPost,
    addingBulk,
    bulkProgress,
    currentPage,
    itemsPerPage,
    addPost,
    addBulkPosts,
    updatePost,
    toggleSelectAll,
    toggleSelectOne,
    deletePost,
    deleteSelectedPosts,
    setCurrentPage,
  } = usePosts(showToastMessage);

  const {
    searchTitle,
    setSearchTitle,
    filteredAndSortedItems,
    handleSort,
  } = useFilters(allItems);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTitle, setCurrentPage]);

  const [selectAll, setSelectAll] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingPost, setEditingPost] = useState<typeof allItems[0] | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<ToastType>('success');
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentsError, setCommentsError] = useState<string | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentsPage, setCommentsPage] = useState(1);
  const commentsPerPage = 10;
  const [currentPostTitle, setCurrentPostTitle] = useState<string>('');
  const [showCreateOrderModal, setShowCreateOrderModal] = useState(false);
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null);

  const { addOrder, addingOrder } = useOrders(showToastMessage);

  function showToastMessage(message: string, type: ToastType = 'success') {
    setToastType(type);
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  }

  type ApiComment = {
    id: string;
    uid: string;
    fb_name: string;
    avatar_user?: string | null;
    content: string;
    phone: string | null;
    timestamp: string;
    status: 'normal' | 'fail' | 'success' | 'isCalling';
    id_post: string;
  };

  async function openCommentsForPost(feedback: string, postTitle: string) {
    try {
      setCommentsLoading(true);
      setCommentsError(null);
      setComments([]);
      setCommentsPage(1);
      setCurrentPostTitle(postTitle);
      const resp = await fetch(`${API_ENDPOINTS.POSTS}/comments/${feedback}`);
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const json = await resp.json();
      const data: ApiComment[] = json?.data ?? [];
      const mapped: Comment[] = data.map((c) => ({
        id: c.id,
        uid: c.uid,
        fb_name: c.fb_name,
        avatar_user: c.avatar_user ?? null,
        content: c.content,
        phone: c.phone ?? null,
        timestamp: c.timestamp,
        status: c.status,
        id_post: c.id_post,
        post: {
          id: 0,
          name: postTitle,
          link: '',
        },
      }))
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setComments(mapped);
      setShowCommentsModal(true);
    } catch (e) {
      console.error(e);
      setCommentsError('Không thể tải comment.');
      setShowCommentsModal(true);
    } finally {
      setCommentsLoading(false);
    }
  }

  async function handleAddPost(post: Omit<typeof allItems[0], 'id'>) {
    await addPost(post);
  }

  function handleCreateOrder(comment: Comment) {
    setSelectedComment(comment);
    setShowCreateOrderModal(true);
  }

  function handleCloseCreateOrderModal() {
    setShowCreateOrderModal(false);
    setSelectedComment(null);
  }

  async function handleSubmitOrder(orderData: {
    product_name: string;
    customer_name: string;
    phone: string;
    address: string;
    addressDetail?: import('../types/posts').AddressDetail;
    note: string;
    price: number;
    quality: number;
    total_price: number;
  }) {
    try {
      const { addressDetail, ...orderPayload } = orderData;
      await addOrder({ ...orderPayload, status: 'pending' as const });
      handleCloseCreateOrderModal();
    } catch {
      // lỗi đã xử lý trong hook useOrders
    }
  }

  async function handleCommentStatusChange(commentId: string, status: CommentStatus) {
    try {
      const response = await fetch(`${API_ENDPOINTS.COMMENTS}/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: commentId,
          status: status
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const result = await response.json();

      if (result.success && result.data) {
        setComments(prevComments =>
          prevComments.map(comment =>
            comment.id === commentId
              ? { ...comment, status: result.data.status }
              : comment
          )
        );
        showToastMessage('Cập nhật trạng thái thành công', 'success');
      } else {
        throw new Error(result.message || 'Cập nhật thất bại');
      }
    } catch (error) {
      showToastMessage(`Lỗi cập nhật trạng thái: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
    }
  }

  async function handleBulkAdd(posts: Array<{ url: string; title: string }>) {
    const newPosts = posts.map(post => ({
      ...post,
      commentCountToday: 0,
      lastCommentAt: null,
    }));
    await addBulkPosts(newPosts);
  }

  function handleEditPost(post: typeof allItems[0]) {
    setEditingPost(post);
    setShowEditModal(true);
  }

  async function handleUpdatePost(id: number, data: { name: string; link: string }) {
    await updatePost(id, data);
    setShowEditModal(false);
    setEditingPost(null);
  }

  function handleToggleSelectAll() {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    toggleSelectAll(newSelectAll);
  }

  function handlePageChange(page: number) {
    setCurrentPage(page);
  }

  const getPaginatedFilteredItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredAndSortedItems.slice(startIndex, endIndex);
  };

  // Stats
  const stats = useMemo(() => {
    const total = allItems.length;
    const todayComments = allItems.reduce((sum, p) => sum + (p.commentCountToday || 0), 0);
    const postsWithCommentToday = allItems.filter(p => (p.commentCountToday || 0) > 0).length;
    return { total, todayComments, postsWithCommentToday };
  }, [allItems]);

  const selectedCount = filteredAndSortedItems.filter(item => item.selected).length;

  return (
    <div className="min-h-full px-8 py-0" style={{ backgroundColor: '#f5f7fa' }}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 pt-0">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-[14px] flex items-center justify-center flex-shrink-0 shadow-md" style={{ background: 'linear-gradient(135deg, #007AFF, #5856D6)' }}>
            <FileText className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-[22px] font-semibold text-slate-800 tracking-tight">Quản lý Bài Viết</h1>
            <p className="text-sm text-slate-400 mt-0.5 font-medium">
              Theo dõi và quản lý các bài viết đang chạy
            </p>
          </div>
        </div>

      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        {/* Total Posts */}
        <div className="relative overflow-hidden rounded-2xl p-4" style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)', boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)' }}>
          <div className="absolute top-0 right-0 w-20 h-20 rounded-full opacity-10" style={{ background: 'white', transform: 'translate(30%, -30%)' }} />
          <div className="relative flex items-start justify-between mb-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.15)' }}>
              <FileText className="w-5 h-5 text-white" strokeWidth={2} />
            </div>
            <span className="text-[10px] font-semibold px-2 py-1 rounded-full" style={{ background: 'rgba(255,255,255,0.2)', color: 'white' }}>
              +12% tháng trước
            </span>
          </div>
          <div>
            <p className="text-[38px] font-bold leading-none mb-1" style={{ color: 'white' }}>
              {loading ? '...' : stats.total.toLocaleString('vi-VN')}
            </p>
            <p className="text-[11px] font-semibold tracking-wider" style={{ color: 'rgba(255,255,255,0.7)' }}>
              TỔNG BÀI VIẾT
            </p>
          </div>
        </div>

        {/* Comment Hôm Nay */}
        <div className="relative overflow-hidden rounded-2xl p-4" style={{ background: 'linear-gradient(135deg, #ec4899, #9333ea)', boxShadow: '0 4px 12px rgba(236, 72, 153, 0.3)' }}>
          <div className="absolute top-0 right-0 w-20 h-20 rounded-full opacity-10" style={{ background: 'white', transform: 'translate(30%, -30%)' }} />
          <div className="relative flex items-start justify-between mb-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.15)' }}>
              <MessageSquare className="w-5 h-5 text-white" strokeWidth={2} />
            </div>
            <span className="text-[10px] font-semibold px-2 py-1 rounded-full" style={{ background: 'rgba(255,255,255,0.2)', color: 'white' }}>
              Kỷ lục mới!
            </span>
          </div>
          <div>
            <p className="text-[38px] font-bold leading-none mb-1" style={{ color: 'white' }}>
              {loading ? '...' : stats.todayComments.toLocaleString('vi-VN')}
            </p>
            <p className="text-[11px] font-semibold tracking-wider" style={{ color: 'rgba(255,255,255,0.7)' }}>
              COMMENT HÔM NAY
            </p>
          </div>
        </div>

        {/* Bài có Comment */}
        <div className="relative overflow-hidden rounded-2xl p-4" style={{ background: 'linear-gradient(135deg, #0d9488, #0ea5e9)', boxShadow: '0 4px 12px rgba(13, 148, 136, 0.3)' }}>
          <div className="absolute top-0 right-0 w-20 h-20 rounded-full opacity-10" style={{ background: 'white', transform: 'translate(30%, -30%)' }} />
          <div className="relative flex items-start justify-between mb-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.15)' }}>
              <MessageSquare className="w-5 h-5 text-white" strokeWidth={2} />
            </div>
            <span className="text-[10px] font-semibold px-2 py-1 rounded-full" style={{ background: 'rgba(255,255,255,0.2)', color: 'white' }}>
              +8% hôm nay
            </span>
          </div>
          <div>
            <p className="text-[38px] font-bold leading-none mb-1" style={{ color: 'white' }}>
              {loading ? '...' : stats.postsWithCommentToday.toLocaleString('vi-VN')}
            </p>
            <p className="text-[11px] font-semibold tracking-wider" style={{ color: 'rgba(255,255,255,0.7)' }}>
              BÀI CÓ COMMENT
            </p>
          </div>
        </div>
      </div>

      {/* PostForm */}
      <div className="mb-6">
        <PostForm
          onSubmit={handleAddPost}
          onBulkClick={() => setShowBulkModal(true)}
          addingPost={addingPost}
          addingBulk={addingBulk}
          bulkProgress={bulkProgress}
        />
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 mb-4">
        <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-[15px] h-[15px] text-slate-400" strokeWidth={2} />
            <input
              type="text"
              value={searchTitle}
              onChange={(e) => setSearchTitle(e.target.value)}
              placeholder="Tìm kiếm tiêu đề bài viết..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
            />
            {searchTitle && (
              <button
                onClick={() => setSearchTitle('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-4 h-4" strokeWidth={2.5} />
              </button>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {selectedCount > 0 && (
              <button
                onClick={deleteSelectedPosts}
                className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-sm font-medium rounded-xl transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Xóa {selectedCount} bài viết
              </button>
            )}
            <ExportButton items={filteredAndSortedItems} />
          </div>
        </div>
      </div>

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
              <h3 className="text-sm font-medium text-red-800">Lỗi tải dữ liệu</h3>
              <p className="mt-1 text-sm text-red-600">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-slate-500">
          {loading ? 'Đang tải...' : `Hiển thị ${getPaginatedFilteredItems().length} / ${filteredAndSortedItems.length} bài viết`}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
        <PostsTable
          items={getPaginatedFilteredItems()}
          selectAll={selectAll}
          onToggleSelectAll={handleToggleSelectAll}
          onToggleSelectOne={toggleSelectOne}
          onDeletePost={deletePost}
          onEditPost={handleEditPost}
          onSort={handleSort}
          onClickTodayComments={(post: RunningPost) => {
            openCommentsForPost(String(post.id), post.title);
          }}
        />
      </div>

      {/* Pagination */}
      <div className="mt-6">
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(filteredAndSortedItems.length / itemsPerPage)}
          onPageChange={handlePageChange}
          totalItems={filteredAndSortedItems.length}
          itemsPerPage={itemsPerPage}
        />
      </div>

      {/* Modals */}
      <BulkAddModal
        isOpen={showBulkModal}
        onClose={() => setShowBulkModal(false)}
        onSubmit={handleBulkAdd}
      />

      <EditPostModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingPost(null);
        }}
        onSubmit={handleUpdatePost}
        post={editingPost as { id: number; title: string; url: string } | null}
      />

      <Toast
        message={toastMessage}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
        type={toastType}
      />

      {/* Comments Modal */}
      {showCommentsModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl border border-slate-100 w-full max-w-[1200px] max-h-[90vh] overflow-hidden shadow-xl flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-xl bg-blue-500/10 border border-blue-200 flex items-center justify-center">
                  <MessageSquare className="w-4 h-4 text-blue-500" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-slate-700">Comment của bài viết</h2>
                  <p className="text-xs text-slate-400 truncate max-w-md" title={currentPostTitle}>
                    {currentPostTitle}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {!commentsLoading && comments.length > 0 && (
                  <span className="text-xs text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
                    {comments.length} comments
                  </span>
                )}
                <button
                  onClick={() => setShowCommentsModal(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-medium transition-colors"
                >
                  Đóng
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-4">
              {(() => {
                const totalCmts = comments.length;
                const totalPg = Math.ceil(totalCmts / commentsPerPage) || 1;
                const startIdx = (commentsPage - 1) * commentsPerPage;
                const paginatedComments = comments.slice(startIdx, startIdx + commentsPerPage);
                return (
                  <CommentsTable
                    comments={paginatedComments}
                    loading={commentsLoading}
                    error={commentsError}
                    currentPage={commentsPage}
                    totalPages={totalPg}
                    totalItems={totalCmts}
                    itemsPerPage={commentsPerPage}
                    onStatusChange={handleCommentStatusChange}
                    onPageChange={(p) => setCommentsPage(p)}
                    onCreateOrder={handleCreateOrder}
                    compact
                    onShowToast={showToastMessage}
                  />
                );
              })()}
            </div>
          </div>
        </div>
      )}

      <CreateOrderModal
        isOpen={showCreateOrderModal}
        onClose={handleCloseCreateOrderModal}
        comment={selectedComment}
        onSubmit={handleSubmitOrder}
        loading={addingOrder}
      />
    </div>
  );
}
