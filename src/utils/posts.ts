import { ApiPost, RunningPost } from '../types/posts';

export function generateId(): string {
  return Math.random().toString(36).slice(2, 10);
}

export function formatRelativeTime(from: Date | null): string {
  if (!from) return 'Chưa có comment nào';
  const diffMs = Date.now() - from.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return 'Vừa xong';
  if (diffMin < 60) return `${diffMin} phút trước`;
  const hours = Math.floor(diffMin / 60);
  if (hours < 24) return `${hours} giờ trước`;
  const days = Math.floor(hours / 24);
  return `${days} ngày trước`;
}

export function formatDateTime(date: Date | null): string {
  if (!date) return '—';
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${hours}:${minutes}, ${day}-${month}-${year}`;
}

export function mapApiPostToRunningPost(apiPost: ApiPost): RunningPost {
  return {
    id: apiPost.id,
    url: apiPost.link,
    title: apiPost.name,
    commentTotalCount: apiPost.total_count, 
    commentCountToday: apiPost.count_today,
    lastCommentAt: new Date(apiPost.updated_at),
  };
}
