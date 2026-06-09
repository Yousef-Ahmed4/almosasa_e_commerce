import { useState, useEffect } from 'react';
import ProductGrid from '../components/ProductGrid';
import { getOffers } from '../services/api';

export default function OffersPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await getOffers();
        const data = res.data?.data || res.data || [];
        // Map offers to valid product structure if nested
        const mapped = data.map(offer => offer.product || offer);
        setProducts(mapped);
      } catch (e) {
        console.error('Failed to load offers', e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="bg-primary-50 min-h-screen">
      <div className="bg-gradient-to-br from-primary-900 to-primary-800 py-20 text-center">
        <h1 className="text-4xl md:text-5xl font-black text-white mb-4">العروض الحصرية</h1>
        <p className="text-primary-200 font-medium max-w-2xl mx-auto px-4">
          اكتشف أفضل التخفيضات والخصومات على منتجاتك المفضلة لفترة محدودة.
        </p>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 -mt-10 relative z-10">
        <ProductGrid products={products} loading={loading} />
      </div>
    </div>
  );
}
