"use client";

import React from "react";

const TechnologySection: React.FC = () => {
  return (
    <section id="technology" className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center">
          <div className="w-full lg:w-1/2 mb-12 lg:mb-0">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-space-grotesk">
              Built on <span className="gradient-text">Solana</span> Blockchain
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
              Levelin leverages Solana's high-performance blockchain technology
              to create a secure, transparent platform for professional
              credentials and reputation management.
            </p>

            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <h3 className="font-bold mb-2">
                  Program Derived Addresses (PDAs)
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Secure account management using Solana's PDA system ensures
                  data integrity and proper permissions across all platform
                  operations.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <h3 className="font-bold mb-2">
                  Token-based Reputation System
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Domain-specific reputation tokens that represent expertise
                  levels and enable participation in the platform's governance
                  and review processes.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <h3 className="font-bold mb-2">Smart Contract Architecture</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Built with the Anchor framework, providing a robust foundation
                  for complex credential verification workflows and transparent
                  challenge resolution.
                </p>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-1/2 flex justify-center">
            <div className="relative">
              <div className="w-[400px] h-[400px] rounded-3xl bg-gradient-to-tr from-solana-purple/20 to-solana-green/20 backdrop-blur-lg border border-white/20 shadow-xl p-8 flex items-center justify-center">
                <div className="text-center">
                  <div className="mb-6">
                    <img
                      src="/placeholder.svg"
                      alt="Solana Blockchain"
                      className="h-24 mx-auto"
                    />
                  </div>
                  <h4 className="text-2xl font-bold mb-3 font-space-grotesk">
                    Technical Foundation
                  </h4>
                  <ul className="text-left space-y-3">
                    <li className="flex items-center">
                      <span className="w-3 h-3 rounded-full bg-solana-green mr-2"></span>
                      <span>65,000+ TPS capability</span>
                    </li>
                    <li className="flex items-center">
                      <span className="w-3 h-3 rounded-full bg-solana-purple mr-2"></span>
                      <span>~400ms block time</span>
                    </li>
                    <li className="flex items-center">
                      <span className="w-3 h-3 rounded-full bg-levelin-400 mr-2"></span>
                      <span>Environmentally efficient Proof of History</span>
                    </li>
                    <li className="flex items-center">
                      <span className="w-3 h-3 rounded-full bg-solana-green mr-2"></span>
                      <span>Low transaction costs</span>
                    </li>
                    <li className="flex items-center">
                      <span className="w-3 h-3 rounded-full bg-solana-purple mr-2"></span>
                      <span>Scalable dApp infrastructure</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Decorative elements */}
              <div
                className="absolute -top-5 -right-5 w-20 h-20 rounded-full bg-solana-green/20 backdrop-blur-lg animate-float"
                style={{ animationDelay: "0.7s" }}
              ></div>
              <div
                className="absolute -bottom-8 -left-8 w-28 h-28 rounded-full bg-solana-purple/20 backdrop-blur-lg animate-float"
                style={{ animationDelay: "1.2s" }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechnologySection;
