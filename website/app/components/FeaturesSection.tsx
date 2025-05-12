"use client";

import React from "react";
import {
  Shield,
  Star,
  Users,
  Code,
  LinkIcon,
  MessageSquare,
} from "lucide-react";

const features = [
  {
    icon: <Shield className="h-6 w-6 text-solana-purple" />,
    title: "Verifiable Credentials",
    description:
      "Build a portfolio of on-chain credentials that prove your expertise and are verifiable by anyone, anywhere.",
  },
  {
    icon: <Star className="h-6 w-6 text-solana-green" />,
    title: "Domain Reputation",
    description:
      "Earn reputation tokens in specific professional domains by completing challenges successfully.",
  },
  {
    icon: <Users className="h-6 w-6 text-levelin-400" />,
    title: "Peer Reviews",
    description:
      "Get your work validated through expert peer reviews, ensuring quality and credibility.",
  },
  {
    icon: <Code className="h-6 w-6 text-solana-purple" />,
    title: "Solana Blockchain",
    description:
      "Built on Solana for fast, low-cost transactions and secure, immutable record-keeping.",
  },
  {
    icon: <LinkIcon className="h-6 w-6 text-solana-green" />,
    title: "Challenge System",
    description:
      "Create and complete skill-based challenges to demonstrate your capabilities.",
  },
  {
    icon: <MessageSquare className="h-6 w-6 text-levelin-400" />,
    title: "Expert Feedback",
    description:
      "Receive valuable feedback from domain experts to continuously improve your skills.",
  },
];

const FeaturesSection: React.FC = () => {
  return (
    <section id="features" className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-space-grotesk">
            Why Choose <span className="gradient-text">Levelin</span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            A revolutionary platform that combines blockchain technology with
            professional development to create a new standard for expertise
            validation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700"
            >
              <div className="rounded-full bg-levelin-100 dark:bg-levelin-900 w-12 h-12 flex items-center justify-center mb-6">
                {feature.icon}
              </div>

              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
