import React from "react";
import Header from "@/app/components/Header";
import HeroSection from "@/app/components/HeroSection";
import FeaturesSection from "@/app/components/FeaturesSection";
import HowItWorksSection from "@/app/components/HowItWorksSection";
import TechnologySection from "@/app/components/TechnologySection";
import CTASection from "@/app/components/CTASection";
import Footer from "@/app/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-background relative overflow-hidden">
      {/* Dynamic background elements */}
      <div className="fixed inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none"></div>

      {/* Gradient blobs for visual interest */}
      <div className="fixed top-0 left-[20%] w-[500px] h-[500px] rounded-full bg-levelin-400/5 filter blur-[100px] pointer-events-none"></div>
      <div className="fixed bottom-0 right-[10%] w-[600px] h-[600px] rounded-full bg-solana-purple/5 filter blur-[120px] pointer-events-none"></div>
      <div className="fixed top-[40%] right-[30%] w-[400px] h-[400px] rounded-full bg-solana-green/5 filter blur-[80px] pointer-events-none"></div>

      {/* Main content */}
      <Header />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TechnologySection />
      <CTASection />
      <Footer />
    </div>
  );
}
