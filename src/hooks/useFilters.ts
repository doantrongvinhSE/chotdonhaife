import { useState, useMemo } from 'react';
import { RunningPost } from '../types/posts';

export function useFilters(items: RunningPost[]) {
  const [searchTitle, setSearchTitle] = useState('');

  const [sortBy, setSortBy] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const filteredAndSortedItems = useMemo(() => {
    const filtered = items.filter((item) => {
      const matchesTitle = item.title.toLowerCase().includes(searchTitle.toLowerCase());
      return matchesTitle;
    });

    if (sortBy) {
      filtered.sort((a, b) => {
        let aVal: string | number, bVal: string | number;
        switch (sortBy) {
          case 'title':
            aVal = a.title.toLowerCase();
            bVal = b.title.toLowerCase();
            break;

          case 'commentCount':
            aVal = a.commentCountToday || 0;
            bVal = b.commentCountToday || 0;
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
  }, [items, searchTitle, sortBy, sortOrder]);

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
    setSortBy('');
  };

  return {
    searchTitle,
    setSearchTitle,
    filteredAndSortedItems,
    handleSort,
    clearFilters,
  };
}
