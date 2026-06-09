import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { motion } from 'framer-motion';

const IMG_FALLBACK = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSI0MDAiIGZpbGw9IiNGMUY1RjkiLz48L3N2Zz4=';

export default function CartPage() {
  const { cartItems, cartTotal, removeFromCart, updateQuantity, clearCart } = useCart();
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center py-20 text-center px-4">
        <div className="w-32 h-32 mb-8 rounded-full bg-surface-50 flex items-center justify-center shadow-inner">
          <svg className="w-16 h-16 text-surface-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <h2 className="text-3xl font-black text-surface-900 mb-4">سلة المشتريات فارغة</h2>
        <p className="text-surface-500 font-medium mb-10 max-w-sm">
          يبدو أنك لم تقم بإضافة أي منتجات إلى سلة المشتريات حتى الآن.
        </p>
        <button
          onClick={() => navigate('/products')}
          className="px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-2xl shadow-lg shadow-primary-600/30 transition-colors"
        >
          ابدأ التسوق الآن
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-black text-surface-900">سلة المشتريات ({cartItems.length})</h1>
        <button onClick={clearCart} className="text-sm font-bold text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-xl transition-colors">
          إفراغ السلة
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <motion.div
              layout
              key={item.cartKey}
              className="bg-white rounded-3xl p-4 sm:p-6 shadow-sm border border-surface-100 flex flex-col sm:flex-row gap-6 items-start sm:items-center relative"
            >
              <button
                onClick={() => removeFromCart(item.cartKey)}
                className="absolute top-4 start-4 sm:static sm:top-auto sm:start-auto p-2 rounded-xl text-surface-400 hover:bg-red-50 hover:text-red-500 transition-colors shrink-0"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
              
              <Link to={`/products/${item.product_id}`} className="w-24 h-24 rounded-2xl bg-surface-50 shrink-0 border border-surface-100 p-2 block">
                <img src={item.image || IMG_FALLBACK} alt={item.title} onError={(e) => e.target.src = IMG_FALLBACK} className="w-full h-full object-contain" />
              </Link>
              
              <div className="flex-1 min-w-0">
                <Link to={`/products/${item.product_id}`}>
                  <h3 className="text-lg font-bold text-surface-900 line-clamp-2 hover:text-primary-600 transition-colors mb-2">
                    {item.title}
                  </h3>
                </Link>
                <div className="flex flex-wrap items-center gap-4 text-sm font-bold">
                  <span className="text-primary-600 text-lg">{Number(item.price || 0).toFixed(2)} ر.س</span>
                  {item.unit_name && <span className="bg-surface-100 text-surface-600 px-3 py-1 rounded-lg">{item.unit_name}</span>}
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-4 sm:flex-col sm:items-end ms-auto">
                <div className="flex items-center gap-1 bg-surface-50 rounded-xl border border-surface-200 p-1">
                  <button onClick={() => updateQuantity(item.cartKey, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-white shadow-sm text-surface-600 hover:text-primary-600 transition-colors">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" /></svg>
                  </button>
                  <span className="w-10 text-center font-bold text-surface-900">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.cartKey, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-white shadow-sm text-surface-600 hover:text-primary-600 transition-colors">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                  </button>
                </div>
                <span className="text-lg font-black text-surface-900 sm:hidden">
                  {Number((item.price || 0) * item.quantity).toFixed(2)} ر.س
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-surface-50 rounded-3xl p-8 shadow-sm border border-surface-200 sticky top-24">
            <h2 className="text-2xl font-black text-surface-900 mb-6">ملخص الطلب</h2>
            <div className="space-y-4 text-surface-600 font-medium mb-8">
              <div className="flex justify-between">
                <span>المجموع الفرعي ({cartItems.length} عناصر)</span>
                <span className="font-bold text-surface-900">{Number(cartTotal || 0).toFixed(2)} ر.س</span>
              </div>
              <div className="flex justify-between">
                <span>الضريبة</span>
                <span className="font-bold text-surface-900">0.00 ر.س</span>
              </div>
            </div>
            
            <div className="border-t border-surface-200 pt-6 mb-8 flex justify-between items-end">
              <span className="text-lg font-bold text-surface-800">الإجمالي</span>
              <div className="text-start">
                <span className="text-3xl font-black text-primary-600">{Number(cartTotal || 0).toFixed(2)}</span>
                <span className="text-sm font-bold text-surface-500 ms-1">ر.س</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-bold rounded-2xl shadow-xl shadow-primary-600/30 hover:shadow-primary-600/40 transition-shadow text-lg flex items-center justify-center gap-2"
            >
              متابعة عملية الشراء
              <svg className="w-5 h-5 rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
