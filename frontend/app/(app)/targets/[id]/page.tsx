"use client";
import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { useTargetById } from "@/services/targetservice/query";
import { useSubmitTarget, useReviewSubmission } from "@/services/targetservice/mutation";
import { usePrivy } from "@privy-io/react-auth";

export default function TargetDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;
  const targetId = Array.isArray(id) ? id[0] : id || "";
  const { data, isLoading } = useTargetById(targetId);
  const { user } = usePrivy();
  const target = data?.data;
  const submissions = data?.submissions || [];
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionData, setSubmissionData] = useState({
    description: "",
    proof_url: "",
    media_urls: [""],
    notes: ""
  });
  
  const [reviewData, setReviewData] = useState({
    submissionId: "",
    feedback: "",
    status: "approved" as "approved" | "rejected"
  });
  
  const submitMutation = useSubmitTarget();
  const reviewMutation = useReviewSubmission();
  
  const isCreator = user?.id && target?.creator?.privy_id === user.id;
  const canSubmit = (target?.status === "created" || target?.status === "open") && !isCreator;
  const hasDeadlinePassed = target?.deadline && new Date(target.deadline) < new Date();
  
  const handleMediaUrlChange = (index: number, value: string) => {
    const newUrls = [...submissionData.media_urls];
    newUrls[index] = value;
    
    if (index === newUrls.length - 1 && value.trim() !== "") {
      newUrls.push("");
    }
    
    setSubmissionData(prev => ({
      ...prev,
      media_urls: newUrls
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitMutation.mutate({
      targetId,
      data: {
        ...submissionData,
        media_urls: submissionData.media_urls.filter(url => url.trim() !== "")
      }
    }, {
      onSuccess: () => {
        setIsSubmitting(false);
        setSubmissionData({
          description: "",
          proof_url: "",
          media_urls: [""],
          notes: ""
        });
      }
    });
  };
  
  const handleReview = (e: React.FormEvent) => {
    e.preventDefault();
    reviewMutation.mutate({
      submissionId: reviewData.submissionId,
      data: {
        feedback: reviewData.feedback,
        status: reviewData.status
      }
    });
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!target) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Target not found</h2>
          <button
            onClick={() => router.push("/targets")}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg"
          >
            Back to Targets
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      <motion.button
        onClick={() => router.back()}
        className="mb-8 flex items-center text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        aria-label="Back"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        Back to Targets
      </motion.button>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden p-8 mb-8 shadow-sm border border-gray-200 dark:border-gray-700"
      >
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-50">{target.title}</h1>
            <div className="flex items-center gap-3 mb-4">
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
              {target.domain && (
                <span className="px-3 py-1 bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 rounded-full text-xs font-medium">
                  {target.domain.name}
                </span>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="font-bold text-2xl text-primary flex items-center justify-end">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-primary" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-7.536 5.879a1 1 0 001.415 0 3 3 0 014.242 0 1 1 0 001.415-1.415 5 5 0 00-7.07 0 1 1 0 000 1.415z" clipRule="evenodd" />
              </svg>
              {target.token_amount} <span className="ml-1 text-lg font-medium text-gray-700 dark:text-gray-300">tokens</span>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1 flex items-center justify-end">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              {hasDeadlinePassed ? 
                <span className="text-red-500 dark:text-red-400">Deadline passed</span> : 
                <span>Deadline: {new Date(target.deadline).toLocaleDateString()}</span>
              }
            </div>
          </div>
        </div>
        
        <p className="mb-8 whitespace-pre-wrap text-gray-700 dark:text-gray-300 leading-relaxed">{target.description}</p>
        
        {target.media_urls && target.media_urls.length > 0 && (
          <div className="mb-8">
            <h3 className="font-semibold text-lg mb-3 text-gray-900 dark:text-gray-50">Media</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {target.media_urls.map((url: string, index: number) => (
                <a 
                  key={index} 
                  href={url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden shadow-sm border border-gray-200 dark:border-gray-600 hover:shadow-md transition-all"
                >
                  <img 
                    src={url} 
                    alt={`Media ${index + 1}`} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </a>
              ))}
            </div>
          </div>
        )}
        
        <div className="mb-8 p-6 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-lg mb-3 text-gray-900 dark:text-gray-50">Proof Requirements</h3>
          <div className="whitespace-pre-wrap text-gray-700 dark:text-gray-300 leading-relaxed">
            {target.proof_requirements}
          </div>
        </div>
        
        <div className="flex items-center p-5 bg-gray-50 dark:bg-gray-900/30 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <span className="inline-block border border-gray-200 dark:border-gray-600 rounded-full h-12 w-12 mr-3 overflow-hidden shadow-sm">
              {target.creator?.avatar_url ? (
                <img 
                  src={target.creator.avatar_url} 
                  alt={target.creator.name || 'Creator'} 
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="bg-primary/10 h-full w-full flex items-center justify-center text-primary font-medium">
                  {(target.creator?.name || 'C').charAt(0)}
                </div>
              )}
            </span>
            <div>
              <div className="font-medium text-gray-900 dark:text-gray-50">
                {target.creator?.name || 'Anonymous'}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Created {new Date(target.created_at).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      
      {canSubmit && !hasDeadlinePassed && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <button
            onClick={() => setIsSubmitting(!isSubmitting)}
            className="bg-primary text-primary-foreground px-5 py-2.5 rounded-lg hover:bg-primary/90 transition-colors font-medium shadow-sm"
          >
            {isSubmitting ? "Cancel" : "Submit Proof"}
          </button>
          
          {isSubmitting && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.3 }}
              className="mt-6 bg-white dark:bg-gray-800 p-7 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <h3 className="text-xl font-semibold mb-6 text-gray-900 dark:text-gray-50">Submit Your Proof</h3>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="description" className="block font-medium mb-2 text-gray-800 dark:text-gray-200">
                    Description*
                  </label>
                  <textarea
                    id="description"
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-3 min-h-[120px] bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary/30 focus:border-primary"
                    placeholder="Describe how you completed this target..."
                    value={submissionData.description}
                    onChange={(e) => setSubmissionData(prev => ({ ...prev, description: e.target.value }))}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="proof_url" className="block font-medium mb-2 text-gray-800 dark:text-gray-200">
                    Proof URL*
                  </label>
                  <input
                    id="proof_url"
                    type="url"
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary/30 focus:border-primary"
                    placeholder="URL to your proof (e.g. GitHub repo, video link)"
                    value={submissionData.proof_url}
                    onChange={(e) => setSubmissionData(prev => ({ ...prev, proof_url: e.target.value }))}
                    required
                  />
                </div>
                
                <div>
                  <label className="block font-medium mb-2 text-gray-800 dark:text-gray-200">
                    Media URLs (Optional)
                  </label>
                  <div className="space-y-3">
                    {submissionData.media_urls.map((url, index) => (
                      <input
                        key={index}
                        type="url"
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary/30 focus:border-primary"
                        placeholder="Enter media URL (image, video, etc.)"
                        value={url}
                        onChange={(e) => handleMediaUrlChange(index, e.target.value)}
                      />
                    ))}
                  </div>
                </div>
                
                <div>
                  <label htmlFor="notes" className="block font-medium mb-2 text-gray-800 dark:text-gray-200">
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    id="notes"
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-3 min-h-[100px] bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary/30 focus:border-primary"
                    placeholder="Any additional notes..."
                    value={submissionData.notes}
                    onChange={(e) => setSubmissionData(prev => ({ ...prev, notes: e.target.value }))}
                  />
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-primary text-primary-foreground px-5 py-2.5 rounded-lg hover:bg-primary/90 transition-colors font-medium disabled:opacity-50 shadow-sm"
                    disabled={submitMutation.isPending || !submissionData.description || !submissionData.proof_url}
                  >
                    {submitMutation.isPending ? "Submitting..." : "Submit"}
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </motion.div>
      )}
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h3 className="text-xl font-semibold mb-5 text-gray-900 dark:text-gray-50 flex items-center">
          Submissions 
          {submissions.length > 0 && (
            <span className="ml-2 px-2.5 py-1 text-xs bg-primary/10 text-primary rounded-full font-medium">{submissions.length}</span>
          )}
        </h3>
        
        {submissions.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center border border-gray-200 dark:border-gray-700 shadow-sm">
            <p className="text-gray-600 dark:text-gray-400">No submissions yet</p>
          </div>
        ) : (
          <div className="space-y-6">
            {submissions.map((submission: any) => (
              <div key={submission.id} className="bg-white dark:bg-gray-800 rounded-xl p-7 border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="flex justify-between items-start mb-5">
                  <div className="flex items-center">
                    <span className="inline-block border border-gray-200 dark:border-gray-600 rounded-full h-11 w-11 mr-3 overflow-hidden shadow-sm">
                      {submission.user?.avatar_url ? (
                        <img 
                          src={submission.user.avatar_url} 
                          alt={submission.user.name || 'User'} 
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="bg-primary/10 h-full w-full flex items-center justify-center text-primary font-medium">
                          {(submission.user?.name || 'U').charAt(0)}
                        </div>
                      )}
                    </span>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-gray-50">
                        {submission.user?.name || 'Anonymous'}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Submitted {new Date(submission.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    submission.status === "pending" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" :
                    submission.status === "approved" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" :
                    "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                  }`}>
                    {submission.status}
                  </span>
                </div>
                
                <p className="mb-5 whitespace-pre-wrap text-gray-700 dark:text-gray-300 leading-relaxed">{submission.description}</p>
                
                {submission.proof_url && (
                  <div className="mb-5 p-4 bg-gray-50 dark:bg-gray-900/30 rounded-lg border border-gray-200 dark:border-gray-700">
                    <h4 className="font-medium mb-2 text-gray-900 dark:text-gray-50">Proof</h4>
                    <a 
                      href={submission.proof_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline break-all flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                      {submission.proof_url}
                    </a>
                  </div>
                )}
                
                {submission.media_urls && submission.media_urls.length > 0 && (
                  <div className="mb-5">
                    <h4 className="font-medium mb-3 text-gray-900 dark:text-gray-50">Media</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {submission.media_urls.map((url: string, index: number) => (
                        <a 
                          key={index} 
                          href={url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="block aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden shadow-sm border border-gray-200 dark:border-gray-600 hover:shadow-md transition-all"
                        >
                          <img 
                            src={url} 
                            alt={`Media ${index + 1}`} 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
                
                {submission.notes && (
                  <div className="mb-5 p-4 bg-gray-50 dark:bg-gray-900/30 rounded-lg border border-gray-200 dark:border-gray-700">
                    <h4 className="font-medium mb-2 text-gray-900 dark:text-gray-50">Notes</h4>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{submission.notes}</p>
                  </div>
                )}
                
                {submission.reviews && submission.reviews.length > 0 && (
                  <div className="mt-6 pt-4 border-t">
                    <h4 className="font-medium mb-2">Review</h4>
                    {submission.reviews.map((review: any) => (
                      <div key={review.id} className="bg-gray-50 p-4 rounded">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-muted-foreground">
                            {new Date(review.created_at).toLocaleDateString()}
                          </span>
                          <span className={`px-2 py-1 rounded text-xs capitalize ${
                            review.status === "approved" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          }`}>
                            {review.status}
                          </span>
                        </div>
                        <p className="whitespace-pre-wrap">{review.feedback}</p>
                      </div>
                    ))}
                  </div>
                )}
                
                {isCreator && submission.status === "pending" && (
                  <div className="mt-6 pt-4 border-t">
                    <h4 className="font-medium mb-2">Review this submission</h4>
                    <form onSubmit={handleReview} className="space-y-4">
                      <div>
                        <label htmlFor="feedback" className="block font-medium mb-1">
                          Feedback*
                        </label>
                        <textarea
                          id="feedback"
                          className="w-full rounded-lg border px-4 py-2 min-h-[100px]"
                          placeholder="Provide feedback on this submission..."
                          value={reviewData.feedback}
                          onChange={(e) => setReviewData(prev => ({ ...prev, feedback: e.target.value, submissionId: submission.id }))}
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block font-medium mb-1">
                          Status*
                        </label>
                        <div className="flex gap-4">
                          <label className="flex items-center">
                            <input 
                              type="radio" 
                              name="status" 
                              value="approved"
                              checked={reviewData.status === "approved"}
                              onChange={() => setReviewData(prev => ({ ...prev, status: "approved" }))}
                              className="mr-2"
                            />
                            Approve
                          </label>
                          <label className="flex items-center">
                            <input 
                              type="radio" 
                              name="status" 
                              value="rejected"
                              checked={reviewData.status === "rejected"}
                              onChange={() => setReviewData(prev => ({ ...prev, status: "rejected" }))}
                              className="mr-2"
                            />
                            Reject
                          </label>
                        </div>
                      </div>
                      
                      <div className="flex justify-end">
                        <button
                          type="submit"
                          className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                          disabled={reviewMutation.isPending || !reviewData.feedback}
                        >
                          {reviewMutation.isPending ? "Submitting..." : "Submit Review"}
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
} 