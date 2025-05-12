"use client";
import Link from "next/link";
import { useUserTargets, useUserSubmissions } from "@/services/targetservice/query";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Target {
  id: string;
  title: string;
  description: string;
  token_amount: number;
  deadline: string;
  status: string;
  difficulty: string;
}

interface User {
  id: string;
  name: string;
  avatar_url: string;
}

interface Submission {
  id: string;
  target_id: string;
  description: string;
  status: string;
  created_at: string;
  reviews: Review[];
  target: Target;
  user: User;
}

interface Review {
  id: string;
  created_at: string;
  status: string;
  feedback: string;
  target: Target;
  user: User;
}

export default function UserTargetsPage() {
  const { data: targetsData, isLoading: isLoadingTargets } = useUserTargets();
  const { data: submissionsData, isLoading: isLoadingSubmissions } = useUserSubmissions();
  
  const targets = targetsData?.data || [];
  const submissions = submissionsData?.data || [];

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50">My Targets</h1>
        <Link 
          href="/new/target" 
          className="bg-primary text-primary-foreground px-5 py-2.5 rounded-lg hover:bg-primary/90 transition-colors font-medium shadow-sm"
        >
          Create Target
        </Link>
      </div>

      <Tabs defaultValue="targets" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="targets">My Targets</TabsTrigger>
          <TabsTrigger value="submissions">My Submissions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="targets">
          {isLoadingTargets ? (
            <div className="flex justify-center py-16">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
            </div>
          ) : targets.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700">
              <h3 className="text-xl font-medium mb-2">You haven&apos;t created any targets yet</h3>
              <p className="text-gray-600 dark:text-gray-400">Create your first target to start tracking your goals</p>
              <Link 
                href="/new/target" 
                className="mt-6 inline-block bg-primary text-primary-foreground px-5 py-2.5 rounded-lg hover:bg-primary/90 transition-colors font-medium shadow-sm"
              >
                Create Target
              </Link>
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
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="submissions">
          {isLoadingSubmissions ? (
            <div className="flex justify-center py-16">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
            </div>
          ) : submissions.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700">
              <h3 className="text-xl font-medium mb-2">You haven&apos;t submitted to any targets yet</h3>
              <p className="text-gray-600 dark:text-gray-400">Browse targets and submit your proofs</p>
              <Link 
                href="/targets" 
                className="mt-6 inline-block bg-primary text-primary-foreground px-5 py-2.5 rounded-lg hover:bg-primary/90 transition-colors font-medium shadow-sm"
              >
                Browse Targets
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {submissions.map((submission: Submission, index: number) => (
                <motion.div
                  key={submission.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Link href={`/targets/${submission.target_id}`} className="block">
                    <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 p-6 border border-gray-200 dark:border-gray-700 hover:border-primary/30 dark:hover:border-primary/30">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold text-xl mb-2 text-gray-900 dark:text-gray-50">{submission.target?.title}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Submitted on {new Date(submission.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          submission.status === "pending" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" :
                          submission.status === "approved" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" :
                          "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                        }`}>
                          {submission.status}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 dark:text-gray-400 mb-4">{submission.description}</p>
                      
                      {submission.reviews && submission.reviews.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                          <h4 className="text-lg font-medium mb-3 text-gray-900 dark:text-gray-50">Review</h4>
                          {submission.reviews.map((review: Review) => (
                            <div key={review.id} className="p-4 bg-gray-50 dark:bg-gray-900/30 rounded-lg border border-gray-200 dark:border-gray-700">
                              <div className="flex justify-between items-center mb-3">
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                  {new Date(review.created_at).toLocaleDateString()}
                                </span>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                  review.status === "approved" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" : 
                                  "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                                }`}>
                                  {review.status}
                                </span>
                              </div>
                              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{review.feedback}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
} 