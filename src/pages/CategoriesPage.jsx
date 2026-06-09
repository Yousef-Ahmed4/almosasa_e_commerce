import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getCategories } from '../services/api';

const IMG_FALLBACK = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSI0MDAiIGZpbGw9IiNGMUY1RjkiLz48L3N2Zz4=';

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await getCategories();
        setCategories(res.data?.data || res.data || []);
      } catch (e) {
        console.error('Failed to load categories', e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 flex justify-center">
        <div className="w-12 h-12 border-4 border-surface-200 border-t-primary-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <h1 className="text-3xl sm:text-4xl font-black text-surface-900 mb-2">تسوق حسب القسم</h1>
      <p className="text-surface-500 font-medium mb-12 max-w-2xl">
        اكتشف تشكيلة واسعة من المنتجات المنظمة بعناية في أقسام لتسهيل تجربة تسوقك.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories.map((cat, i) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            key={cat.id}
          >
            <Link to={`/categories/${cat.id}`} className="group block bg-white rounded-3xl p-6 shadow-sm border border-surface-100 hover:shadow-xl transition-all duration-300 text-center">
              <div className="w-24 h-24 mx-auto mb-4 bg-surface-50 rounded-2xl p-4 overflow-hidden group-hover:scale-110 transition-transform duration-500">
                <img
                  src={cat.photo || cat.image || IMG_FALLBACK}
                  alt={cat.name}
                  onError={(e) => { e.target.src = IMG_FALLBACK; e.target.onerror = null; }}
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="text-lg font-bold text-surface-800 group-hover:text-primary-600 transition-colors">
                {cat.name}
              </h3>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
