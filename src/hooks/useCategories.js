import { useState, useEffect } from 'react';
import { getCategories } from '../services/api';

export default function useCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await getCategories();
        const data = response.data;
        if (Array.isArray(data)) {
          setCategories(data);
        } else if (data?.data && Array.isArray(data.data)) {
          setCategories(data.data);
        } else {
          setCategories([]);
        }
      } catch {
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return { categories, loading };
}
