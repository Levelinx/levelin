"use client";
import { useState } from "react";
import Link from "next/link";
import { useUserTargets, useUserSubmissions } from "@/services/target/query";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function UserTargetsPage() {
  const { data: targetsData, isLoading: isLoadingTargets } = useUserTargets();
  const { data: submissionsData, isLoading: isLoadingSubmissions } = useUserSubmissions();
  
  const targets = targetsData?.data || [];
  const submissions = submissionsData?.data || [];

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">My Targets</h1>
        <Link 
          href="/new/target" 
          className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
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
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : targets.length === 0 ? (
            <div className="text-center py-12 bg-card rounded-lg">
              <h3 className="text-lg font-medium">You haven't created any targets yet</h3>
              <p className="text-muted-foreground mt-2">Create your first target to start tracking your goals</p>
              <Link 
                href="/new/target" 
                className="mt-4 inline-block bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
              >
                Create Target
              </Link>
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
                          target.status === "open" ? "bg-green-100 text-green-800" :
                          target.status === "completed" ? "bg-blue-100 text-blue-800" :
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
                        <div>
                          <span className="font-medium">{target.token_amount}</span> tokens
                        </div>
                        
                        {target.deadline && (
                          <div className="text-xs text-muted-foreground">
                            Deadline: {new Date(target.deadline).toLocaleDateString()}
                          </div>
                        )}
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
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : submissions.length === 0 ? (
            <div className="text-center py-12 bg-card rounded-lg">
              <h3 className="text-lg font-medium">You haven't submitted to any targets yet</h3>
              <p className="text-muted-foreground mt-2">Browse targets and submit your proofs</p>
              <Link 
                href="/targets" 
                className="mt-4 inline-block bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
              >
                Browse Targets
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {submissions.map((submission: any, index: number) => (
                <motion.div
                  key={submission.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Link href={`/targets/${submission.target_id}`}>
                    <div className="bg-card rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold text-lg mb-1">{submission.target?.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            Submitted on {new Date(submission.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs capitalize ${
                          submission.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                          submission.status === "approved" ? "bg-green-100 text-green-800" :
                          "bg-red-100 text-red-800"
                        }`}>
                          {submission.status}
                        </span>
                      </div>
                      
                      <p className="text-sm line-clamp-2 mb-2">{submission.description}</p>
                      
                      {submission.reviews && submission.reviews.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <h4 className="text-sm font-medium mb-2">Review</h4>
                          {submission.reviews.map((review: any) => (
                            <div key={review.id} className="text-sm bg-gray-50 p-3 rounded">
                              <div className="flex justify-between mb-1">
                                <span className="text-xs text-muted-foreground">
                                  {new Date(review.created_at).toLocaleDateString()}
                                </span>
                                <span className={`px-2 py-0.5 rounded text-xs capitalize ${
                                  review.status === "approved" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                }`}>
                                  {review.status}
                                </span>
                              </div>
                              <p className="line-clamp-2">{review.feedback}</p>
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