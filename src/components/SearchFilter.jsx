import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useCategories from '../hooks/useCategories';

export default function SearchFilter({ 
  onSearchChange,
  onCategoryChange,
  onSortChange,
  activeCategory
}) {
  const { categories, loading } = useCategories();
  const [searchTerm, setSearchTerm] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  // Debounced search
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    // Note: Use a debounce hook/util in production, simplified here
    if (window.searchTimeout) clearTimeout(window.searchTimeout);
    window.searchTimeout = setTimeout(() => onSearchChange(value), 400);
  };

  return (
    <div className="bg-white sticky top-16 lg:top-20 z-40 border-b border-surface-200 shadow-sm mb-10 overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="flex flex-col gap-5">
          {/* Main Search Bar */}
          <div className="relative">
            <motion.div
              animate={{
                boxShadow: isFocused 
                  ? '0 0 0 4px rgba(220, 38, 38, 0.15)' 
                  : '0 0 0 0px rgba(0,0,0,0)'
              }}
              className="relative flex items-center bg-surface-50 border border-surface-200 rounded-2xl overflow-hidden transition-colors hover:border-surface-300"
            >
              <div className="ps-5 text-primary-600">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearch}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="ابحث عن منتج بالاسم أو الوصف..."
                className="w-full bg-transparent py-4 px-4 text-surface-900 font-medium placeholder-surface-400 focus:outline-none"
              />
              <AnimatePresence>
                {searchTerm && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    onClick={() => {
                      setSearchTerm('');
                      onSearchChange('');
                    }}
                    className="pe-5 text-surface-400 hover:text-red-500 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </motion.button>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Category Pills */}
            <div className="flex-1 overflow-x-auto custom-scrollbar pb-2 sm:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0 scroll-smooth">
              <div className="flex inline-flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onCategoryChange('')}
                  className={`whitespace-nowrap px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${
                    !activeCategory
                      ? 'bg-primary-600 text-white shadow-md shadow-primary-600/30'
                      : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
                  }`}
                >
                  الكل
                </motion.button>
                {!loading && categories.map((cat) => (
                  <motion.button
                    key={cat.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onCategoryChange(cat.id)}
                    className={`whitespace-nowrap px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${
                      activeCategory === cat.id
                        ? 'bg-primary-600 text-white shadow-md shadow-primary-600/30'
                        : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
                    }`}
                  >
                    {cat.name}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-3 bg-surface-50 border border-surface-200 rounded-xl px-4 py-2 hover:border-surface-300 transition-colors shrink-0">
              <svg className="w-5 h-5 text-surface-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
              </svg>
              <select
                onChange={(e) => onSortChange(e.target.value)}
                className="bg-transparent text-sm font-bold text-surface-700 focus:outline-none appearance-none cursor-pointer pe-4 rtl:auto-mirrored"
              >
                <option value="">ترتيب افتراضي</option>
                <option value="cheap">الأقل سعراً</option>
                <option value="expensive">الأعلى سعراً</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
