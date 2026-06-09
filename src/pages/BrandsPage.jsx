import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getProducingCompanies } from '../services/api';

const IMG_FALLBACK = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSI0MDAiIGZpbGw9IiNGMUY1RjkiLz48L3N2Zz4=';

export default function BrandsPage() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
// test
  useEffect(() => {
    async function load() {
      try {
        const res = await getProducingCompanies();
        setBrands(res.data?.data || res.data || []);
      } catch (e) {
        console.error('Failed to load brands', e);
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
      <h1 className="text-3xl sm:text-4xl font-black text-surface-900 mb-2">أفضل الماركات</h1>
      <p className="text-surface-500 font-medium mb-12 max-w-2xl">
        نحن نفخر بتقديم منتجات من أفضل الشركات المنتجة لضمان الجودة العالية.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {brands.map((brand, i) => (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            key={brand.id}
            className="group bg-white rounded-2xl p-6 shadow-sm border border-surface-100 hover:shadow-xl hover:border-primary-100 transition-all duration-300 text-center flex flex-col items-center justify-center h-48"
          >
            <div className="w-20 h-20 mb-4 bg-surface-50 rounded-xl p-2 group-hover:bg-white transition-colors">
              <img
                src={brand.photo || brand.image || brand.logo || IMG_FALLBACK}
                alt={brand.name}
                onError={(e) => { e.target.src = IMG_FALLBACK; e.target.onerror = null; }}
                className="w-full h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-500"
              />
            </div>
            <h3 className="text-sm font-bold text-surface-800 line-clamp-2">
              {brand.name}
            </h3>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
