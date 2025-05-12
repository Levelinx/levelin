"use client";
import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { useTargetById } from "@/services/target/query";
import { useSubmitTarget, useReviewSubmission } from "@/services/target/mutation";
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
    <div className="max-w-4xl mx-auto py-8 px-4">
      <motion.button
        onClick={() => router.back()}
        className="mb-6 flex items-center text-muted-foreground hover:text-primary transition"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        aria-label="Back"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        Back
      </motion.button>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-card rounded-lg overflow-hidden p-6 mb-8"
      >
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl font-bold mb-2">{target.title}</h1>
            <div className="flex items-center gap-3 mb-4">
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
              {target.domain && (
                <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs">
                  {target.domain.name}
                </span>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="font-bold text-lg">{target.token_amount} tokens</div>
            <div className="text-xs text-muted-foreground">
              {hasDeadlinePassed ? "Deadline passed" : `Deadline: ${new Date(target.deadline).toLocaleDateString()}`}
            </div>
          </div>
        </div>
        
        <p className="mb-6 whitespace-pre-wrap">{target.description}</p>
        
        {target.media_urls && target.media_urls.length > 0 && (
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Media</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {target.media_urls.map((url: string, index: number) => (
                <a 
                  key={index} 
                  href={url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block aspect-video bg-gray-100 rounded overflow-hidden"
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
        
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Proof Requirements</h3>
          <div className="bg-gray-50 p-4 rounded whitespace-pre-wrap">
            {target.proof_requirements}
          </div>
        </div>
        
        <div className="flex items-center">
          <div className="flex items-center">
            <span className="inline-block border rounded-full h-10 w-10 mr-2 overflow-hidden">
              {target.creator?.avatar_url ? (
                <img 
                  src={target.creator.avatar_url} 
                  alt={target.creator.name || 'Creator'} 
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="bg-primary/10 h-full w-full flex items-center justify-center text-primary">
                  {(target.creator?.name || 'C').charAt(0)}
                </div>
              )}
            </span>
            <div>
              <div className="font-medium">
                {target.creator?.name || 'Anonymous'}
              </div>
              <div className="text-xs text-muted-foreground">
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
            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
          >
            {isSubmitting ? "Cancel" : "Submit Proof"}
          </button>
          
          {isSubmitting && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.3 }}
              className="mt-4 bg-card p-6 rounded-lg"
            >
              <h3 className="text-lg font-semibold mb-4">Submit Your Proof</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="description" className="block font-medium mb-1">
                    Description*
                  </label>
                  <textarea
                    id="description"
                    className="w-full rounded-lg border px-4 py-2 min-h-[100px]"
                    placeholder="Describe how you completed this target..."
                    value={submissionData.description}
                    onChange={(e) => setSubmissionData(prev => ({ ...prev, description: e.target.value }))}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="proof_url" className="block font-medium mb-1">
                    Proof URL*
                  </label>
                  <input
                    id="proof_url"
                    type="url"
                    className="w-full rounded-lg border px-4 py-2"
                    placeholder="URL to your proof (e.g. GitHub repo, video link)"
                    value={submissionData.proof_url}
                    onChange={(e) => setSubmissionData(prev => ({ ...prev, proof_url: e.target.value }))}
                    required
                  />
                </div>
                
                <div>
                  <label className="block font-medium mb-1">
                    Media URLs (Optional)
                  </label>
                  <div className="space-y-2">
                    {submissionData.media_urls.map((url, index) => (
                      <input
                        key={index}
                        type="url"
                        className="w-full rounded-lg border px-4 py-2"
                        placeholder="Enter media URL (image, video, etc.)"
                        value={url}
                        onChange={(e) => handleMediaUrlChange(index, e.target.value)}
                      />
                    ))}
                  </div>
                </div>
                
                <div>
                  <label htmlFor="notes" className="block font-medium mb-1">
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    id="notes"
                    className="w-full rounded-lg border px-4 py-2 min-h-[80px]"
                    placeholder="Any additional notes..."
                    value={submissionData.notes}
                    onChange={(e) => setSubmissionData(prev => ({ ...prev, notes: e.target.value }))}
                  />
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
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
        <h3 className="text-xl font-semibold mb-4">Submissions {submissions.length > 0 && `(${submissions.length})`}</h3>
        
        {submissions.length === 0 ? (
          <div className="bg-card rounded-lg p-6 text-center">
            <p className="text-muted-foreground">No submissions yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {submissions.map((submission: any) => (
              <div key={submission.id} className="bg-card rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center">
                    <span className="inline-block border rounded-full h-10 w-10 mr-2 overflow-hidden">
                      {submission.user?.avatar_url ? (
                        <img 
                          src={submission.user.avatar_url} 
                          alt={submission.user.name || 'User'} 
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="bg-primary/10 h-full w-full flex items-center justify-center text-primary">
                          {(submission.user?.name || 'U').charAt(0)}
                        </div>
                      )}
                    </span>
                    <div>
                      <div className="font-medium">
                        {submission.user?.name || 'Anonymous'}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Submitted {new Date(submission.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs capitalize ${
                    submission.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                    submission.status === "approved" ? "bg-green-100 text-green-800" :
                    "bg-red-100 text-red-800"
                  }`}>
                    {submission.status}
                  </span>
                </div>
                
                <p className="mb-4 whitespace-pre-wrap">{submission.description}</p>
                
                {submission.proof_url && (
                  <div className="mb-4">
                    <h4 className="font-medium mb-1">Proof</h4>
                    <a 
                      href={submission.proof_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline break-all"
                    >
                      {submission.proof_url}
                    </a>
                  </div>
                )}
                
                {submission.media_urls && submission.media_urls.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-medium mb-1">Media</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {submission.media_urls.map((url: string, index: number) => (
                        <a 
                          key={index} 
                          href={url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="block aspect-video bg-gray-100 rounded overflow-hidden"
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
                  <div className="mb-4">
                    <h4 className="font-medium mb-1">Notes</h4>
                    <p className="text-muted-foreground whitespace-pre-wrap">{submission.notes}</p>
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