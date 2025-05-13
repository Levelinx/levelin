"use client";

import React, { useState } from "react";
import {
  ChevronRight,
  Shield,
  Coins,
  Code,
  Zap,
  Clock,
  Leaf,
  CreditCard,
  BarChart3,
} from "lucide-react";
import solanaLogo from "../../public/images/solana-sol-logo.svg";

const techFeatures = [
  {
    icon: <Shield className="h-6 w-6 text-solana-purple" />,
    title: "Program Derived Addresses (PDAs)",
    description:
      "Secure account management using Solana's PDA system ensures data integrity and proper permissions across all platform operations.",
    color: "from-solana-purple/20 to-solana-purple/5",
    border: "border-solana-purple/30",
    highlight: "bg-solana-purple/10",
  },
  {
    icon: <Coins className="h-6 w-6 text-solana-green" />,
    title: "Token-based Reputation System",
    description:
      "Domain-specific reputation tokens that represent expertise levels and enable participation in the platform's governance and review processes.",
    color: "from-solana-green/20 to-solana-green/5",
    border: "border-solana-green/30",
    highlight: "bg-solana-green/10",
  },
  {
    icon: <Code className="h-6 w-6 text-levelin-500" />,
    title: "Smart Contract Architecture",
    description:
      "Built with the Anchor framework, providing a robust foundation for complex credential verification workflows and transparent challenge resolution.",
    color: "from-levelin-400/20 to-levelin-400/5",
    border: "border-levelin-400/30",
    highlight: "bg-levelin-400/10",
  },
];

const solanaFeatures = [
  {
    icon: <Zap className="h-5 w-5 text-white" />,
    text: "65,000+ TPS capability",
    color: "bg-solana-green",
    value: "65,000",
    unit: "TPS",
  },
  {
    icon: <Clock className="h-5 w-5 text-white" />,
    text: "~400ms block time",
    color: "bg-solana-purple",
    value: "400",
    unit: "ms",
  },
  {
    icon: <Leaf className="h-5 w-5 text-white" />,
    text: "Environmentally efficient Proof of History",
    color: "bg-levelin-500",
    value: "PoH",
    unit: "",
  },
  {
    icon: <CreditCard className="h-5 w-5 text-white" />,
    text: "Low transaction costs",
    color: "bg-solana-green",
    value: "0.00025",
    unit: "SOL",
  },
  {
    icon: <BarChart3 className="h-5 w-5 text-white" />,
    text: "Scalable dApp infrastructure",
    color: "bg-solana-purple",
    value: "∞",
    unit: "Scale",
  },
];

