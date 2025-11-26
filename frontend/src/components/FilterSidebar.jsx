import React, { useState, useEffect } from 'react';
import productService from '../services/productService';

const FilterSidebar = ({ 
  filters = {}, 
  onFiltersChange, 
  isOpen = true, 
  onToggle,
  className = '' 
}) => {
  const [availableColors, setAvailableColors] = useState([]);
  const [availableSizes, setAvailableSizes] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });

  const categories = productService.getCategories();
  const seasons = productService.getSeasons();

  useEffect(() => {
    loadFilterOptions();
  }, []);

  const loadFilterOptions = async () => {
    try {
      const [colors, sizes] = await Promise.all([
        productService.getAvailableColors(),
        productService.getAvailableSizes()
      ]);
      setAvailableColors(colors);
      setAvailableSizes(sizes);
    } catch (error) {
      console.error('خطا در بارگذاری گزینه‌های فیلتر:', error);
    }
  };

  const handleFilterChange = (filterType, value, checked = null) => {
    const newFilters = { ...filters };

    if (filterType === 'category' || filterType === 'season') {
      // فیلترهای تک انتخابی
      newFilters[filterType] = newFilters[filterType] === value ? '' : value;
    } else if (filterType === 'colors' || filterType === 'sizes') {
      // فیلترهای چند انتخابی
      if (!newFilters[filterType]) {
        newFilters[filterType] = [];
      }
      
      if (checked) {
        if (!newFilters[filterType].includes(value)) {
          newFilters[filterType] = [...newFilters[filterType], value];
        }
      } else {
        newFilters[filterType] = newFilters[filterType].filter(item => item !== value);
      }
    } else if (filterType === 'price') {
      newFilters.min_price = value.min;
      newFilters.max_price = value.max;
    }

    onFiltersChange(newFilters);
  };

  const handlePriceChange = (type, value) => {
    const newPriceRange = { ...priceRange, [type]: value };
    setPriceRange(newPriceRange);
    
    // اعمال فیلتر قیمت با تاخیر
    clearTimeout(window.priceFilterTimeout);
    window.priceFilterTimeout = setTimeout(() => {
      handleFilterChange('price', newPriceRange);
    }, 500);
  };

  const clearAllFilters = () => {
    setPriceRange({ min: '', max: '' });
    onFiltersChange({});
  };

  const hasActiveFilters = () => {
    return Object.keys(filters).some(key => {
      const value = filters[key];
      if (Array.isArray(value)) {
        return value.length > 0;
      }
      return value !== '' && value !== null && value !== undefined;
    });
  };

  return (
    <div className={`bg-white rounded-lg shadow-md ${className}`}>
      {/* هدر */}
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="text-lg font-semibold text-gray-900">فیلترها</h3>
        <div className="flex items-center space-x-2 space-x-reverse">
          {hasActiveFilters() && (
            <button
              onClick={clearAllFilters}
              className="text-sm text-red-600 hover:text-red-700 transition-colors"
            >
              پاک کردن همه
            </button>
          )}
          {onToggle && (
            <button
              onClick={onToggle}
              className="lg:hidden p-1 text-gray-500 hover:text-gray-700"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* محتوای فیلترها */}
      <div className={`${isOpen ? 'block' : 'hidden lg:block'}`}>
        <div className="p-4 space-y-6">
          {/* فیلتر دسته‌بندی */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">دسته‌بندی</h4>
            <div className="space-y-2">
              {categories.map(category => (
                <label key={category.value} className="flex items-center">
                  <input
                    type="radio"
                    name="category"
                    value={category.value}
                    checked={filters.category === category.value}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="ml-2 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{category.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* فیلتر فصل */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">فصل</h4>
            <div className="space-y-2">
              {seasons.map(season => (
                <label key={season.value} className="flex items-center">
                  <input
                    type="radio"
                    name="season"
                    value={season.value}
                    checked={filters.season === season.value}
                    onChange={(e) => handleFilterChange('season', e.target.value)}
                    className="ml-2 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{season.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* فیلتر رنگ */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">رنگ</h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {availableColors.map(color => (
                <label key={color.value || color} className="flex items-center">
                  <input
                    type="checkbox"
                    value={color.value || color}
                    checked={filters.colors?.includes(color.value || color) || false}
                    onChange={(e) => handleFilterChange('colors', color.value || color, e.target.checked)}
                    className="ml-2 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{color.label || color}</span>
                </label>
              ))}
            </div>
          </div>

          {/* فیلتر سایز */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">سایز</h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {availableSizes.map(size => (
                <label key={size.value || size} className="flex items-center">
                  <input
                    type="checkbox"
                    value={size.value || size}
                    checked={filters.sizes?.includes(size.value || size) || false}
                    onChange={(e) => handleFilterChange('sizes', size.value || size, e.target.checked)}
                    className="ml-2 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{size.label || size}</span>
                </label>
              ))}
            </div>
          </div>

          {/* فیلتر قیمت */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">محدوده قیمت (تومان)</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">حداقل قیمت</label>
                <input
                  type="number"
                  placeholder="0"
                  value={priceRange.min}
                  onChange={(e) => handlePriceChange('min', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">حداکثر قیمت</label>
                <input
                  type="number"
                  placeholder="1000000"
                  value={priceRange.max}
                  onChange={(e) => handlePriceChange('max', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* فیلتر موجودی */}
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filters.in_stock || false}
                onChange={(e) => handleFilterChange('in_stock', e.target.checked)}
                className="ml-2 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">فقط کالاهای موجود</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;