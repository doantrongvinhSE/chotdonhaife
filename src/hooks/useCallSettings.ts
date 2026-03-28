import { useState, useEffect } from 'react';
import { removeVietnameseAccents } from '../utils/textUtils';

const STORAGE_KEY_SELECTED = 'selectedCaller';
const DEFAULT_CALLERS = ['Hải', 'Hằng', 'Hoa', 'Hương', 'Hà', 'Linh', 'Thu', 'Liên'];

const useCallSettings = () => {
  const [callers] = useState<string[]>(DEFAULT_CALLERS);
  const [selectedCaller, setSelectedCaller] = useState<string>('');
  const [loading, setLoading] = useState(true);

  // Load người gọi đã chọn từ localStorage khi component mount
  useEffect(() => {
    try {
      const storedSelected = localStorage.getItem(STORAGE_KEY_SELECTED);
      if (storedSelected) {
        setSelectedCaller(storedSelected);
      }
    } catch (error) {
      console.error('Error loading call settings:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Lưu người gọi đã chọn vào localStorage (key là tên viết thường không dấu)
  const saveSelectedCaller = (callerName: string) => {
    try {
      const key = removeVietnameseAccents(callerName);
      localStorage.setItem(STORAGE_KEY_SELECTED, key);
      setSelectedCaller(key);
      return true;
    } catch (error) {
      console.error('Error saving selected caller:', error);
      return false;
    }
  };

  // Lấy người gọi đã chọn (trả về tên gốc từ danh sách)
  const getSelectedCallerName = (): string => {
    if (!selectedCaller) return '';
    // Tìm tên gốc trong danh sách callers
    return callers.find(caller => removeVietnameseAccents(caller) === selectedCaller) || '';
  };

  return {
    callers,
    selectedCaller: getSelectedCallerName(),
    loading,
    saveSelectedCaller,
  };
};

export default useCallSettings;

