import React, { useState, useEffect } from 'react';
import { ChevronDown, MapPin } from 'lucide-react';
import { useAddress } from '../../hooks/useAddress';
import { Province, District, Ward, AddressDetail } from '../../types/posts';
import { Combobox } from '@headlessui/react';

interface AddressSelectorProps {
  value: AddressDetail;
  onChange: (address: AddressDetail) => void;
  error?: string;
  className?: string;
  placeholder?: string;
}

const AddressSelector: React.FC<AddressSelectorProps> = ({
  value,
  onChange,
  error,
  className = '',
  placeholder = 'Chọn địa chỉ'
}) => {
  const {
    provinces,
    districts,
    wards,
    loading,
    error: apiError,
    fetchDistricts,
    fetchWards,
    resetDistricts,
    resetWards,
  } = useAddress();

  const [selectedProvince, setSelectedProvince] = useState<Province | null>(value.province);
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(value.district);
  const [selectedWard, setSelectedWard] = useState<Ward | null>(value.ward);
  const [street, setStreet] = useState(value.street || '');
  const [provinceSearch, setProvinceSearch] = useState('');
  const [districtSearch, setDistrictSearch] = useState('');
  const [wardSearch, setWardSearch] = useState('');

  // Update local state when value prop changes
  useEffect(() => {
    setSelectedProvince(value.province);
    setSelectedDistrict(value.district);
    setSelectedWard(value.ward);
    setStreet(value.street || '');
  }, [value]);

  // Handle province selection
  const handleProvinceSelect = async (province: Province) => {
    setSelectedProvince(province);
    setSelectedDistrict(null);
    setSelectedWard(null);
    resetDistricts();
    resetWards();
    
    if (province.code) {
      await fetchDistricts(province.code);
    }
    
    updateAddress({
      province,
      district: null,
      ward: null,
      street,
      fullAddress: buildFullAddress(province, null, null, street)
    });
  };

  // Handle district selection
  const handleDistrictSelect = async (district: District) => {
    setSelectedDistrict(district);
    setSelectedWard(null);
    resetWards();
    
    if (district.code) {
      await fetchWards(district.code);
    }
    
    updateAddress({
      province: selectedProvince,
      district,
      ward: null,
      street,
      fullAddress: buildFullAddress(selectedProvince, district, null, street)
    });
  };

  // Handle ward selection
  const handleWardSelect = (ward: Ward) => {
    setSelectedWard(ward);
    updateAddress({
      province: selectedProvince,
      district: selectedDistrict,
      ward,
      street,
      fullAddress: buildFullAddress(selectedProvince, selectedDistrict, ward, street)
    });
  };

  // Handle street input change
  const handleStreetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStreet = e.target.value;
    setStreet(newStreet);
    updateAddress({
      province: selectedProvince,
      district: selectedDistrict,
      ward: selectedWard,
      street: newStreet,
      fullAddress: buildFullAddress(selectedProvince, selectedDistrict, selectedWard, newStreet)
    });
  };

  // Build full address string
  const buildFullAddress = (province: Province | null, district: District | null, ward: Ward | null, street: string) => {
    const parts = [];
    if (street) parts.push(street);
    if (ward) parts.push(ward.name);
    if (district) parts.push(district.name);
    if (province) parts.push(province.name);
    return parts.join(', ');
  };

  // Update parent component
  const updateAddress = (newAddress: AddressDetail) => {
    onChange(newAddress);
  };

  const displayText = value.fullAddress || placeholder;

  // Lọc danh sách theo từ khóa tìm kiếm
  const filteredProvinces = provinces.filter(p => p.name.toLowerCase().includes(provinceSearch.toLowerCase()));
  const filteredDistricts = districts.filter(d => d.name.toLowerCase().includes(districtSearch.toLowerCase()));
  const filteredWards = wards.filter(w => w.name.toLowerCase().includes(wardSearch.toLowerCase()));

  return (
    <div className={`relative ${className}`}>
      <div className="space-y-4">
        {/* Street input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Số nhà, tên đường
          </label>
          <input
            type="text"
            value={street}
            onChange={handleStreetChange}
            placeholder="Nhập số nhà, tên đường"
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400"
          />
        </div>

        {/* Address selectors - each full width */}
        <div className="space-y-4">
          {/* Province selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tỉnh/Thành phố *
            </label>
            <Combobox value={selectedProvince} onChange={async (province) => {
                await handleProvinceSelect(province);
                setProvinceSearch('');
              }} disabled={loading}>
              <div className="relative">
                <Combobox.Input
                  className="w-full px-4 py-3 bg-white border rounded-xl text-gray-900 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  displayValue={(prov: Province|null) => prov ? prov.name : ''}
                  placeholder="Chọn tỉnh/thành phố"
                  onChange={e => setProvinceSearch(e.target.value)}
                  autoComplete="off"
                />
                <Combobox.Button className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer">
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                </Combobox.Button>
                <Combobox.Options className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                  {loading ? (
                    <div className="px-4 py-3 text-center text-gray-500">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500 mx-auto" />
                      <span className="ml-2">Đang tải...</span>
                    </div>
                  ) : filteredProvinces.length === 0 ? (
                    <div className="px-4 py-2 text-gray-500">Không tìm thấy</div>
                  ) : filteredProvinces.map(province => (
                    <Combobox.Option
                      key={province.code}
                      value={province}
                      className={({ active }) =>
                        `w-full px-4 py-3 text-left ${active ? 'bg-blue-50' : ''}`
                      }
                    >
                      {province.name}
                    </Combobox.Option>
                  ))}
                </Combobox.Options>
              </div>
            </Combobox>
          </div>

          {/* District selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quận/Huyện *
            </label>
            <Combobox value={selectedDistrict} onChange={async (d) => {
                await handleDistrictSelect(d);
                setDistrictSearch('');
              }}
              disabled={!selectedProvince || loading || districts.length === 0}>
              <div className="relative">
                <Combobox.Input
                  className="w-full px-4 py-3 bg-white border rounded-xl text-gray-900 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  displayValue={(d: District|null) => d ? d.name : ''}
                  placeholder="Chọn quận/huyện"
                  onChange={e => setDistrictSearch(e.target.value)}
                  autoComplete="off"
                />
                <Combobox.Button className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer">
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                </Combobox.Button>
                <Combobox.Options className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                  {loading ? (
                    <div className="px-4 py-3 text-center text-gray-500">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-500 mx-auto" />
                      <span className="ml-2">Đang tải...</span>
                    </div>
                  ) : filteredDistricts.length === 0 ? (
                    <div className="px-4 py-2 text-gray-500">Không tìm thấy</div>
                  ) : filteredDistricts.map(district => (
                    <Combobox.Option
                      key={district.code}
                      value={district}
                      className={({ active }) =>
                        `w-full px-4 py-3 text-left ${active ? 'bg-green-100' : ''}`
                      }
                    >
                      {district.name}
                    </Combobox.Option>
                  ))}
                </Combobox.Options>
              </div>
            </Combobox>
          </div>

          {/* Ward selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phường/Xã *
            </label>
            <Combobox value={selectedWard} onChange={(w) => {
                handleWardSelect(w);
                setWardSearch('');
              }} disabled={!selectedDistrict || loading || wards.length === 0}>
              <div className="relative">
                <Combobox.Input
                  className="w-full px-4 py-3 bg-white border rounded-xl text-gray-900 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  displayValue={(w: Ward|null) => w ? w.name : ''}
                  placeholder="Chọn phường/xã"
                  onChange={e => setWardSearch(e.target.value)}
                  autoComplete="off"
                />
                <Combobox.Button className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer">
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                </Combobox.Button>
                <Combobox.Options className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                  {loading ? (
                    <div className="px-4 py-3 text-center text-gray-500">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-500 mx-auto" />
                      <span className="ml-2">Đang tải...</span>
                    </div>
                  ) : filteredWards.length === 0 ? (
                    <div className="px-4 py-2 text-gray-500">Không tìm thấy</div>
                  ) : filteredWards.map(ward => (
                    <Combobox.Option
                      key={ward.code}
                      value={ward}
                      className={({ active }) =>
                        `w-full px-4 py-3 text-left ${active ? 'bg-green-100' : ''}`
                      }
                    >
                      {ward.name}
                    </Combobox.Option>
                  ))}
                </Combobox.Options>
              </div>
            </Combobox>
          </div>
        </div>

        {/* Full address display */}
        {value.fullAddress && (
          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-start space-x-2">
              <MapPin className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-700">Địa chỉ đầy đủ:</p>
                <p className="text-sm text-gray-600">{value.fullAddress}</p>
              </div>
            </div>
          </div>
        )}

        {/* Error messages */}
        {error && (
          <p className="mt-1 text-sm text-red-500">{error}</p>
        )}
        
        {apiError && (
          <p className="mt-1 text-sm text-red-500">{apiError}</p>
        )}
      </div>
    </div>
  );
};

export default AddressSelector;
