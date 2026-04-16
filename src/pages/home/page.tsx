import { useEffect } from "react";
import i18n from "@/i18n";
import Navbar from "@/components/feature/Navbar";
import Footer from "@/components/feature/Footer";
import HeroSection from "./components/HeroSection";
import ServicesSection from "./components/ServicesSection";
import DataStreamsSection from "./components/DataStreamsSection";

const Home = () => {
  useEffect(() => {
    const lang = i18n.language;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
    const handler = (lng: string) => {
      document.documentElement.dir = lng === "ar" ? "rtl" : "ltr";
      document.documentElement.lang = lng;
    };
    i18n.on("languageChanged", handler);
    return () => { i18n.off("languageChanged", handler); };
  }, []);

  return (
    <div className="min-h-screen" style={{ background: "#060D1A", fontFamily: "Inter, Cairo, sans-serif" }}>
      <Navbar />
      <HeroSection />
      <ServicesSection type="core" />
      <ServicesSection type="extended" />
      <DataStreamsSection />
      <Footer />
    </div>
  );
};

export default Home;
