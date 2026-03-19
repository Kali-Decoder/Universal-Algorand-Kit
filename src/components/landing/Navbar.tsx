import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Menu from 'lucide-react/dist/esm/icons/menu.js';
import X from 'lucide-react/dist/esm/icons/x.js';

const navLinks = [
  { label: 'How It Works', id: 'how-it-works' },
  { label: 'Architecture', id: 'corridors' },
  { label: 'Why Algorand', id: 'why-algorand' },
  { label: 'FAQ', id: 'faq' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    setMobileOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-black/95 backdrop-blur-2xl border-b border-white/[0.08]' : 'bg-transparent'
      }`}
    >
      <div className="flex items-center justify-between h-14 md:h-16 px-5 md:px-8 lg:px-12">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <span className="text-[#bdf500] text-lg font-black leading-none select-none">●</span>
          <span className="text-white font-extrabold text-[0.9rem] tracking-tight">Universal Algo Kit</span>
        </Link>

        <div className="hidden md:flex items-center h-full divide-x divide-white/[0.07]">
          {navLinks.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className="text-[#8e9191] hover:text-white transition-colors duration-200 text-[0.78rem] font-medium px-5"
            >
              {item.label}
            </button>
          ))}
          <Link
            to="/docs"
            className="text-[#8e9191] hover:text-white transition-colors duration-200 text-[0.78rem] font-medium px-5"
          >
            Docs
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-2">
          <button
            type="button"
            aria-disabled="true"
            className="text-[#8e9191] text-[0.78rem] font-medium px-4 transition-colors cursor-not-allowed opacity-60"
          >
            Log in
          </button>
          {/* <button
            type="button"
            aria-disabled="true"
            className="bg-[#bdf500] hover:bg-[#d8ff7b] text-black font-bold text-[0.78rem] px-5 py-2.5 rounded-full transition-all duration-200"
          >
            Launch App
          </button> */}
        </div>

        <button className="md:hidden text-white p-1.5" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-black/98 backdrop-blur-2xl border-b border-white/[0.08] px-5 pb-6 flex flex-col divide-y divide-white/[0.06]">
          {navLinks.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className="text-[#8e9191] hover:text-white transition-colors text-sm font-medium text-left py-4"
            >
              {item.label}
            </button>
          ))}
          {/* <button
            type="button"
            aria-disabled="true"
            className="mt-5 bg-[#bdf500] text-black font-bold py-4 rounded-full text-sm opacity-70 cursor-not-allowed"
          >
            Launch App
          </button> */}
        </div>
      )}
    </nav>
  );
}
