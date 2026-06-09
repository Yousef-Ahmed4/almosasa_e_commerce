import { motion } from 'framer-motion';
import ProductCard from './ProductCard';

export default function ProductGrid({ products, loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-white rounded-3xl p-4 shadow-sm border border-surface-100 h-96 flex flex-col">
            <div className="w-full h-48 skeleton rounded-2xl mb-6" />
            <div className="w-20 h-6 skeleton rounded-full mb-4" />
            <div className="w-full h-10 skeleton rounded-lg mb-4" />
            <div className="mt-auto flex justify-between items-end">
              <div className="w-24 h-8 skeleton rounded-lg" />
              <div className="w-12 h-12 skeleton rounded-2xl" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-32 h-32 mb-6 rounded-full bg-surface-50 flex items-center justify-center shadow-inner">
          <svg className="w-16 h-16 text-surface-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-surface-800 mb-2">لم يتم العثور على منتجات</h3>
        <p className="text-surface-500 font-medium max-w-sm mx-auto">
          لم نتمكن من العثور على أي منتجات تطابق بحثك أو الفلتر المحدد. يرجى تجربة كلمات مختلفة.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: 0.1 }
        }
      }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8"
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </motion.div>
  );
}
