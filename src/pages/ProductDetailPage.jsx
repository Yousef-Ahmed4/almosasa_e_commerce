import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getProduct } from '../services/api';
import { useCart } from '../context/CartContext';

const IMG_FALLBACK = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSI0MDAiIGZpbGw9IiNGMUY1RjkiLz48L3N2Zz4=';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        const res = await getProduct(id);
        const data = res.data?.data || res.data;
        setProduct(data);
        if (data.units && data.units.length > 0) {
          setSelectedUnit(data.units[0]);
        }
      } catch (err) {
        setError('تعذر تحميل تفاصيل المنتج. يرجى المحاولة لاحقاً.');
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  const currentPrice = useMemo(() => {
    if (!product) return 0;
    return selectedUnit?.selling_price || selectedUnit?.price || product.sale_price || product.price || 0;
  }, [product, selectedUnit]);

  const originalPrice = useMemo(() => {
    if (!product) return 0;
    return selectedUnit?.purchasing_price || product.price || currentPrice;
  }, [product, selectedUnit, currentPrice]);

  const hasDiscount = currentPrice < originalPrice;

  const handleAddToCart = () => {
    setIsAdding(true);
    // Add multiple times based on quantity selected
    for (let i = 0; i < quantity; i++) {
       addToCart(product, selectedUnit);
    }
    setTimeout(() => setIsAdding(false), 1000);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex justify-center">
        <div className="w-12 h-12 border-4 border-surface-200 border-t-primary-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-surface-800 mb-4">{error || ' المنتج غير موجود'}</h2>
        <button onClick={() => navigate('/products')} className="px-6 py-2 bg-primary-600 text-white rounded-xl">
          العودة للمنتجات
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <div className="bg-white rounded-3xl shadow-sm border border-surface-100 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-8 lg:gap-12">
          
          {/* Image Gallery */}
          <div className="p-8 md:p-12 bg-surface-50 flex items-center justify-center min-h-[400px]">
            <motion.img
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              src={product.photo || product.image || product.images?.[0]?.url || IMG_FALLBACK}
              alt={product.name}
              onError={(e) => { e.target.src = IMG_FALLBACK; e.target.onerror = null; }}
              className="max-w-full max-h-[500px] object-contain drop-shadow-xl"
            />
          </div>

          {/* Details */}
          <div className="p-8 md:p-12 flex flex-col justify-center">
            {/* Category Breadcrumb */}
            <div className="flex items-center gap-2 mb-4 text-sm font-bold text-primary-600">
              <span className="bg-primary-50 px-3 py-1 rounded-full">
                {product.category?.name || product.category || 'عام'}
              </span>
              {/* Add rating if available */}
            </div>

            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-4xl font-black text-surface-900 leading-tight mb-4"
            >
              {product.name || product.title}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-surface-500 font-medium mb-8 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: product.details || product.description || 'لا يوجد وصف متاح لهذا المنتج.' }}
            />

            {/* Price & Units */}
            <div className="bg-surface-50 rounded-2xl p-6 mb-8 border border-surface-200">
              <div className="flex flex-wrap gap-6 items-end justify-between mb-6">
                <div>
                  <p className="text-sm font-bold text-surface-500 mb-1">السعر</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-primary-700">{Number(currentPrice).toFixed(2)}</span>
                    <span className="text-lg font-bold text-surface-600">ر.س</span>
                  </div>
                  {hasDiscount && (
                    <p className="text-sm text-surface-400 line-through font-bold mt-1">
                      {Number(originalPrice).toFixed(2)} ر.س
                    </p>
                  )}
                </div>

                {/* Unit Selector */}
                {product.units && product.units.length > 0 && (
                  <div className="min-w-[150px]">
                    <label className="block text-sm font-bold text-surface-500 mb-2">الوحدة</label>
                    <select
                      className="w-full bg-white border border-surface-200 text-surface-800 text-sm font-bold rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyBmaWxsPSJub25lIiBoZWlnaHQ9IjIwIiB2aWV3Qm94PSIwIDAgMjAgMjAiIHdpZHRoPSIyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNNCA3TDEwIDEzTDE2IDciIHN0cm9rZT0iIzkyOTI5MiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBzdHJva2Utd2lkdGg9IjIiLz48L3N2Zz4=')] bg-no-repeat bg-[position:left_1rem_center] rtl:bg-[position:left_1rem_center]"
                      value={selectedUnit?.id || ''}
                      onChange={(e) => {
                        const unit = product.units.find(u => u.id.toString() === e.target.value);
                        setSelectedUnit(unit);
                      }}
                    >
                      {product.units.map(unit => (
                        <option key={unit.id} value={unit.id}>{unit.name}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Add to Cart Controls */}
              <div className="flex items-center gap-4">
                <div className="flex items-center bg-white rounded-xl border border-surface-200 h-14 w-32 shrink-0">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="flex-1 h-full flex items-center justify-center text-surface-500 hover:text-primary-600 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" /></svg>
                  </button>
                  <span className="w-10 text-center font-bold text-surface-900 border-x border-surface-100">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="flex-1 h-full flex items-center justify-center text-surface-500 hover:text-primary-600 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                  </button>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddToCart}
                  disabled={isAdding}
                  className={`flex-1 h-14 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg ${
                    isAdding 
                      ? 'bg-green-500 text-white shadow-green-500/30' 
                      : 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-primary-600/30 hover:shadow-primary-600/40'
                  }`}
                >
                  <AnimatePresence mode="wait">
                    {isAdding ? (
                      <motion.span key="check" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                        تمت الإضافة
                      </motion.span>
                    ) : (
                      <motion.span key="add" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                        أضف إلى السلة
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              </div>
            </div>

            {/* Delivery Features */}
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="flex items-center gap-3 p-4 rounded-xl bg-surface-50">
                <div className="text-primary-600"><svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg></div>
                <span className="text-sm font-bold text-surface-700">توصيل سريع</span>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-surface-50">
                <div className="text-primary-600"><svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg></div>
                <span className="text-sm font-bold text-surface-700">جودة مضمونة</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
