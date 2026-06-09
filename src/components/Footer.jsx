import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: 'التسوق',
      links: [
        { name: 'المنتجات', path: '/products' },
        { name: 'الأقسام', path: '/categories' },
        { name: 'الماركات', path: '/brands' },
        { name: 'العروض الخاصة', path: '/offers' },
      ],
    },
    {
      title: 'المؤسسة',
      links: [
        { name: 'من نحن', path: '#' },
        { name: 'فروعنا', path: '#' },
        { name: 'وظائف', path: '#' },
        { name: 'تواصل معنا', path: '#' },
      ],
    },
    {
      title: 'المساعدة',
      links: [
        { name: 'مركز المساعدة', path: '#' },
        { name: 'سياسة الاسترجاع', path: '#' },
        { name: 'الأسئلة الشائعة', path: '#' },
      ],
    },
  ];

  return (
    <footer className="bg-surface-950 text-surface-300 border-t-4 border-primary-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 py-16">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                <span className="text-white font-bold text-xl leading-none pt-1.5">م</span>
              </div>
              <span className="text-2xl font-black text-white">المؤسسة</span>
            </Link>
            <p className="text-sm text-surface-400 font-medium leading-relaxed">
              منتجات عالية الجودة تصلك بعناية و أمان. وجهتك الموثوقة للتسوق الإلكتروني.
            </p>
            {/* Social Icons */}
            <div className="flex gap-3 mt-8">
              {['تويتر', 'التطبيق', 'فيسبوك'].map((social, i) => (
                <motion.a
                  key={i}
                  href="#"
                  whileHover={{ scale: 1.1, translateY: -2 }}
                  className="w-10 h-10 rounded-xl bg-surface-800 hover:bg-primary-600 border border-surface-700 hover:border-primary-500 flex items-center justify-center text-surface-400 hover:text-white transition-all shadow-sm"
                >
                  <span className="text-xs font-bold">{social[0]}</span>
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links */}
          {footerLinks.map((group) => (
            <div key={group.title}>
              <h3 className="text-white font-bold mb-6 text-lg">{group.title}</h3>
              <ul className="space-y-4">
                {group.links.map((link) => (
                  <li key={link.name}>
                    <Link to={link.path} className="text-sm font-medium text-surface-400 hover:text-primary-400 transition-colors flex items-center gap-2 group">
                      <span className="w-1.5 h-1.5 rounded-full bg-surface-700 group-hover:bg-primary-400 transition-colors" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="border-t border-surface-800 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-sm font-bold text-surface-500 text-center md:text-start">
            © {currentYear} المؤسسة. جميع الحقوق محفوظة.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            {['سياسة الخصوصية', 'الشروط والأحكام', 'سياسة ملفات الارتباط'].map((link) => (
              <a key={link} href="#" className="text-sm font-bold text-surface-500 hover:text-white transition-colors">
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
