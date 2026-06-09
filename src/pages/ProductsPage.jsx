import { useCallback } from 'react';
import useProducts from '../hooks/useProducts';
import SearchFilter from '../components/SearchFilter';
import ProductGrid from '../components/ProductGrid';
import { motion } from 'framer-motion';

export default function ProductsPage() {
  const { products, loading, filters, updateFilters } = useProducts();

  const handleSearchChange = useCallback((search) => updateFilters({ search, page: 1 }), [updateFilters]);
  const handleCategoryChange = useCallback((category_id) => updateFilters({ category_id, page: 1 }), [updateFilters]);
  const handleSortChange = useCallback((price_sort) => updateFilters({ price_sort, page: 1 }), [updateFilters]);

  return (
    <div className="min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 mt-12">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl sm:text-4xl font-black text-surface-900"
        >
          جميع المنتجات
        </motion.h1>
      </div>

      <SearchFilter
        onSearchChange={handleSearchChange}
        onCategoryChange={handleCategoryChange}
        onSortChange={handleSortChange}
        activeCategory={filters.category_id}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <ProductGrid products={products} loading={loading} />
      </div>
    </div>
  );
}
