
import React from 'react';
import { Check } from 'lucide-react';

const steps = [
  {
    number: "01",
    title: "Register & Join Domains",
    description: "Create your Levelin profile and join professional domains that match your expertise. Receive initial tokens to get started."
  },
  {
    number: "02",
    title: "Create & Accept Challenges",
    description: "Design skill-based challenges for yourself or accept challenges created by others. Each challenge requires staking tokens."
  },
  {
    number: "03",
    title: "Submit Your Work",
    description: "Complete the challenge and submit your work through the platform with references and proof of completion."
  },
  {
    number: "04",
    title: "Receive Peer Reviews",
    description: "Experienced domain members review your submission. You need at least 5 reviews for challenge validation."
  },
  {
    number: "05",
    title: "Earn Reputation & Rewards",
    description: "Successfully validated challenges return your staked tokens plus rewards, building your domain reputation."
  }
];

const HowItWorksSection: React.FC = () => {
  return (
    <section id="how-it-works" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-space-grotesk">
            How <span className="gradient-text">Levelin</span> Works
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Our transparent, blockchain-based system makes it easy to prove your skills and build your professional reputation.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-10 max-w-3xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="relative flex">
              {/* Step number */}
              <div className="flex-none">
                <div className="bg-levelin-100 dark:bg-levelin-900 w-14 h-14 rounded-full flex items-center justify-center text-levelin-600 font-bold text-lg font-space-grotesk">
                  {step.number}
                </div>
                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className="h-full w-0.5 bg-levelin-200 dark:bg-levelin-800 absolute left-7 top-14 transform -translate-x-1/2"></div>
                )}
              </div>

              {/* Step content */}
              <div className="ml-6 pb-8">
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">{step.description}</p>
                
                {/* Display different highlight based on step number */}
                <div className="bg-levelin-50 dark:bg-levelin-900/50 rounded-lg p-4 border-l-4 border-levelin-400">
                  <div className="flex items-center">
                    <Check className="h-5 w-5 text-levelin-500 mr-2" />
                    <span className="text-sm">
                      {index === 0 && "Secure wallet authentication with Solana"}
                      {index === 1 && "Transparent token staking requirements"}
                      {index === 2 && "Submit work via URL or document references"}
                      {index === 3 && "Reviewers need 600+ domain tokens to validate"}
                      {index === 4 && "All transactions and credentials stored on-chain"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
