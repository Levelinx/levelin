"use client";

import React, { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { useToast } from "@/app/hooks/use-toast";

const CTASection: React.FC = () => {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    // In a real app, this would submit to your API
    toast({
      title: "Thank you for joining our beta!",
      description: "We'll be in touch with next steps soon.",
    });

    setEmail("");
  };

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto rounded-3xl bg-gradient-to-r from-levelin-600/90 to-levelin-500 p-10 text-white shadow-xl relative overflow-hidden backdrop-blur-xl">
          {/* Background decorative pattern */}
          <div className="absolute inset-0 bg-[url('/hero-pattern.svg')] opacity-10"></div>

          {/* Glowing orbs */}
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-solana-purple/30 filter blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-solana-green/20 filter blur-3xl"></div>

          <div className="relative z-10 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-space-grotesk">
              Become a Beta Tester
            </h2>
            <p className="text-lg mb-8 text-white/90 max-w-2xl mx-auto">
              Be among the first to experience Levelin's platform. Sign up to
              get early access and help shape the future of decentralized
              professional reputation.
            </p>

            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/20 border-white/10 text-white placeholder:text-white/70 focus-visible:ring-white"
                required
              />
              <Button
                type="submit"
                className="bg-white text-levelin-600 hover:bg-white/90"
              >
                Get Started
              </Button>
            </form>

            <p className="mt-4 text-sm text-white/70">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
