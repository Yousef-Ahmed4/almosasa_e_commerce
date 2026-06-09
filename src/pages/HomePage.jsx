import { useCallback } from 'react';
import useProducts from '../hooks/useProducts';
import Hero from '../components/Hero';
import ProductGrid from '../components/ProductGrid';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function HomePage() {
  const { products, loading } = useProducts();

  // Show only top 8 products on homepage
  const featuredProducts = products?.slice(0, 8) || [];

  return (
    <div>
      <Hero />
      
      {/* Featured Products Section */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div>
            <motion.h2
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-3xl sm:text-4xl font-black text-surface-900 tracking-tight"
            >
              المنتجات <span className="text-primary-600">المميزة</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="mt-3 text-surface-500 font-medium text-lg max-w-2xl"
            >
              تصفح مجموعتنا المختارة بعناية من أفضل المنتجات الفاخرة التي تلبي ذوقك.
            </motion.p>
          </div>
          <Link
            to="/products"
            className="group inline-flex items-center justify-center px-6 py-3 bg-white text-primary-600 font-bold rounded-xl shadow-sm hover:shadow-md border border-surface-200 hover:border-primary-200 hover:bg-primary-50 transition-all text-sm whitespace-nowrap"
          >
            
            عرض جميع المنتجات
            <svg className="w-5 h-5 mr-2 rotate-180 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>

        <ProductGrid products={featuredProducts} loading={loading} />
      </section>

      {/* Brand Benefit Banner */}
      <section className="bg-primary-950 py-24 mb-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-6">
            لماذا تختار <span className="text-accent-400">المؤسسة؟</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 text-center">
            {[
              { title: 'شحن سريع', desc: 'توصيل موثوق وآمن لجميع المناطق', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
              { title: 'جودة استثنائية', desc: 'نهتم بأدق التفاصيل لضمان رضاك التام', icon: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z' },
              { title: 'دعم على مدار الساعة', desc: 'فريق متخصص لخدمتك في أي وقت', icon: 'M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z' }
            ].map(v => (
              <div key={v.title} className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-surface-800/50 flex items-center justify-center mb-6 text-accent-400">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={v.icon} /></svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{v.title}</h3>
                <p className="text-surface-400">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
