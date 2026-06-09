import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { cartCount, toggleCart } = useCart();
  const { isAuthenticated, user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'الرئيسية', path: '/' },
    { name: 'المنتجات', path: '/products' },
    { name: 'الأقسام', path: '/categories' },
    { name: 'الماركات', path: '/brands' },
    { name: 'العروض', path: '/offers' },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/90 backdrop-blur-xl shadow-lg shadow-primary-900/5'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2"
          >
            <Link to="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-500/30">
                <span className="text-white font-bold text-lg leading-none pt-1">م</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary-700 to-primary-950 bg-clip-text text-transparent hidden sm:block">
                المؤسسة
              </span>
            </Link>
          </motion.div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <motion.div key={link.path} whileHover={{ y: -2 }} className="relative group">
                <Link
                  to={link.path}
                  className={`text-sm font-bold transition-colors ${
                    location.pathname === link.path ? 'text-primary-600' : 'text-surface-600 hover:text-primary-600'
                  }`}
                >
                  {link.name}
                </Link>
                <span className={`absolute -bottom-1 right-0 h-0.5 bg-primary-500 transition-all duration-300 rounded-full ${
                  location.pathname === link.path ? 'w-full' : 'w-0 group-hover:w-full'
                }`} />
              </motion.div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Cart Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleCart}
              className="relative p-2.5 rounded-xl bg-surface-100/80 hover:bg-primary-50 text-surface-600 hover:text-primary-600 transition-colors backdrop-blur-sm"
              aria-label="سلة المشتريات"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-accent-500 to-accent-600 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg shadow-accent-500/40"
                  >
                    {cartCount > 99 ? '99+' : cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            {/* User / Auth */}
            {isAuthenticated ? (
              <div className="hidden sm:flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-sm font-bold shadow-md">
                  {user?.name?.charAt(0) || 'م'}
                </div>
                <button
                  onClick={logout}
                  className="text-sm font-bold text-surface-500 hover:text-primary-600 transition-colors"
                >
                  تسجيل خروج
                </button>
              </div>
            ) : (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="hidden sm:block">
                <Link
                  to="/login"
                  className="px-5 py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-primary-600/25 hover:shadow-primary-600/40 transition-shadow"
                >
                  تسجيل الدخول
                </Link>
              </motion.div>
            )}

            {/* Mobile Menu Toggle */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 rounded-xl bg-surface-100/80 text-surface-600 hover:bg-surface-200"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Desktop Fallback */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white/95 backdrop-blur-xl border-t border-surface-100 shadow-xl overflow-hidden"
          >
            <div className="px-4 py-4 flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`block px-4 py-3 rounded-xl text-sm font-bold transition-colors ${
                    location.pathname === link.path
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-surface-700 hover:bg-surface-50'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              {!isAuthenticated ? (
                <Link
                  to="/login"
                  className="block px-4 py-3 mt-2 text-center bg-primary-600 text-white rounded-xl text-sm font-bold shadow-md shadow-primary-600/20"
                >
                  تسجيل الدخول
                </Link>
              ) : (
                <button
                  onClick={logout}
                  className="block w-full text-start px-4 py-3 mt-2 text-primary-600 hover:bg-primary-50 rounded-xl text-sm font-bold transition-colors"
                >
                  تسجيل خروج
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
