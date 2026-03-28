import { useState, useEffect } from 'react';
import { Province, District, Ward } from '../types/posts';

const API_BASE_URL = 'https://provinces.open-api.vn/api/v1';

export const useAddress = () => {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch danh sách tỉnh/thành phố
  const fetchProvinces = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/p/`);
      if (!response.ok) {
        throw new Error('Không thể tải danh sách tỉnh/thành phố');
      }
      const data = await response.json();
      setProvinces(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  // Fetch danh sách quận/huyện theo tỉnh
  const fetchDistricts = async (provinceCode: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/p/${provinceCode}?depth=2`);
      if (!response.ok) {
        throw new Error('Không thể tải danh sách quận/huyện');
      }
      const data = await response.json();
      setDistricts(data.districts || []);
      setWards([]); // Reset wards khi chọn tỉnh mới
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  // Fetch danh sách phường/xã theo quận/huyện
  const fetchWards = async (districtCode: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/d/${districtCode}?depth=2`);
      if (!response.ok) {
        throw new Error('Không thể tải danh sách phường/xã');
      }
      const data = await response.json();
      setWards(data.wards || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  // Reset districts và wards
  const resetDistricts = () => {
    setDistricts([]);
    setWards([]);
  };

  const resetWards = () => {
    setWards([]);
  };

  // Load provinces khi component mount
  useEffect(() => {
    fetchProvinces();
  }, []);

  return {
    provinces,
    districts,
    wards,
    loading,
    error,
    fetchDistricts,
    fetchWards,
    resetDistricts,
    resetWards,
  };
};
