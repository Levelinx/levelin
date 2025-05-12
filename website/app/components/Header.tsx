"use client";

import React, { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Menu, X } from "lucide-react";
import Link from "next/link";

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/30 backdrop-blur-xl border-b border-border/20 transition-all duration-300">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <img
            src="/images/logo2.0.png"
            alt="Levelin Logo"
            className="w-8 h-8"
          />
          <span className="font-space-grotesk font-bold text-xl">Levelin</span>
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center space-x-8">
          <a
            href="#features"
            className="text-sm font-medium hover:text-levelin-500 transition-colors"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            className="text-sm font-medium hover:text-levelin-500 transition-colors"
          >
            How It Works
          </a>
          <a
            href="#technology"
            className="text-sm font-medium hover:text-levelin-500 transition-colors"
          >
            Technology
          </a>
        </nav>

        <div className="hidden md:flex items-center">
          <a
            className="bg-gradient-to-r from-levelin-500 to-levelin-600 hover:from-levelin-600 hover:to-levelin-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            href="https://web.levelin.fun"
            target="_blank"
            rel="noopener noreferrer"
          >
            Try Beta
          </a>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 rounded-md hover:bg-levelin-100"
          onClick={toggleMenu}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-xl border-t border-border/20">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <a
              href="#features"
              className="p-2 hover:bg-levelin-100 rounded-md"
              onClick={toggleMenu}
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="p-2 hover:bg-levelin-100 rounded-md"
              onClick={toggleMenu}
            >
              How It Works
            </a>
            <a
              href="#technology"
              className="p-2 hover:bg-levelin-100 rounded-md"
              onClick={toggleMenu}
            >
              Technology
            </a>
            <div className="pt-2">
              <Button className="bg-gradient-to-r from-levelin-500 to-levelin-600 hover:from-levelin-600 hover:to-levelin-700 w-full">
                Try Beta
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
