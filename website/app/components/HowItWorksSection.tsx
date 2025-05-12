"use client";

import React, { useState, useEffect } from "react";
import {
  Check,
  ArrowRight,
  Wallet,
  Trophy,
  FileCheck,
  UserCheck,
  Award,
} from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Register & Join Domains",
    description:
      "Create your Levelin profile and join professional domains that match your expertise. Receive initial tokens to get started.",
    icon: <Wallet className="h-6 w-6 text-white" />,
    highlight: "Secure wallet authentication with Solana",
    color: "from-levelin-500 to-levelin-600",
    bgColor: "bg-levelin-50 dark:bg-levelin-900/30",
    borderColor: "border-levelin-400",
  },
  {
    number: "02",
    title: "Create & Accept Challenges",
    description:
      "Design skill-based challenges for yourself or accept challenges created by others. Each challenge requires staking tokens.",
    icon: <Trophy className="h-6 w-6 text-white" />,
    highlight: "Transparent token staking requirements",
    color: "from-solana-purple to-levelin-500",
    bgColor: "bg-solana-purple/5 dark:bg-solana-purple/20",
    borderColor: "border-solana-purple",
  },
  {
    number: "03",
    title: "Submit Your Work",
    description:
      "Complete the challenge and submit your work through the platform with references and proof of completion.",
    icon: <FileCheck className="h-6 w-6 text-white" />,
    highlight: "Submit work via URL or document references",
    color: "from-solana-green to-levelin-400",
    bgColor: "bg-solana-green/5 dark:bg-solana-green/20",
    borderColor: "border-solana-green",
  },
  {
    number: "04",
    title: "Receive Peer Reviews",
    description:
      "Experienced domain members review your submission. You need at least 5 reviews for challenge validation.",
    icon: <UserCheck className="h-6 w-6 text-white" />,
    highlight: "Reviewers need 600+ domain tokens to validate",
    color: "from-levelin-500 to-solana-purple",
    bgColor: "bg-levelin-50 dark:bg-levelin-900/30",
    borderColor: "border-levelin-400",
  },
  {
    number: "05",
    title: "Earn Reputation & Rewards",
    description:
      "Successfully validated challenges return your staked tokens plus rewards, building your domain reputation.",
    icon: <Award className="h-6 w-6 text-white" />,
    highlight: "All transactions and credentials stored on-chain",
    color: "from-solana-green to-levelin-400",
    bgColor: "bg-solana-green/5 dark:bg-solana-green/20",
    borderColor: "border-solana-green",
  },
];

const HowItWorksSection: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const section = document.getElementById("how-it-works");
      if (section) {
        const rect = section.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom >= 0;
        setIsInView(isVisible);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check initially

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isInView) {
      const timer = setInterval(() => {
        setActiveStep((prev) => (prev === steps.length - 1 ? 0 : prev + 1));
      }, 4000);

      return () => clearInterval(timer);
    }
  }, [isInView]);

  return (
    <section id="how-it-works" className="py-24 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-gray-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"></div>

      {/* Animated path */}
      <div className="absolute left-1/2 top-0 bottom-0 w-1 transform -translate-x-1/2 hidden lg:block">
        <div className="h-full w-full bg-gradient-to-b from-levelin-500/30 via-solana-purple/30 to-solana-green/30 rounded-full"></div>
        <div className="absolute left-0 top-0 w-full h-full">
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 2 800"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
          >
            <path
              d="M1,0 L1,800"
              stroke="url(#pathGradient)"
              strokeWidth="2"
              strokeDasharray="12 8"
              strokeLinecap="round"
            />
            <defs>
              <linearGradient
                id="pathGradient"
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#796EF6" />
                <stop offset="50%" stopColor="#796EF6" />
                <stop offset="100%" stopColor="#99F6E4" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-20">
          <div className="inline-flex items-center rounded-full bg-levelin-100/80 backdrop-blur-sm px-3 py-1 mb-6 border border-levelin-200/50">
            <span className="text-sm font-medium text-levelin-700">
              Simple Process
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold mb-6 font-space-grotesk">
            How{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-levelin-500 to-solana-purple">
              Levelin
            </span>{" "}
            Works
          </h2>

          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Our transparent, blockchain-based system makes it easy to prove your
            skills and build your professional reputation.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 max-w-6xl mx-auto relative">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`relative transition-all duration-500 ${activeStep === index ? "lg:scale-110 z-10" : "lg:scale-100 opacity-80"}`}
              onClick={() => setActiveStep(index)}
            >
              {/* Number circle with icon */}
              <div className="mx-auto mb-6 relative">
                <div
                  className={`w-16 h-16 rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center shadow-lg transform transition-transform duration-500 ${activeStep === index ? "scale-110" : "scale-100"}`}
                >
                  {step.icon}
                  <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center text-xs font-bold shadow-sm border border-gray-100 dark:border-gray-700">
                    {step.number.split("0")[1]}
                  </span>
                </div>

                {/* Connected line for desktop */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 left-full h-0.5 w-full transform -translate-y-1/2 -translate-x-4">
                    <div className="h-full w-full bg-gray-200 dark:bg-gray-700 relative">
                      <div
                        className={`absolute top-0 left-0 h-full bg-gradient-to-r ${step.color} transition-all duration-1000 ${activeStep > index ? "w-full" : "w-0"}`}
                      ></div>
                    </div>
                    <ArrowRight
                      className={`absolute top-1/2 right-0 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500 transition-opacity duration-500 ${activeStep > index ? "opacity-100" : "opacity-0"}`}
                    />
                  </div>
                )}
              </div>

              {/* Step content card */}
              <div
                className={`bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 transition-all duration-500 h-full flex flex-col ${activeStep === index ? "border-l-4 " + step.borderColor : ""}`}
              >
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4 flex-grow">
                  {step.description}
                </p>

                {/* Highlight tip */}
                <div
                  className={`${step.bgColor} rounded-lg p-4 transition-all duration-500`}
                >
                  <div className="flex items-start">
                    <Check className="h-5 w-5 text-levelin-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{step.highlight}</span>
                  </div>
                </div>
              </div>

              {/* Mobile connector line */}
              {index < steps.length - 1 && (
                <div className="h-8 w-0.5 bg-gray-200 dark:bg-gray-700 absolute left-1/2 -bottom-8 transform -translate-x-1/2 lg:hidden"></div>
              )}
            </div>
          ))}
        </div>

        {/* Progress indication dots for mobile */}
        <div className="flex justify-center mt-10 lg:hidden">
          {steps.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveStep(index)}
              className={`w-3 h-3 rounded-full mx-1.5 transition-all duration-300 ${
                activeStep === index
                  ? "bg-levelin-500 scale-125"
                  : "bg-gray-300 dark:bg-gray-600"
              }`}
              aria-label={`Go to step ${index + 1}`}
            />
          ))}
        </div>

        {/* Call to action */}
        <div className="mt-20 text-center">
          <a
            href="#"
            className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-levelin-500 to-levelin-600 text-white font-medium text-lg transition-transform hover:scale-105 hover:shadow-lg"
          >
            Start Your Journey <ArrowRight className="ml-2 h-5 w-5" />
          </a>
          <p className="text-gray-500 dark:text-gray-400 mt-4">
            Join over 5,000 professionals already building their on-chain
            reputation
          </p>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
