import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const IMG_FALLBACK = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSI0MDAiIGZpbGw9IiNGMUY1RjkiLz48L3N2Zz4=';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  // Extract primary unit pricing (or fallback to product base price)
  const defaultUnit = product.units?.[0] || null;
  const currentPrice = defaultUnit?.selling_price || defaultUnit?.price || product.sale_price || product.price || 0;
  const originalPrice = defaultUnit?.purchasing_price || product.price || currentPrice;
  const unitName = defaultUnit?.name || '';
  
  const hasDiscount = currentPrice < originalPrice;
  const discountPercent = hasDiscount
    ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
    : 0;

  const handleAddToCart = (e) => {
    e.preventDefault(); // Prevent Link navigation
    setIsAdding(true);
    addToCart(product, defaultUnit);
    setTimeout(() => setIsAdding(false), 1200);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      className="group relative bg-white rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-xl transition-all duration-500 border border-surface-100 flex flex-col h-full"
    >
      <Link to={`/products/${product.id}`} className="block relative aspect-square overflow-hidden bg-surface-50 p-6 flex-shrink-0">
        {/* Decorative background glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-surface-100 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Discount Badge */}
        {hasDiscount && (
          <div className="absolute top-4 start-4 z-10 px-3 py-1 bg-gradient-to-r from-accent-500 to-accent-600 text-white text-xs font-black rounded-full shadow-lg shadow-accent-500/30 tracking-wide">
            خُصم {discountPercent}%
          </div>
        )}

        <motion.img
          src={product.photo || product.image || product.images?.[0]?.url || IMG_FALLBACK}
          alt={product.name || product.title}
          onError={(e) => { e.target.src = IMG_FALLBACK; e.target.onerror = null; }}
          className="w-full h-full object-contain relative z-10 drop-shadow-md group-hover:drop-shadow-xl transition-all duration-500"
          whileHover={{ scale: 1.08 }}
        />
      </Link>

      <div className="p-5 flex flex-col flex-1">
        {/* Category & Rating */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-primary-600 bg-primary-50 px-3 py-1 rounded-full">
            {product.category?.name || product.category || 'عام'}
          </span>
          <div className="flex items-center gap-1 bg-surface-50 px-2 py-0.5 rounded-full">
            <svg className="w-3.5 h-3.5 text-accent-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-xs font-bold text-surface-600">{product.rating?.rate || 4.5}</span>
          </div>
        </div>

        {/* Title */}
        <Link to={`/products/${product.id}`}>
          <h3 className="text-base font-bold text-surface-800 line-clamp-2 mb-2 group-hover:text-primary-600 transition-colors leading-snug">
            {product.name || product.title}
          </h3>
        </Link>
        
        {/* Unit Info */}
        {unitName && (
          <p className="text-xs text-surface-500 font-medium mb-3">
            الوحدة: <span className="font-bold text-surface-700">{unitName}</span>
          </p>
        )}

        <div className="mt-auto pt-4 flex items-end justify-between border-t border-surface-100">
          <div className="flex flex-col">
            {hasDiscount && (
              <span className="text-xs text-surface-400 line-through font-bold mb-0.5">
                {Number(originalPrice).toFixed(2)} ر.س
              </span>
            )}
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-black text-primary-700 leading-none tracking-tight">
                {Number(currentPrice).toFixed(2)}
              </span>
              <span className="text-xs font-bold text-surface-500">ر.س</span>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddToCart}
            disabled={isAdding}
            className={`relative w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-md ${
              isAdding 
                ? 'bg-green-500 text-white shadow-green-500/30' 
                : 'bg-surface-900 text-white hover:bg-primary-600 hover:shadow-primary-600/30'
            }`}
          >
            <AnimatePresence mode="wait">
              {isAdding ? (
                <motion.svg
                  key="check"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </motion.svg>
              ) : (
                <motion.svg
                  key="cart"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </motion.svg>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
