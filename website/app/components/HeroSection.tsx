"use client";

import React from "react";
import { Button } from "@/app/components/ui/button";
import { CheckCircle } from "lucide-react";

const HeroSection: React.FC = () => {
  return (
    <section className="relative pt-28 pb-20 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-hero-glow opacity-70 z-0" />
      <div className="absolute inset-0 bg-[url('/hero-pattern.svg')] opacity-10 hero-bg-animation z-0" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center">
          <div className="w-full lg:w-1/2 mb-12 lg:mb-0">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 font-space-grotesk">
              Prove Your Expertise,{" "}
              <span className="gradient-text">On-Chain</span>
            </h1>
            <p className="text-lg md:text-xl mb-8 text-gray-700 dark:text-gray-300 max-w-xl">
              Levelin is a decentralized proof of work platform on Solana where
              professionals prove expertise, earn reputation, and build
              verifiable credentials.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-10">
              <a
                className="bg-gradient-to-r from-levelin-500 to-levelin-600 hover:from-levelin-600 hover:to-levelin-700 text-white px-6 py-3 rounded-lg text-lg font-medium inline-block text-center"
                href="https://web.levelin.fun"
                target="_blank"
                rel="noopener noreferrer"
              >
                Try Beta
              </a>
              <Button
                size="lg"
                variant="outline"
                className="border-levelin-300 text-levelin-600 hover:bg-levelin-100"
              >
                Learn More
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                "Built on Solana Blockchain",
                "Domain-specific Reputation",
                "Peer-reviewed Challenges",
                "Immutable Credentials",
              ].map((feature, index) => (
                <div key={index} className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-levelin-500 mr-2" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full lg:w-1/2 flex justify-center">
            <div className="relative">
              {/* Abstract UI element instead of an image */}
              <div className="w-[320px] md:w-[450px] h-[320px] md:h-[450px] rounded-3xl bg-gradient-to-br from-levelin-200 to-levelin-100 p-6 shadow-xl backdrop-blur-card animate-float relative overflow-hidden">
                {/* Abstract patterns */}
                <div className="absolute inset-0 bg-white/5">
                  <svg
                    width="100%"
                    height="100%"
                    viewBox="0 0 100 100"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <defs>
                      <pattern
                        id="grid"
                        width="10"
                        height="10"
                        patternUnits="userSpaceOnUse"
                      >
                        <path
                          d="M 10 0 L 0 0 0 10"
                          fill="none"
                          stroke="rgba(121, 110, 246, 0.1)"
                          strokeWidth="0.5"
                        />
                      </pattern>
                      <linearGradient
                        id="grad1"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                      >
                        <stop
                          offset="0%"
                          stopColor="rgba(121, 110, 246, 0.3)"
                        />
                        <stop
                          offset="100%"
                          stopColor="rgba(153, 246, 228, 0.3)"
                        />
                      </linearGradient>
                    </defs>
                    <rect width="100" height="100" fill="url(#grid)" />
                    <circle
                      cx="50"
                      cy="50"
                      r="30"
                      fill="url(#grad1)"
                      opacity="0.7"
                    />
                    <circle
                      cx="70"
                      cy="30"
                      r="15"
                      fill="rgba(121, 110, 246, 0.3)"
                      opacity="0.5"
                    />
                    <circle
                      cx="30"
                      cy="70"
                      r="20"
                      fill="rgba(153, 246, 228, 0.3)"
                      opacity="0.5"
                    />
                  </svg>
                </div>

                {/* UI elements suggesting a platform interface */}
                <div className="relative z-10">
                  <div className="w-full h-8 mb-4 bg-white/10 rounded-lg"></div>
                  <div className="flex gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-white/20"></div>
                    <div className="flex-1 pt-1">
                      <div className="h-4 w-3/4 bg-white/20 rounded-md mb-2"></div>
                      <div className="h-3 w-1/2 bg-white/15 rounded-md"></div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-16 bg-white/10 rounded-lg"></div>
                    <div className="h-16 bg-white/10 rounded-lg"></div>
                    <div className="h-16 bg-white/10 rounded-lg"></div>
                  </div>
                  <div className="mt-6 flex justify-end">
                    <div className="h-8 w-24 bg-levelin-400/30 rounded-md"></div>
                  </div>
                </div>
              </div>

              {/* Decorative elements */}
              <div
                className="absolute -top-4 -left-4 w-24 h-24 rounded-xl bg-solana-green/10 backdrop-blur-card border border-solana-green/20 animate-float"
                style={{ animationDelay: "0.5s" }}
              ></div>
              <div
                className="absolute -bottom-6 -right-6 w-32 h-32 rounded-xl bg-solana-purple/10 backdrop-blur-card border border-solana-purple/20 animate-float"
                style={{ animationDelay: "1s" }}
              ></div>
              <div
                className="absolute top-1/2 -right-10 transform -translate-y-1/2 w-20 h-20 rounded-full bg-levelin-400/10 backdrop-blur-card border border-levelin-400/20 animate-float"
                style={{ animationDelay: "1.5s" }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
