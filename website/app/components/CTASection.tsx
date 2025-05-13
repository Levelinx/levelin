"use client";

import React, { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { useToast } from "@/app/hooks/use-toast";
import { ArrowRight, CheckCircle, Shield } from "lucide-react";

const CTASection: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      // In a real app, this would submit to your API
      toast({
        title: "Thank you for joining our beta!",
        description: "We'll be in touch with next steps soon.",
      });

      setEmail("");
      setIsSubmitting(false);
    }, 800);
  };

  return (
    <section className="py-24 relative">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50 to-white opacity-70"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto rounded-3xl bg-gradient-to-br from-levelin-600 to-levelin-500 p-12 text-white shadow-2xl relative overflow-hidden">
          {/* Enhanced background pattern */}
          <div className="absolute inset-0 bg-[url('/hero-pattern.svg')] opacity-15 mix-blend-overlay"></div>

          {/* Improved glowing orbs with animation */}
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-solana-purple/30 filter blur-3xl animate-pulse"></div>
          <div
            className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-solana-green/20 filter blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>

          {/* Small decorative elements */}
          <div className="absolute top-10 left-10 w-16 h-16 rounded-full border border-white/10 backdrop-blur-md"></div>
          <div className="absolute bottom-20 right-10 w-8 h-8 rounded-full border border-white/10 backdrop-blur-md"></div>

          <div className="relative z-10">
            {/* Improved header section */}
            <div className="text-center mb-12">
              <div className="inline-block rounded-full bg-white/10 px-4 py-1 backdrop-blur-md mb-4">
                <span className="text-white/90 text-sm font-medium">
                  Limited Beta Access
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 font-space-grotesk leading-tight">
                Join the <span className="text-solana-green">Future</span> of
                Web3 Reputation
              </h2>
              <p className="text-lg md:text-xl mb-0 text-white/90 max-w-2xl mx-auto leading-relaxed">
                Be among the first to experience Levelin's platform and help
                shape the future of decentralized professional reputation.
              </p>
            </div>

            {/* Enhanced form with better styling */}
            <form onSubmit={handleSubmit} className="max-w-md mx-auto mb-8">
              <div className="flex flex-col sm:flex-row gap-3 p-1.5 bg-white/10 rounded-full backdrop-blur-sm">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white/20 border-none rounded-full text-white placeholder:text-white/70 focus-visible:ring-white"
                  required
                />
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-white text-levelin-600 hover:bg-white/90 rounded-full font-medium transition-all duration-200 px-6"
                >
                  {isSubmitting ? (
                    "Processing..."
                  ) : (
                    <>
                      Get Started <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </form>

            {/* Trust indicators */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-white/80 text-sm max-w-lg mx-auto">
              <div className="flex items-center">
                <Shield className="h-4 w-4 mr-2" />
                <span>Your data is secure</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-2" />
                <span>Unsubscribe anytime</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-2" />
                <span>No spam, ever</span>
              </div>
            </div>
          </div>
        </div>

        {/* Social proof
        <div className="mt-12 text-center">
          <p className="text-gray-500 mb-4 text-sm font-medium">
            TRUSTED BY DEVELOPERS FROM
          </p>
          <div className="flex flex-wrap justify-center gap-8 opacity-70">
            <img
              src="/api/placeholder/120/40"
              alt="Company logo"
              className="h-8"
            />
            <img
              src="/api/placeholder/120/40"
              alt="Company logo"
              className="h-8"
            />
            <img
              src="/api/placeholder/120/40"
              alt="Company logo"
              className="h-8"
            />
            <img
              src="/api/placeholder/120/40"
              alt="Company logo"
              className="h-8"
            />
          </div>
        </div> */}
      </div>
    </section>
  );
};

export default CTASection;
