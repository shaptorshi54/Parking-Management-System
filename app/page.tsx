import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import FeaturedLots from "./components/FeaturedLots";
import HowItWorks from "./components/HowItWorks";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <FeaturedLots />
        <HowItWorks />
      </main>
      <Footer />
    </>
  );
}
