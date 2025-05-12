"use client";

import React, { useState } from "react";
import {
  Shield,
  Star,
  Users,
  Code,
  LinkIcon,
  MessageSquare,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

const features = [
  {
    icon: <Shield className="h-7 w-7 text-solana-purple" />,
    title: "Verifiable Credentials",
    description:
      "Build a portfolio of on-chain credentials that prove your expertise and are verifiable by anyone, anywhere.",
    highlightColor: "from-solana-purple/20 to-solana-purple/5",
    iconColor: "bg-solana-purple/10 border-solana-purple/20",
    accentColor: "bg-solana-purple",
  },
  {
    icon: <Star className="h-7 w-7 text-solana-green" />,
    title: "Domain Reputation",
    description:
      "Earn reputation tokens in specific professional domains by completing challenges successfully.",
    highlightColor: "from-solana-green/20 to-solana-green/5",
    iconColor: "bg-solana-green/10 border-solana-green/20",
    accentColor: "bg-solana-green",
  },
  {
    icon: <Users className="h-7 w-7 text-levelin-500" />,
    title: "Peer Reviews",
    description:
      "Get your work validated through expert peer reviews, ensuring quality and credibility.",
    highlightColor: "from-levelin-400/20 to-levelin-400/5",
    iconColor: "bg-levelin-400/10 border-levelin-400/20",
    accentColor: "bg-levelin-500",
  },
  {
    icon: <Code className="h-7 w-7 text-solana-purple" />,
    title: "Solana Blockchain",
    description:
      "Built on Solana for fast, low-cost transactions and secure, immutable record-keeping.",
    highlightColor: "from-solana-purple/20 to-solana-purple/5",
    iconColor: "bg-solana-purple/10 border-solana-purple/20",
    accentColor: "bg-solana-purple",
  },
  {
    icon: <LinkIcon className="h-7 w-7 text-solana-green" />,
    title: "Challenge System",
    description:
      "Create and complete skill-based challenges to demonstrate your capabilities.",
    highlightColor: "from-solana-green/20 to-solana-green/5",
    iconColor: "bg-solana-green/10 border-solana-green/20",
    accentColor: "bg-solana-green",
  },
  {
    icon: <MessageSquare className="h-7 w-7 text-levelin-500" />,
    title: "Expert Feedback",
    description:
      "Receive valuable feedback from domain experts to continuously improve your skills.",
    highlightColor: "from-levelin-400/20 to-levelin-400/5",
    iconColor: "bg-levelin-400/10 border-levelin-400/20",
    accentColor: "bg-levelin-500",
  },
];

const FeaturesSection: React.FC = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section id="features" className="py-24 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-gray-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"></div>

      {/* Decorative grid pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="h-full w-full"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0, 0, 0, 0.15) 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        ></div>
      </div>

      {/* Animated gradient blobs */}
      <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-gradient-to-br from-solana-purple/10 to-transparent blur-3xl opacity-70 animate-blob"></div>
      <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-gradient-to-br from-solana-green/10 to-transparent blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute top-1/3 right-1/4 w-64 h-64 rounded-full bg-gradient-to-br from-levelin-400/10 to-transparent blur-3xl opacity-50 animate-blob animation-delay-4000"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-20">
          <div className="inline-flex items-center rounded-full bg-levelin-100/80 backdrop-blur-sm px-3 py-1 mb-6 border border-levelin-200/50">
            <span className="text-sm font-medium text-levelin-700">
              Powerful Features
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold mb-6 font-space-grotesk">
            Why Choose{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-levelin-500 to-solana-purple">
              Levelin
            </span>
          </h2>

          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
            A revolutionary platform that combines blockchain technology with
            professional development to create a new standard for expertise
            validation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {features.map((feature, index) => (
            <div
              key={index}
              className="relative group"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Highlight effect when hovered */}
              <div
                className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.highlightColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 transform group-hover:scale-105 transition-transform`}
              ></div>

              {/* Main card */}
              <div className="bg-white dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700/50 h-full flex flex-col transition-all duration-500 hover:shadow-xl relative overflow-hidden z-0">
                {/* Top accent bar */}
                <div
                  className={`absolute top-0 left-0 right-0 h-1 ${feature.accentColor} transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500`}
                ></div>

                {/* Icon */}
                <div
                  className={`rounded-2xl ${feature.iconColor} w-16 h-16 flex items-center justify-center mb-6 border transition-all duration-300 group-hover:shadow-lg`}
                >
                  {feature.icon}
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6 flex-grow">
                  {feature.description}
                </p>

                {/* Interactive footer - only shows on hover */}
                <div className="flex items-center text-sm text-levelin-600 dark:text-levelin-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-auto">
                  <span className="mr-2 font-medium">Learn more</span>
                  <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Benefits summary */}
        <div className="mt-24 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800/50 dark:to-gray-900/50 rounded-3xl p-10 shadow-lg border border-gray-100 dark:border-gray-700/30 backdrop-blur-sm">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
            <div className="lg:w-1/2">
              <h3 className="text-3xl font-bold mb-6 font-space-grotesk">
                Unlock Your Professional Potential
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg">
                Join thousands of professionals who use Levelin to showcase
                their expertise, gain recognition, and connect with
                opportunities that match their verified skills.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  "Verified expertise",
                  "Global recognition",
                  "Skill-based matching",
                  "Continuous growth",
                ].map((benefit, idx) => (
                  <div key={idx} className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-levelin-500 mr-2 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-200">
                      {benefit}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:w-2/5 relative">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-700 relative z-10">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-levelin-100 flex items-center justify-center mr-3">
                    <Star className="h-5 w-5 text-levelin-600" />
                  </div>
                  <div>
                    <div className="font-bold">Level 5 Developer</div>
                    <div className="text-sm text-gray-500">
                      Blockchain Specialty
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-levelin-500 to-solana-purple w-4/5 rounded-full"></div>
                  </div>
                  <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-levelin-500 to-solana-purple w-3/5 rounded-full"></div>
                  </div>
                  <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-levelin-500 to-solana-purple w-3/4 rounded-full"></div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <div className="px-3 py-1 rounded-full bg-solana-purple/10 text-xs text-solana-purple border border-solana-purple/20">
                    Smart Contracts
                  </div>
                  <div className="px-3 py-1 rounded-full bg-solana-green/10 text-xs text-solana-green border border-solana-green/20">
                    DeFi
                  </div>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -top-4 -left-4 w-24 h-24 rounded-xl border border-levelin-200/30 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm -z-10"></div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-xl border border-levelin-200/30 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm -z-10"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
