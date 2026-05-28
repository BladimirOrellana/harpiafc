import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import MisionSection from "./components/MisionSection";
import FundadoresSection from "./components/FundadoresSection";
import PasalaProSection from "./components/PasalaProSection";
import PatrocinadoresSection from "./components/PatrocinadoresSection";
import CtaSection from "./components/CtaSection";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <MisionSection />
      <FundadoresSection />
      <PasalaProSection />
      <PatrocinadoresSection />
      <CtaSection />
      <Footer />
    </main>
  );
}
