import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const IMG_FALLBACK = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSI0MDAiIGZpbGw9IiNGMUY1RjkiLz48L3N2Zz4=';

export default function CartDrawer() {
  const {
    cartItems, cartCount, cartTotal, isCartOpen, closeCart, removeFromCart, updateQuantity, clearCart
  } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Drawer - slides from left in RTL (left-0, x: -100%) */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="fixed top-0 left-0 h-full w-full sm:w-[420px] bg-white shadow-2xl z-50 flex flex-col pt-safe-top"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-surface-100 bg-surface-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center border border-primary-100">
                  <svg className="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-surface-900 leading-none">سلة المشتريات</h2>
                  <p className="text-xs font-bold text-surface-400 mt-1">{cartCount} عنصر</p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={closeCart}
                className="p-2 rounded-xl hover:bg-surface-200 text-surface-400 hover:text-surface-600 transition-all bg-surface-100"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 custom-scrollbar">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-20 h-20 rounded-full bg-surface-50 flex items-center justify-center mb-6 shadow-inner">
                    <svg className="w-10 h-10 text-surface-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-surface-800">السلة فارغة</h3>
                  <p className="text-surface-500 font-medium text-sm mt-2 max-w-[250px]">
                    يبدو أنك لم تضف أي منتجات إلى سلة المشتريات حتى الآن.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={closeCart}
                    className="mt-8 px-8 py-3.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-primary-600/25 transition-colors"
                  >
                    تصفح المنتجات
                  </motion.button>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <motion.div
                      key={item.cartKey}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95, height: 0, marginBottom: 0 }}
                      className="flex gap-4 p-3.5 rounded-2xl bg-white border border-surface-100 shadow-sm hover:shadow-md transition-shadow"
                    >
                      {/* Item Image */}
                      <Link to={`/products/${item.product_id}`} onClick={closeCart} className="w-20 h-20 rounded-xl overflow-hidden bg-surface-50 flex-shrink-0 border border-surface-100">
                        <img
                          src={item.image || IMG_FALLBACK}
                          alt={item.title}
                          onError={(e) => { e.target.src = IMG_FALLBACK; }}
                          className="w-full h-full object-cover hover:scale-110 transition-transform"
                        />
                      </Link>

                      {/* Item Details */}
                      <div className="flex-1 min-w-0 flex flex-col">
                        <div className="flex justify-between items-start gap-2">
                          <Link to={`/products/${item.product_id}`} onClick={closeCart}>
                            <h4 className="text-sm font-bold text-surface-800 line-clamp-2 hover:text-primary-600 transition-colors">
                              {item.title}
                            </h4>
                          </Link>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => removeFromCart(item.cartKey)}
                            className="p-1.5 rounded-lg text-surface-300 hover:text-red-500 hover:bg-red-50 transition-colors shrink-0"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </motion.button>
                        </div>
                        
                        <div className="mt-1 flex items-center gap-2">
                          <span className="text-sm font-black text-primary-600">
                            {Number(item.price || 0).toFixed(2)} ر.س
                          </span>
                          {item.unit_name && (
                            <span className="text-xs font-bold text-surface-400 bg-surface-100 px-2 py-0.5 rounded-md">
                              {item.unit_name}
                            </span>
                          )}
                        </div>

                        {/* Quantity Controls */}
                        <div className="mt-auto pt-2 flex items-center justify-between">
                          <div className="flex items-center gap-1 bg-surface-50 rounded-lg border border-surface-200 p-0.5">
                            <motion.button
                              whileTap={{ scale: 0.9 }}
                              onClick={() => updateQuantity(item.cartKey, item.quantity - 1)}
                              className="w-7 h-7 flex items-center justify-center rounded-md bg-white shadow-sm text-surface-600 hover:text-primary-600 transition-colors"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" /></svg>
                            </motion.button>
                            <span className="w-8 text-center text-sm font-bold text-surface-900 select-none">
                              {item.quantity}
                            </span>
                            <motion.button
                              whileTap={{ scale: 0.9 }}
                              onClick={() => updateQuantity(item.cartKey, item.quantity + 1)}
                              className="w-7 h-7 flex items-center justify-center rounded-md bg-white shadow-sm text-surface-600 hover:text-primary-600 transition-colors"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                            </motion.button>
                          </div>
                          
                          <span className="text-sm font-bold text-surface-900">
                            {Number((item.price || 0) * item.quantity).toFixed(2)} ر.س
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {/* Clear All */}
                  <div className="pt-2 pb-4">
                    <button
                      onClick={clearCart}
                      className="w-full text-center text-xs font-bold text-surface-400 hover:text-red-600 py-2 transition-colors flex items-center justify-center gap-1"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      إفراغ السلة
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Footer / Checkout */}
            {cartItems.length > 0 && (
              <div className="border-t border-surface-200 bg-surface-50 px-6 py-5 space-y-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                <div className="flex items-end justify-between">
                  <span className="text-surface-600 font-bold text-sm">المجموع الفرعي</span>
                  <div className="text-left flex flex-col">
                    <span className="text-2xl font-black text-primary-700 leading-none">
                      {Number(cartTotal || 0).toFixed(2)} <span className="text-sm text-surface-500 font-bold">ر.س</span>
                    </span>
                    <span className="text-[10px] text-surface-400 font-medium mt-1">شامل الضريبة إن وجدت</span>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCheckout}
                  className="w-full py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-bold rounded-2xl shadow-xl shadow-primary-600/30 hover:shadow-primary-600/40 transition-shadow text-base flex justify-center items-center gap-2"
                >
                  إتمام الطلب
                  <svg className="w-5 h-5 rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </motion.button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
