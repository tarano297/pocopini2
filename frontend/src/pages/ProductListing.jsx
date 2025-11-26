import React, { useState, useEffect } from 'react';
import { ProductCard, FilterSidebar, LoadingSpinner, ErrorMessage } from '../components';
import productService from '../services/productService';
import { utils } from '../utils';
import { useDebounce } from '../hooks/useDebounce';

const ProductListing = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({});
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Debounce search term to avoid excessive API calls
  const debouncedFilters = useDebounce(filters, 500);

  // دریافت فیلترهای اولیه از URL
  useEffect(() => {
    const urlParams = utils.getQueryParams();
    const initialFilters = {};
    
    if (urlParams.category) initialFilters.category = urlParams.category;
    if (urlParams.season) initialFilters.season = urlParams.season;
    if (urlParams.search) initialFilters.search = urlParams.search;
    if (urlParams.color) initialFilters.colors = [urlParams.color];
    if (urlParams.size) initialFilters.sizes = [urlParams.size];
    
    setFilters(initialFilters);
  }, []);

  useEffect(() => {
    loadProducts();
  }, [debouncedFilters, sortBy, currentPage]);

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      const params = {
        ...debouncedFilters,
        ordering: getSortParam(sortBy),
        page: currentPage,
        page_size: 12
      };

      const response = await productService.getProducts(params);
      
      setProducts(response.results || response);
      setTotalPages(Math.ceil((response.count || response.length) / 12));
      setTotalCount(response.count || response.length);
    } catch (err) {
      setError(err.message || 'خطا در بارگذاری محصولات');
    } finally {
      setIsLoading(false);
    }
  };

  const getSortParam = (sortBy) => {
    switch (sortBy) {
      case 'newest': return '-created_at';
      case 'oldest': return 'created_at';
      case 'price_low': return 'price';
      case 'price_high': return '-price';
      case 'name': return 'name';
      default: return '-created_at';
    }
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
    
    // به‌روزرسانی URL
    const params = new URLSearchParams();
    Object.keys(newFilters).forEach(key => {
      const value = newFilters[key];
      if (Array.isArray(value) && value.length > 0) {
        value.forEach(v => params.append(key, v));
      } else if (value && !Array.isArray(value)) {
        params.set(key, value);
      }
    });
    
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.pushState({}, '', newUrl);
  };

  const handleSortChange = (newSort) => {
    setSortBy(newSort);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    utils.scrollToTop();
  };

  const getCategoryTitle = () => {
    if (filters.category) {
      const categories = { baby: 'نوزاد', girl: 'دخترانه', boy: 'پسرانه' };
      return categories[filters.category];
    }
    if (filters.search) {
      return `نتایج جستجو برای "${filters.search}"`;
    }
    return 'همه محصولات';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {getCategoryTitle()}
          </h1>
          <p className="text-gray-600">
            {totalCount > 0 ? `${totalCount} محصول یافت شد` : 'محصولی یافت نشد'}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - فیلترها */}
          <div className="lg:w-1/4">
            <div className="lg:hidden mb-4">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="w-full bg-white border border-gray-300 rounded-md px-4 py-2 flex items-center justify-between"
              >
                <span>فیلترها</span>
                <svg className={`w-5 h-5 transform transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
            
            <FilterSidebar
              filters={filters}
              onFiltersChange={handleFiltersChange}
              isOpen={isFilterOpen}
              onToggle={() => setIsFilterOpen(!isFilterOpen)}
              className="sticky top-4"
            />
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            {/* Sort and View Options */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center space-x-4 space-x-reverse">
                  <span className="text-sm text-gray-700">مرتب‌سازی:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="newest">جدیدترین</option>
                    <option value="oldest">قدیمی‌ترین</option>
                    <option value="price_low">ارزان‌ترین</option>
                    <option value="price_high">گران‌ترین</option>
                    <option value="name">نام محصول</option>
                  </select>
                </div>
                
                <div className="text-sm text-gray-600">
                  صفحه {currentPage} از {totalPages}
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {isLoading ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner size="large" />
              </div>
            ) : error ? (
              <ErrorMessage 
                error={error} 
                onRetry={loadProducts}
                className="max-w-md mx-auto"
              />
            ) : products.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {products.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center">
                    <nav className="flex items-center space-x-2 space-x-reverse">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        قبلی
                      </button>
                      
                      {[...Array(totalPages)].map((_, index) => {
                        const page = index + 1;
                        const isCurrentPage = page === currentPage;
                        
                        // نمایش صفحات نزدیک به صفحه فعلی
                        if (
                          page === 1 || 
                          page === totalPages || 
                          (page >= currentPage - 2 && page <= currentPage + 2)
                        ) {
                          return (
                            <button
                              key={page}
                              onClick={() => handlePageChange(page)}
                              className={`px-3 py-2 text-sm font-medium rounded-md ${
                                isCurrentPage
                                  ? 'bg-blue-600 text-white'
                                  : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                              }`}
                            >
                              {page}
                            </button>
                          );
                        } else if (
                          page === currentPage - 3 || 
                          page === currentPage + 3
                        ) {
                          return (
                            <span key={page} className="px-2 py-2 text-gray-500">
                              ...
                            </span>
                          );
                        }
                        return null;
                      })}
                      
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        بعدی
                      </button>
                    </nav>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  محصولی یافت نشد
                </h3>
                <p className="text-gray-600 mb-4">
                  با فیلترهای انتخابی شما محصولی موجود نیست
                </p>
                <button
                  onClick={() => handleFiltersChange({})}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  پاک کردن فیلترها
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductListing;