"use client";
import { motion } from "framer-motion";
import Link from "next/link";

export default function NewPage() {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="grid grid-cols-1 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          whileHover={{ scale: 1.02 }}
          className="bg-card rounded-xl shadow-lg overflow-hidden border border-gray-300"
        >
          <Link href="/new/post" className="block p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold">Create Post</h3>
                <p className="text-muted-foreground mt-1">Share your thoughts and ideas</p>
              </div>
            </div>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          whileHover={{ scale: 1.02 }}
          className="bg-card rounded-xl shadow-lg overflow-hidden border border-gray-300"
        >
          <Link href="/new/new-target" className="block p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold">Create Target</h3>
                <p className="text-muted-foreground mt-1">Set goals for yourself and earn tokens upon completion</p>
              </div>
            </div>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          whileHover={{ scale: 1.02 }}
          className="bg-card rounded-xl shadow-lg overflow-hidden border border-gray-300"
        >
          <Link href="/new/review" className="block p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 3l.938-1.878a1 1 0 011.428-.425L12 1l.633-.303a1 1 0 011.428.425L15 3l1.5.5a1 1 0 01.7 1.2l-.3 1.5 1.065 1.065a1 1 0 010 1.414L16.9 8.75l.3 1.5a1 1 0 01-.7 1.2L15 12l-.938 1.878a1 1 0 01-1.428.425L12 14l-.633.303a1 1 0 01-1.428-.425L9 12l-1.5-.5a1 1 0 01-.7-1.2l.3-1.5-1.065-1.065a1 1 0 010-1.414L7.1 5.25l-.3-1.5a1 1 0 01.7-1.2L9 3z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold">Review Submissions</h3>
                <p className="text-muted-foreground mt-1">Review others&apos; challenge submissions</p>
              </div>
            </div>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}