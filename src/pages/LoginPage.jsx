import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const { login, isAuthenticated, loading } = useAuth();
  const { syncCartToServer } = useCart();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!phone || !password) {
      setError('يرجى إدخال رقم الجوال وكلمة المرور');
      return;
    }

    const { success, error: authError } = await login(phone, password);
    if (success) {
      // Sync local cart to server immediately after login
      await syncCartToServer();
      navigate(-1); // Go back to previous page
    } else {
      setError(authError || 'بيانات الدخول غير صحيحة');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-primary-900/5 border border-surface-100 p-8"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-500/30 mb-6">
            <span className="text-white font-bold text-3xl pt-1">م</span>
          </div>
          <h1 className="text-2xl font-black text-surface-900 mb-2">مرحباً بك مجدداً</h1>
          <p className="text-surface-500 font-medium text-sm">قم بتسجيل الدخول للمتابعة إلى سلة المشتريات وإتمام الطلب</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-4 bg-red-50 text-red-600 font-bold rounded-xl text-sm border border-red-100 flex items-center gap-2">
              <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-bold text-surface-700 mb-2">رقم الجوال</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="05xxxxxxxxx"
              className="w-full bg-surface-50 border border-surface-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500 rounded-xl px-4 py-3 text-surface-900 font-medium transition-colors dir-ltr text-left rtl:text-right rtl:dir-rtl"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-surface-700 mb-2">كلمة المرور</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-surface-50 border border-surface-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500 rounded-xl px-4 py-3 text-surface-900 font-medium transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3.5 rounded-xl font-bold text-white transition-all shadow-lg flex justify-center items-center ${
              loading 
                ? 'bg-surface-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-primary-600 to-primary-700 hover:shadow-primary-600/40 hover:-translate-y-0.5'
            }`}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              'تسجيل الدخول'
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm font-medium text-surface-500">
          ليس لديك حساب؟ <a href="#" className="font-bold text-primary-600 hover:text-primary-700">تواصل مع الدعم لإنشاء حساب</a>
        </p>
      </motion.div>
    </div>
  );
}