const TechnologySection: React.FC = () => {
  const [activeFeature, setActiveFeature] = useState(0);

  return (
    <section id="technology" className="py-24 relative overflow-hidden">
      {/* Background with improved gradient and pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"></div>

      {/* Circuit board pattern overlay */}
      <div className="absolute inset-0 bg-[url('/circuit-pattern.svg')] bg-repeat opacity-[0.03] dark:opacity-[0.05]"></div>

      {/* Large solana logo watermark */}
      <div className="absolute -right-64 top-1/2 transform -translate-y-1/2 w-[800px] h-[800px] opacity-[0.03] dark:opacity-[0.05] pointer-events-none">
        <div
          className="w-full h-full bg-contain bg-no-repeat bg-center"
          style={{ backgroundImage: "url('/solana-logo-large.svg')" }}
        ></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Left side content */}
          <div className="w-full lg:w-1/2">
            <div className="inline-flex items-center rounded-full bg-solana-purple/10 backdrop-blur-sm px-3 py-1 mb-6 border border-solana-purple/20">
              <span className="text-sm font-medium text-solana-purple">
                Powered by Blockchain
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold mb-6 font-space-grotesk">
              Built on{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-solana-purple to-solana-green">
                Solana
              </span>{" "}
              Blockchain
            </h2>

            <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 leading-relaxed">
              Levelin leverages Solana's high-performance blockchain technology
              to create a secure, transparent platform for professional
              credentials and reputation management.
            </p>

            <div className="space-y-6 relative">
              {/* Animated connector */}
              <div className="absolute left-8 top-16 bottom-16 w-0.5 bg-gradient-to-b from-solana-purple/30 via-solana-green/30 to-levelin-400/30 rounded-full"></div>

              {techFeatures.map((feature, index) => (
                <div
                  key={index}
                  className={`bg-white dark:bg-gray-800/90 backdrop-blur-sm rounded-xl p-6 border ${feature.border} shadow-lg transition-all duration-300 relative z-0 hover:shadow-xl cursor-pointer
                    ${activeFeature === index ? "translate-x-2" : "translate-x-0"}`}
                  onClick={() => setActiveFeature(index)}
                >
                  {/* Gradient background on hover/active */}
                  <div
                    className={`absolute inset-0 rounded-xl bg-gradient-to-br ${feature.color} opacity-0 transition-opacity duration-300 -z-10 ${activeFeature === index ? "opacity-100" : "hover:opacity-50"}`}
                  ></div>

                  {/* Active indicator */}
                  <div
                    className={`absolute -left-3 top-1/2 transform -translate-y-1/2 w-6 h-6 rounded-full ${feature.highlight} flex items-center justify-center transition-all duration-300 
                    ${activeFeature === index ? "opacity-100 scale-100" : "opacity-0 scale-0"}`}
                  >
                    <ChevronRight className="h-4 w-4 text-gray-800" />
                  </div>

                  <div className="flex items-start">
                    <div
                      className={`p-3 rounded-lg ${feature.highlight} mr-4 flex-shrink-0`}
                    >
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right side visualization */}
          <div className="w-full lg:w-1/2 flex justify-center">
            <div className="relative">
              {/* Main tech card with improved styling */}
              <div className="w-[420px] h-[480px] rounded-3xl bg-gradient-to-tr from-gray-900 via-gray-800 to-gray-900 backdrop-blur-lg border border-gray-700/50 shadow-2xl p-8 flex flex-col relative overflow-hidden">
                {/* Background circuit patterns */}
                <div className="absolute inset-0 opacity-20 bg-[url('/circuit-pattern.svg')] bg-repeat"></div>

                {/* Top glow */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-3/4 h-1/2 bg-solana-purple/20 rounded-full blur-3xl"></div>

                {/* Bottom glow */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3/4 h-1/2 bg-solana-green/20 rounded-full blur-3xl"></div>

                {/* Content */}
                <div className="relative z-10 flex-1 flex flex-col">
                  <div className="mb-8 flex justify-center">
                    <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
                      <img
                        src={solanaLogo.src}
                        alt="Solana Blockchain"
                        className="h-20 w-auto"
                      />
                    </div>
                  </div>

                  <h4 className="text-3xl font-bold mb-8 font-space-grotesk text-white text-center">
                    Technical Foundation
                  </h4>

                  <div className="space-y-4 flex-1">
                    {solanaFeatures.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-3 transition-all duration-300 hover:bg-white/10"
                      >
                        <div
                          className={`w-10 h-10 ${feature.color} rounded-full flex items-center justify-center mr-4 shadow-glow`}
                        >
                          {feature.icon}
                        </div>
                        <div className="flex-1">
                          <div className="text-white">{feature.text}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-mono font-bold text-white">
                            {feature.value}
                          </div>
                          <div className="text-xs text-gray-400">
                            {feature.unit}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Enhanced decorative elements */}
              <div
                className="absolute -top-10 -right-10 w-24 h-24 rounded-2xl bg-solana-green/20 backdrop-blur-lg border border-solana-green/30 shadow-lg animate-float"
                style={{ animationDelay: "0.7s" }}
              >
                <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-cover opacity-30"></div>
              </div>

              <div
                className="absolute -bottom-12 -left-12 w-32 h-32 rounded-2xl bg-solana-purple/20 backdrop-blur-lg border border-solana-purple/30 shadow-lg animate-float"
                style={{ animationDelay: "1.2s" }}
              >
                <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-cover opacity-30"></div>
              </div>

              {/* Code snippet decoration */}
              <div className="absolute -bottom-8 right-4 transform rotate-6 w-48 h-28 rounded-lg bg-gray-800/90 backdrop-blur-md border border-gray-700 shadow-lg overflow-hidden">
                <div className="p-3 text-xs font-mono">
                  <div className="text-blue-400">
                    async <span className="text-pink-400">fn</span>{" "}
                    <span className="text-yellow-300">verify_cred</span>
                    <span className="text-gray-300">(</span>
                    <span className="text-orange-300">ctx</span>
                    <span className="text-gray-300">)</span> &#123;
                  </div>
                  <div className="text-gray-300 ml-4">
                    <span className="text-pink-400">let</span>{" "}
                    <span className="text-blue-300">result</span> ={" "}
                    <span className="text-green-300">ctx</span>.
                    <span className="text-yellow-300">accounts</span>.
                    <span className="text-yellow-300">validate</span>&#40;&#41;;
                  </div>
                  <div className="text-green-300 ml-4">
                    <span className="text-purple-400">Ok</span>
                    <span className="text-gray-300">(</span>
                    <span className="text-orange-300">result</span>
                    <span className="text-gray-300">)</span>
                  </div>
                  <div className="text-gray-300">&#125;</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechnologySection;
