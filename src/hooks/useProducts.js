import { useState, useEffect, useCallback } from 'react';
import { getProducts } from '../services/api';

export default function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    category_id: '',
    price_sort: '',
    page: 1,
  });

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.category_id) params.category_id = filters.category_id;
      if (filters.price_sort) params.price_sort = filters.price_sort;
      if (filters.page) params.page = filters.page;

      const response = await getProducts(params);
      const data = response.data;

      // Handle common API response shapes
      if (Array.isArray(data)) {
        setProducts(data);
      } else if (data?.data && Array.isArray(data.data)) {
        setProducts(data.data);
      } else if (data?.products && Array.isArray(data.products)) {
        setProducts(data.products);
      } else {
        setProducts([]);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const updateFilters = useCallback((newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  return { products, loading, error, filters, updateFilters, refetch: fetchProducts };
}
