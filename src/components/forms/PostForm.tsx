import React, { useState } from 'react';
import { Plus, Import, Link } from 'lucide-react';
import { RunningPost } from '../../types/posts';

type PostFormProps = {
  onSubmit: (post: Omit<RunningPost, 'id'>) => void;
  onBulkClick: () => void;
  addingPost: boolean;
  addingBulk: boolean;
  bulkProgress: { current: number; total: number };
};

export function PostForm({ onSubmit, onBulkClick, addingPost, addingBulk, bulkProgress }: PostFormProps) {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [errors, setErrors] = useState<{ url?: string; title?: string }>({});

  function validate() {
    const newErrors: { url?: string; title?: string } = {};
    if (!url.trim()) {
      newErrors.url = 'Vui lòng nhập link bài viết';
    } else {
      try {
        const parsed = new URL(url.trim());
        if (!['http:', 'https:'].includes(parsed.protocol)) {
          newErrors.url = 'Link không hợp lệ (chỉ hỗ trợ http/https)';
        }
      } catch {
        newErrors.url = 'Link không hợp lệ';
      }
    }
    if (!title.trim()) {
      newErrors.title = 'Vui lòng nhập tên bài viết';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      url: url.trim(),
      title: title.trim(),
      isVisible: true,
      commentCountToday: 0,
      lastCommentAt: null,
      status: 'Đang chạy',
    });
    setUrl('');
    setTitle('');
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
      {/* Card Header */}
      <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
        <div className="h-8 w-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(16, 185, 129, 0.1)' }}>
          <Plus className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-slate-700">Tạo bài viết mới</h3>
          <p className="text-xs text-slate-400">Thêm bài viết Facebook để bắt đầu theo dõi comment</p>
        </div>
      </div>

      {/* Form Body */}
      <div className="p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* URL Field */}
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-slate-500 mb-1.5" htmlFor="postUrl">
                Link bài viết
              </label>
              <div className="relative">
                <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  id="postUrl"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://www.facebook.com/..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                  type="url"
                  inputMode="url"
                />
              </div>
              {errors.url ? (
                <p className="text-xs text-red-500 mt-1.5">{errors.url}</p>
              ) : (
                <p className="text-xs text-slate-400 mt-1.5">Nhập URL bài viết Facebook</p>
              )}
            </div>

            {/* Title Field */}
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5" htmlFor="postTitle">
                Tên bài viết
              </label>
              <input
                id="postTitle"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Nhập tiêu đề..."
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                type="text"
              />
              {errors.title ? (
                <p className="text-xs text-red-500 mt-1.5">{errors.title}</p>
              ) : (
                <p className="text-xs text-slate-400 mt-1.5">Tên hiển thị trong danh sách</p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 mt-5">
            <button
              type="button"
              onClick={onBulkClick}
              disabled={addingPost || addingBulk}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)',
                color: 'white',
              }}
            >
              {addingBulk ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Đang thêm {bulkProgress.current}/{bulkProgress.total}...
                </>
              ) : (
                <>
                  <Import className="w-4 h-4" />
                  Thêm hàng loạt
                </>
              )}
            </button>
            <button
              type="submit"
              disabled={addingPost || addingBulk}
              className="flex items-center gap-2 px-5 py-2.5 text-white text-sm font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                boxShadow: '0 4px 14px rgba(59, 130, 246, 0.35)',
              }}
            >
              {addingPost ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Đang thêm...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Thêm bài viết
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
