import Navbar from '../components/landing/Navbar';
import Hero from '../components/landing/Hero';
import StatsBar from '../components/landing/StatsBar';
import HowItWorks from '../components/landing/HowItWorks';
import Calculator from '../components/landing/Calculator';
import Corridors from '../components/landing/Corridors';
import WhyAlgorand from '../components/landing/WhyAlgorand';
import TrustSecurity from '../components/landing/TrustSecurity';
import Pricing from '../components/landing/Pricing';
import ComparisonTable from '../components/landing/ComparisonTable';
import FAQ from '../components/landing/FAQ';
import AppDownload from '../components/landing/AppDownload';
import Footer from '../components/landing/Footer';

export default function Landing() {
  return (
    <div className="min-h-screen bg-[var(--color-surface-3)] overflow-x-hidden">
      <Navbar />
      <Hero />
      <StatsBar />
      <HowItWorks />
      {/* <Calculator /> */}
      <Corridors />
      <WhyAlgorand />
      <TrustSecurity />
      {/* <Pricing /> */}
      <ComparisonTable />
      <FAQ />
      {/* <AppDownload /> */}
      <Footer />
    </div>
  );
}
