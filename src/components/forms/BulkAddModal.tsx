import React, { useState } from 'react';
import { X, Plus, Upload } from 'lucide-react';

type BulkAddModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (posts: Array<{ url: string; title: string }>) => void;
};

export function BulkAddModal({ isOpen, onClose, onSubmit }: BulkAddModalProps) {
  const [bulkText, setBulkText] = useState('');
  const [errors, setErrors] = useState<string[]>([]);

  const lineCount = bulkText.trim().split('\n').filter(line => line.trim()).length;

  function handleSubmit() {
    const lines = bulkText.trim().split('\n').filter(line => line.trim());
    const newErrors: string[] = [];
    const newPosts: Array<{ url: string; title: string }> = [];

    lines.forEach((line, index) => {
      const parts = line.split('|');
      if (parts.length !== 2) {
        newErrors.push(`Dòng ${index + 1}: Format không đúng. Cần "link|tiêu đề"`);
        return;
      }

      const [url, title] = parts.map(part => part.trim());
      
      if (!url) {
        newErrors.push(`Dòng ${index + 1}: Link không được để trống`);
        return;
      }
      
      if (!title) {
        newErrors.push(`Dòng ${index + 1}: Tiêu đề không được để trống`);
        return;
      }

      try {
        const parsed = new URL(url);
        if (!['http:', 'https:'].includes(parsed.protocol)) {
          newErrors.push(`Dòng ${index + 1}: Link không hợp lệ (chỉ hỗ trợ http/https)`);
          return;
        }
      } catch {
        newErrors.push(`Dòng ${index + 1}: Link không hợp lệ`);
        return;
      }

      newPosts.push({ url, title });
    });

    setErrors(newErrors);
    
    if (newErrors.length === 0) {
      onSubmit(newPosts);
      setBulkText('');
      onClose();
    }
  }

  function handleClose() {
    setBulkText('');
    setErrors([]);
    onClose();
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-[2px]">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(59, 130, 246, 0.1)' }}>
              <Upload className="w-4 h-4" style={{ color: '#3b82f6' }} strokeWidth={2} />
            </div>
            <div>
              <h3 className="text-[15px] font-semibold text-slate-800">Thêm hàng loạt</h3>
              <p className="text-[11px] text-slate-400">Nhập nhiều bài viết cùng lúc</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" strokeWidth={2} />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-5">
          <div className="mb-3">
            <label className="block text-[12px] font-semibold text-slate-500 mb-2">
              Nhập danh sách bài viết
            </label>
            <p className="text-[11px] text-slate-400 mb-3">
              Format: <code className="bg-slate-100 px-1.5 py-0.5 rounded text-[#3b82f6] font-semibold">link|tiêu đề</code>
            </p>
            <textarea
              value={bulkText}
              onChange={(e) => setBulkText(e.target.value)}
              placeholder={"https://facebook.com/post1|Bài viết số 1\nhttps://facebook.com/post2|Bài viết số 2\nhttps://facebook.com/post3|Bài viết số 3"}
              className="w-full h-36 px-3 py-3 rounded-xl bg-slate-50 border border-slate-200 text-[13px] text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/20 focus:border-[#3b82f6] transition-all resize-none font-mono leading-relaxed"
            />
          </div>

          {errors.length > 0 && (
            <div className="mb-3 p-3 rounded-xl bg-red-50 border border-red-100">
              <h4 className="text-[12px] font-semibold text-red-500 mb-1.5">Lỗi:</h4>
              <ul className="text-[11px] text-red-400 space-y-0.5 max-h-24 overflow-y-auto">
                {errors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          )}

          {lineCount > 0 && (
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[11px] font-medium px-2.5 py-1 rounded-full" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
                {lineCount} bài viết
              </span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-5 pb-5">
          <button
            onClick={handleClose}
            className="flex-1 px-4 py-2.5 text-[13px] font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            disabled={lineCount === 0}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-white text-[13px] font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
            style={{
              background: lineCount > 0 ? 'linear-gradient(135deg, #3b82f6, #2563eb)' : '#94a3b8',
              boxShadow: lineCount > 0 ? '0 4px 12px rgba(59, 130, 246, 0.35)' : 'none',
            }}
          >
            <Plus className="w-4 h-4" strokeWidth={2.5} />
            Thêm {lineCount > 0 ? lineCount : ''} bài viết
          </button>
        </div>
      </div>
    </div>
  );
}
