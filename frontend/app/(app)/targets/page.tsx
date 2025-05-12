"use client";
import { useState } from "react";
import Link from "next/link";
import { useTargets } from "@/services/target/query";
import { motion } from "framer-motion";

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
    <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Targets</h1>
        <Link 
          href="/new/target" 
          className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
        >
          Create Target
        </Link>
      </div>

      <div className="mb-6 flex flex-wrap gap-4">
        <div>
          <label htmlFor="status-filter" className="block text-sm font-medium mb-1">Status</label>
          <select
            id="status-filter"
            className="rounded-md border border-gray-300 px-3 py-1"
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

        <div>
          <label htmlFor="difficulty-filter" className="block text-sm font-medium mb-1">Difficulty</label>
          <select
            id="difficulty-filter"
            className="rounded-md border border-gray-300 px-3 py-1"
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
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : targets.length === 0 ? (
        <div className="text-center py-12 bg-card rounded-lg">
          <h3 className="text-lg font-medium">No targets found</h3>
          <p className="text-muted-foreground mt-2">Try changing your filters or create a new target</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {targets.map((target: any, index: number) => (
            <motion.div
              key={target.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Link href={`/targets/${target.id}`}>
                <div className="bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow h-full p-6">
                  <div className="flex justify-between mb-3">
                    <span className={`px-2 py-1 rounded text-xs capitalize ${
                      target.status === "created" || target.status === "open" ? "bg-green-100 text-green-800" :
                      target.status === "accepted" ? "bg-emerald-100 text-emerald-800" :
                      target.status === "submitted" ? "bg-yellow-100 text-yellow-800" :
                      target.status === "reviewing" ? "bg-amber-100 text-amber-800" :
                      target.status === "completed" ? "bg-blue-100 text-blue-800" :
                      target.status === "finalized" ? "bg-indigo-100 text-indigo-800" :
                      target.status === "failed" ? "bg-red-100 text-red-800" :
                      "bg-gray-100 text-gray-800"
                    }`}>
                      {target.status}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs capitalize ${
                      target.difficulty === "beginner" ? "bg-green-100 text-green-800" :
                      target.difficulty === "intermediate" ? "bg-yellow-100 text-yellow-800" :
                      "bg-red-100 text-red-800"
                    }`}>
                      {target.difficulty}
                    </span>
                  </div>
                  <h3 className="font-semibold text-lg line-clamp-2 mb-2">{target.title}</h3>
                  <p className="text-muted-foreground text-sm line-clamp-3 mb-4">{target.description}</p>
                  
                  <div className="flex items-center justify-between text-sm mt-4">
                    <div className="flex items-center">
                      <span className="inline-block border rounded-full h-8 w-8 mr-2 overflow-hidden">
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
                      <span className="truncate max-w-[100px]">{target.creator?.name || 'Anonymous'}</span>
                    </div>
                    
                    <div>
                      <span className="font-medium">{target.token_amount}</span> tokens
                    </div>
                  </div>
                  
                  {target.deadline && (
                    <div className="text-xs text-muted-foreground mt-3">
                      Deadline: {new Date(target.deadline).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
} 