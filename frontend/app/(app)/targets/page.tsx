"use client";
import { useState } from "react";
import Link from "next/link";
import { useTargets } from "@/services/targetservice/query";
import { motion } from "framer-motion";

interface Target {
  id: string;
  title: string;
  description: string;
  token_amount: number;
  status: string;
  difficulty: string;
  creator: {
    avatar_url: string;
    name: string;
  };
  deadline: string;
}

export default function TargetsPage() {
  const [filter, setFilter] = useState<{
    status?: "created" | "accepted" | "submitted" | "reviewing" | "completed" | "finalized" | "failed" | "open";
    difficulty?: "beginner" | "intermediate" | "advanced";
  }>({});
  
  const { data, isLoading } = useTargets(filter);
  const targets = data?.data || [];

  const handleFilterChange = (type: "status" | "difficulty", value: string | undefined) => {
    setFilter(prev => ({
      ...prev,
      [type]: value === "all" ? undefined : value
    }));
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50">Targets</h1>
        <Link 
          href="/new/new-target" 
          className="bg-primary text-primary-foreground px-5 py-2.5 rounded-lg hover:bg-primary/90 transition-colors font-medium shadow-sm"
        >
          Create Target
        </Link>
      </div>

      <div className="mb-8 flex flex-wrap gap-6">
        <div className="min-w-[180px]">
          <label htmlFor="status-filter" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Status</label>
          <select
            id="status-filter"
            className="w-full rounded-md border border-gray-300 dark:border-gray-700 px-3 py-2 bg-white dark:bg-gray-800 shadow-sm focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
            onChange={(e) => handleFilterChange("status", e.target.value)}
            value={filter.status || "all"}
          >
            <option value="all">All</option>
            <option value="created">Created</option>
            <option value="open">Open</option>
            <option value="accepted">Accepted</option>
            <option value="submitted">Submitted</option>
            <option value="reviewing">Reviewing</option>
            <option value="completed">Completed</option>
            <option value="finalized">Finalized</option>
            <option value="failed">Failed</option>
          </select>
        </div>

        <div className="min-w-[180px]">
          <label htmlFor="difficulty-filter" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Difficulty</label>
          <select
            id="difficulty-filter"
            className="w-full rounded-md border border-gray-300 dark:border-gray-700 px-3 py-2 bg-white dark:bg-gray-800 shadow-sm focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
            onChange={(e) => handleFilterChange("difficulty", e.target.value)}
            value={filter.difficulty || "all"}
          >
            <option value="all">All</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
        </div>
      ) : targets.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700">
          <h3 className="text-xl font-medium mb-2">No targets found</h3>
          <p className="text-muted-foreground">Try changing your filters or create a new target</p>
        </div>
      ) : (
        <div className="space-y-4">
          {targets.map((target: Target, index: number) => (
            <motion.div
              key={target.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Link href={`/targets/${target.id}`} className="block">
                <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 p-6 border border-gray-200 dark:border-gray-700 hover:border-primary/30 dark:hover:border-primary/30">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          target.status === "created" || target.status === "open" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" :
                          target.status === "accepted" ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400" :
                          target.status === "submitted" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" :
                          target.status === "reviewing" ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400" :
                          target.status === "completed" ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400" :
                          target.status === "finalized" ? "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400" :
                          target.status === "failed" ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" :
                          "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
                        }`}>
                          {target.status}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          target.difficulty === "beginner" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" :
                          target.difficulty === "intermediate" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" :
                          "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                        }`}>
                          {target.difficulty}
                        </span>
                      </div>
                      <h3 className="font-semibold text-xl mb-2 text-gray-900 dark:text-gray-50">{target.title}</h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-3">{target.description}</p>
                    </div>
                    <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-end gap-2">
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-primary" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-7.536 5.879a1 1 0 001.415 0 3 3 0 014.242 0 1 1 0 001.415-1.415 5 5 0 00-7.07 0 1 1 0 000 1.415z" clipRule="evenodd" />
                        </svg>
                        <span className="font-medium text-gray-900 dark:text-gray-100">{target.token_amount}</span>
                        <span className="text-gray-600 dark:text-gray-400 ml-1">tokens</span>
                      </div>

                      {target.deadline && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                          </svg>
                          Deadline: {new Date(target.deadline).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex items-center">
                      <span className="inline-block border rounded-full h-8 w-8 mr-2 overflow-hidden shadow-sm">
                        {target.creator?.avatar_url ? (
                          <img 
                            src={target.creator.avatar_url} 
                            alt={target.creator.name || 'User'} 
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="bg-primary/10 h-full w-full flex items-center justify-center text-primary">
                            {(target.creator?.name || 'U').charAt(0)}
                          </div>
                        )}
                      </span>
                      <span className="text-gray-700 dark:text-gray-300">{target.creator?.name || 'Anonymous'}</span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
} 