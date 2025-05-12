"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/app/components/ui/button";
import { CheckCircle, ArrowRight, ExternalLink, Sparkles } from "lucide-react";

const HeroSection: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="relative pt-32 pb-24 overflow-hidden">
      {/* Enhanced Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-levelin-50/30 opacity-80 z-0" />
      <div className="absolute inset-0 bg-[url('/hero-pattern.svg')] opacity-15 hero-bg-animation z-0" />

      {/* Animated gradient orbs */}
      <div className="absolute top-1/4 -left-64 w-96 h-96 rounded-full bg-gradient-to-r from-solana-purple/20 to-levelin-300/20 blur-3xl animate-blob" />
      <div className="absolute bottom-1/4 -right-64 w-96 h-96 rounded-full bg-gradient-to-l from-solana-green/20 to-levelin-200/20 blur-3xl animate-blob animation-delay-2000" />
      <div className="absolute top-3/4 left-1/3 w-64 h-64 rounded-full bg-gradient-to-tr from-levelin-400/10 to-solana-purple/10 blur-3xl animate-blob animation-delay-4000" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center">
          <div className="w-full lg:w-1/2 mb-16 lg:mb-0 lg:pr-12">
            {/* Badge */}
            <div className="inline-flex items-center rounded-full bg-levelin-100/80 backdrop-blur-sm px-3 py-1 mb-6 border border-levelin-200/50">
              <Sparkles className="h-4 w-4 text-levelin-600 mr-2" />
              <span className="text-sm font-medium text-levelin-700">
                Now in Public Beta
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 font-space-grotesk leading-tight">
              Prove Your{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-levelin-600 to-solana-purple animate-gradient-x">
                Expertise
              </span>
              ,{" "}
              <span className="relative inline-block">
                On-Chain
                <svg
                  className="absolute -bottom-4 left-0 w-full"
                  viewBox="0 0 200 12"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0,0 Q50,25 100,0 Q150,25 200,0"
                    fill="none"
                    stroke="url(#lineGradient)"
                    strokeWidth="5"
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient
                      id="lineGradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop offset="0%" stopColor="#796EF6" />
                      <stop offset="100%" stopColor="#99F6E4" />
                    </linearGradient>
                  </defs>
                </svg>
              </span>
            </h1>

            <p className="text-xl md:text-2xl mb-10 text-gray-700 dark:text-gray-300 max-w-xl leading-relaxed">
              The decentralized proof of work platform where professionals
              <span className="text-levelin-700 font-medium">
                {" "}
                build verifiable credentials
              </span>{" "}
              and
              <span className="text-levelin-700 font-medium">
                {" "}
                earn on-chain reputation
              </span>{" "}
              on Solana.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <a
                className="group relative overflow-hidden bg-gradient-to-r from-levelin-500 to-levelin-600 hover:from-levelin-600 hover:to-levelin-700 text-white px-8 py-4 rounded-2xl text-lg font-medium inline-flex items-center justify-center transition-all duration-300"
                href="https://web.levelin.fun"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="relative z-10 inline-flex items-center">
                  Try Beta{" "}
                  <ExternalLink className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              </a>

              <Button
                size="lg"
                variant="outline"
                className="border-2 border-levelin-300 text-levelin-600 hover:bg-levelin-100 px-8 py-4 rounded-2xl text-lg font-medium inline-flex items-center justify-center transition-all duration-300 group"
              >
                Learn More{" "}
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {[
                "Built on Solana Blockchain",
                "Domain-specific Reputation",
                "Peer-reviewed Challenges",
                "Immutable Credentials",
              ].map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center p-3 rounded-xl transition-all hover:bg-levelin-50 border border-transparent hover:border-levelin-100"
                >
                  <div className="h-10 w-10 rounded-lg bg-levelin-100 flex items-center justify-center mr-3">
                    <CheckCircle className="h-5 w-5 text-levelin-600" />
                  </div>
                  <span className="text-gray-700 font-medium">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full lg:w-1/2 flex justify-center">
            <div
              className={`relative transition-all duration-500 ${scrolled ? "translate-y-0 opacity-100" : "translate-y-4 opacity-95"}`}
            >
              {/* Enhanced UI element with 3D effect */}
              <div className="w-[340px] md:w-[480px] h-[340px] md:h-[480px] rounded-3xl bg-gradient-to-br from-white to-levelin-50 p-8 shadow-2xl backdrop-blur-card transform hover:scale-[1.02] transition-transform duration-500 relative overflow-hidden border border-levelin-200/20">
                {/* Glass reflection effect */}
                <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-white/40 to-transparent rounded-full opacity-30"></div>

                {/* Enhanced abstract patterns */}
                <div className="absolute inset-0">
                  <svg
                    width="100%"
                    height="100%"
                    viewBox="0 0 100 100"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <defs>
                      <pattern
                        id="grid"
                        width="8"
                        height="8"
                        patternUnits="userSpaceOnUse"
                        patternTransform="rotate(15)"
                      >
                        <path
                          d="M 8 0 L 0 0 0 8"
                          fill="none"
                          stroke="rgba(121, 110, 246, 0.08)"
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
                          stopColor="rgba(121, 110, 246, 0.25)"
                        />
                        <stop
                          offset="100%"
                          stopColor="rgba(153, 246, 228, 0.25)"
                        />
                      </linearGradient>
                      <filter
                        id="glow"
                        x="-50%"
                        y="-50%"
                        width="200%"
                        height="200%"
                      >
                        <feGaussianBlur stdDeviation="5" result="blur" />
                        <feComposite
                          in="SourceGraphic"
                          in2="blur"
                          operator="over"
                        />
                      </filter>
                    </defs>
                    <rect width="100" height="100" fill="url(#grid)" />
                    <circle
                      cx="50"
                      cy="50"
                      r="32"
                      fill="url(#grad1)"
                      filter="url(#glow)"
                      opacity="0.7"
                    />
                    <circle
                      cx="75"
                      cy="25"
                      r="15"
                      fill="rgba(121, 110, 246, 0.25)"
                      filter="url(#glow)"
                      opacity="0.5"
                    />
                    <circle
                      cx="25"
                      cy="75"
                      r="20"
                      fill="rgba(153, 246, 228, 0.25)"
                      filter="url(#glow)"
                      opacity="0.5"
                    />
                  </svg>
                </div>

                {/* Enhanced UI elements suggesting a platform interface */}
                <div className="relative z-10">
                  {/* Header with logo placeholder and nav */}
                  <div className="flex justify-between items-center mb-6">
                    <div className="w-32 h-8 bg-gradient-to-r from-levelin-500 to-levelin-600 rounded-lg opacity-80"></div>
                    <div className="flex gap-2">
                      <div className="w-8 h-8 rounded-full bg-white/40 border border-levelin-200/30 flex items-center justify-center">
                        <div className="w-4 h-4 rounded-full bg-levelin-400/50"></div>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-white/40 border border-levelin-200/30"></div>
                    </div>
                  </div>

                  {/* User profile section */}
                  <div className="flex gap-4 mb-8 p-4 rounded-xl bg-white/40 border border-levelin-200/30 backdrop-blur-md">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-levelin-300 to-levelin-500 p-0.5">
                      <div className="w-full h-full rounded-full bg-white/90 flex items-center justify-center">
                        <div className="w-8 h-8 rounded-full bg-levelin-400/50"></div>
                      </div>
                    </div>
                    <div className="flex-1 pt-1">
                      <div className="h-5 w-3/5 bg-levelin-500/30 rounded-md mb-2"></div>
                      <div className="h-4 w-4/5 bg-levelin-400/20 rounded-md mb-3"></div>
                      <div className="flex gap-2">
                        <div className="px-3 py-1 rounded-full bg-levelin-100/50 border border-levelin-200/30 text-xs text-levelin-700 font-medium">
                          Level 3
                        </div>
                        <div className="px-3 py-1 rounded-full bg-solana-purple/10 border border-solana-purple/20 text-xs text-solana-purple font-medium">
                          Developer
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Challenge cards */}
                  <div className="space-y-4">
                    {[1, 2, 3].map((item) => (
                      <div
                        key={item}
                        className="p-4 bg-white/40 rounded-xl border border-levelin-200/30 backdrop-blur-md hover:shadow-md transition-all duration-300 hover:bg-white/60 group"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="h-5 w-2/5 bg-levelin-500/30 rounded-md"></div>
                          <div className="h-6 w-6 rounded-full bg-levelin-100 flex items-center justify-center">
                            <div className="w-3 h-3 rounded-full bg-levelin-500"></div>
                          </div>
                        </div>
                        <div className="h-4 w-3/4 bg-levelin-400/20 rounded-md mb-3"></div>
                        <div className="flex justify-between items-center">
                          <div className="flex gap-2">
                            <div className="px-2 py-1 rounded-md bg-levelin-100/50 text-xs">
                              <div className="h-2 w-8 bg-levelin-400/30 rounded-full"></div>
                            </div>
                            <div className="px-2 py-1 rounded-md bg-levelin-100/50 text-xs">
                              <div className="h-2 w-6 bg-levelin-400/30 rounded-full"></div>
                            </div>
                          </div>
                          <div className="h-8 w-8 rounded-full bg-gradient-to-r from-levelin-400 to-levelin-500 opacity-60 group-hover:opacity-100 transition-opacity"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Enhanced Decorative elements */}
              <div
                className="absolute -top-8 -left-8 w-32 h-32 rounded-2xl bg-solana-green/10 backdrop-blur-md border border-solana-green/20 animate-float shadow-lg"
                style={{ animationDelay: "0.5s" }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-solana-green/5 to-transparent rounded-2xl overflow-hidden">
                  <svg width="100%" height="100%" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="30"
                      fill="rgba(153, 246, 228, 0.15)"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="20"
                      fill="rgba(153, 246, 228, 0.1)"
                    />
                  </svg>
                </div>
              </div>

              <div
                className="absolute -bottom-10 -right-10 w-40 h-40 rounded-2xl bg-solana-purple/10 backdrop-blur-md border border-solana-purple/20 animate-float shadow-lg"
                style={{ animationDelay: "1s" }}
              >
                <div className="absolute inset-0 bg-gradient-to-tl from-solana-purple/5 to-transparent rounded-2xl overflow-hidden">
                  <svg width="100%" height="100%" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="30"
                      fill="rgba(121, 110, 246, 0.15)"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="20"
                      fill="rgba(121, 110, 246, 0.1)"
                    />
                  </svg>
                </div>
              </div>

              <div
                className="absolute top-1/2 -right-14 transform -translate-y-1/2 w-24 h-24 rounded-full bg-levelin-400/10 backdrop-blur-md border border-levelin-400/20 animate-float shadow-lg"
                style={{ animationDelay: "1.5s" }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-levelin-400/5 to-transparent rounded-full overflow-hidden">
                  <svg width="100%" height="100%" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="30"
                      fill="rgba(121, 110, 246, 0.1)"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="20"
                      fill="rgba(121, 110, 246, 0.05)"
                    />
                  </svg>
                </div>
              </div>

              {/* Rust Code snippet decoration */}
              <div className="absolute -bottom-4 left-1/4 transform rotate-6 w-56 h-36 rounded-lg bg-gray-800/90 backdrop-blur-md border border-gray-700 shadow-lg overflow-hidden">
                <div className="p-3 text-xs font-mono">
                  <div className="text-blue-400">
                    use <span className="text-green-300">solana_program</span>::
                    <span className="text-gray-300">{"{"}</span>
                    <span className="text-yellow-300">
                      account_info::AccountInfo
                    </span>
                    , <span className="text-yellow-300">pubkey::Pubkey</span>
                    <span className="text-gray-300">{"}"}</span>;
                  </div>
                  <div className="text-purple-400 mt-1">
                    pub <span className="text-blue-400">fn</span>{" "}
                    <span className="text-yellow-300">verify_credential</span>
                    <span className="text-gray-300">(</span>
                  </div>
                  <div className="text-gray-300 ml-4">
                    <span className="text-orange-300">program_id</span>: &
                    <span className="text-blue-400">Pubkey</span>,
                  </div>
                  <div className="text-gray-300 ml-4">
                    <span className="text-orange-300">accounts</span>: &[
                    <span className="text-blue-400">AccountInfo</span>]
                  </div>
                  <div className="text-gray-300">
                    <span>)</span> -&#62;{" "}
                    <span className="text-blue-400">Result</span>
                    <span className="text-gray-300">{"<"}</span>
                    <span className="text-green-300">bool</span>,{" "}
                    <span className="text-purple-400">ProgramError</span>
                    <span className="text-gray-300">{">"}</span> {"{"}
                  </div>
                  <div className="text-gray-300 ml-4">
                    <span className="text-blue-400">Ok</span>
                    <span className="text-gray-300">(</span>
                    <span className="text-orange-300">true</span>
                    <span className="text-gray-300">)</span>
                  </div>
                  <div className="text-gray-300">{"}"}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trusted by section
        <div className="mt-20 text-center">
          <div className="w-full h-px bg-gradient-to-r from-transparent via-levelin-200/50 to-transparent mb-12"></div>
          <p className="text-gray-500 mb-6 text-sm font-medium tracking-wider">TRUSTED BY PROFESSIONALS FROM</p>
          <div className="flex flex-wrap justify-center items-center gap-10 opacity-60">
            <div className="h-6 w-24 bg-gray-400/20 rounded"></div>
            <div className="h-8 w-20 bg-gray-400/20 rounded"></div>
            <div className="h-6 w-28 bg-gray-400/20 rounded"></div>
            <div className="h-7 w-24 bg-gray-400/20 rounded"></div>
            <div className="h-6 w-20 bg-gray-400/20 rounded"></div>
          </div>
        </div> */}
      </div>
    </section>
  );
};

export default HeroSection;
