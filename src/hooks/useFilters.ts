import { useState, useMemo } from 'react';
import { RunningPost } from '../types/posts';

export function useFilters(items: RunningPost[]) {
  const [searchTitle, setSearchTitle] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const filteredAndSortedItems = useMemo(() => {
    const filtered = items.filter((item) => {
      const matchesTitle = item.title.toLowerCase().includes(searchTitle.toLowerCase());
      const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
      return matchesTitle && matchesStatus;
    });

    if (sortBy) {
      filtered.sort((a, b) => {
        let aVal: string | number, bVal: string | number;
        switch (sortBy) {
          case 'title':
            aVal = a.title.toLowerCase();
            bVal = b.title.toLowerCase();
            break;
          case 'status':
            aVal = a.status;
            bVal = b.status;
            break;
          case 'commentCount':
            aVal = a.commentCountToday;
            bVal = b.commentCountToday;
            break;
          case 'lastComment':
            aVal = a.lastCommentAt?.getTime() || 0;
            bVal = b.lastCommentAt?.getTime() || 0;
            break;
          default:
            return 0;
        }
        if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return filtered;
  }, [items, searchTitle, filterStatus, sortBy, sortOrder]);

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const clearFilters = () => {
    setSearchTitle('');
    setFilterStatus('all');
    setSortBy('');
  };

  return {
    searchTitle,
    setSearchTitle,
    filterStatus,
    setFilterStatus,
    filteredAndSortedItems,
    handleSort,
    clearFilters,
  };
}
