import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { createBill } from '../services/api';

export default function CheckoutPage() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold text-surface-800 mb-4">يجب تسجيل الدخول لإتمام الطلب</h2>
        <button
          onClick={() => navigate('/login')}
          className="px-8 py-3 bg-primary-600 text-white font-bold rounded-xl shadow-lg hover:bg-primary-700 transition-colors"
        >
          تسجيل الدخول
        </button>
      </div>
    );
  }

  // Handle empty cart
  if (cartItems.length === 0 && !success) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold text-surface-800 mb-4">السلة فارغة</h2>
        <button
          onClick={() => navigate('/products')}
          className="px-8 py-3 bg-primary-600 text-white font-bold rounded-xl shadow-lg hover:bg-primary-700 transition-colors"
        >
          تصفح المنتجات
        </button>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Map cart items into bill format
      const billProducts = cartItems.map(item => ({
        product_id: item.product_id || item.id,
        unit_id: item.unit_id,
        quantity: item.quantity,
        price: item.price,
        discount: 0,
        tax_value: 0
      }));

      const today = new Date().toISOString().split('T')[0];
      const billDetails = {
        details: note || 'طلب عبر المتجر الإلكتروني',
        issue_date: today
      };

      await createBill(billProducts, billDetails);
      clearCart();
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'تعذر إتمام الطلب، يرجى المحاولة لاحقاً.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white p-10 rounded-3xl shadow-lg border border-surface-100">
          <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
          </div>
          <h2 className="text-3xl font-black text-surface-900 mb-4">تم تأكيد طلبك بنجاح!</h2>
          <p className="text-surface-500 font-medium mb-8">
            شكراً لك {user?.name}. سيتم تجهيز طلبك في أقرب وقت.
          </p>
          <button onClick={() => navigate('/')} className="px-8 py-3 bg-primary-600 text-white font-bold rounded-xl shadow-lg shadow-primary-600/30 hover:bg-primary-700 transition-colors">
            العودة للرئيسية
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <h1 className="text-3xl font-black text-surface-900 mb-8">إتمام الطلب</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-surface-100">
            <h2 className="text-xl font-bold text-surface-800 mb-6">بيانات الطلب</h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-bold text-surface-600 mb-2">الاسم</label>
                  <input type="text" disabled value={user?.name || ''} className="w-full bg-surface-50 border border-surface-200 rounded-xl px-4 py-3 text-surface-500 cursor-not-allowed" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-surface-600 mb-2">رقم الجوال</label>
                  <input type="text" disabled value={user?.phone || ''} className="w-full bg-surface-50 border border-surface-200 rounded-xl px-4 py-3 text-surface-500 cursor-not-allowed" />
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-bold text-surface-600 mb-2">ملاحظات إضافية (اختياري)</label>
                <textarea
                  rows="3"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="أضف أي تفاصيل أو ملاحظات خاصة بطلبك..."
                  className="w-full bg-white border border-surface-200 rounded-xl px-4 py-3 text-surface-800 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                ></textarea>
              </div>

              {error && (
                <div className="p-4 bg-red-50 text-red-600 font-bold rounded-xl mb-6 flex items-center gap-2 border border-red-100">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                  {error}
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-surface-50 rounded-3xl p-6 md:p-8 shadow-sm border border-surface-200 sticky top-24">
            <h2 className="text-xl font-bold text-surface-800 mb-6 border-b border-surface-200 pb-4">ملخص الطلب</h2>
            
            <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto custom-scrollbar pe-2">
              {cartItems.map(item => (
                <div key={item.cartKey} className="flex justify-between items-start gap-4">
                  <div>
                    <p className="text-sm font-bold text-surface-800 line-clamp-1">{item.title}</p>
                    <p className="text-xs text-surface-500 font-medium">الكمية: {item.quantity} {item.unit_name && `(${item.unit_name})`}</p>
                  </div>
                  <span className="text-sm font-black text-primary-600 whitespace-nowrap">{(item.price * item.quantity).toFixed(2)} ر.س</span>
                </div>
              ))}
            </div>

            <div className="border-t border-surface-200 pt-6 space-y-3 mb-8 text-sm">
              <div className="flex justify-between text-surface-600 font-medium">
                <span>المجموع الفرعي</span>
                <span>{cartTotal.toFixed(2)} ر.س</span>
              </div>
              <div className="flex justify-between text-surface-600 font-medium">
                <span>الضريبة (مشمولة)</span>
                <span>0.00 ر.س</span>
              </div>
              <div className="flex justify-between text-surface-900 font-black text-xl pt-4 border-t border-surface-200">
                <span>الإجمالي</span>
                <span className="text-primary-600">{cartTotal.toFixed(2)} ر.س</span>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg ${
                loading 
                  ? 'bg-surface-300 text-white cursor-not-allowed' 
                  : 'bg-gradient-to-r from-primary-600 to-primary-700 text-white hover:shadow-primary-600/40'
              }`}
            >
              {loading ? (
                <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                'تأكيد الشراء'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
