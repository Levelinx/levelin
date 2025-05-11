"use client";
import { useState } from "react";
import { PostCard } from "@/components/widgets/PostCard";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useCreatePost } from "@/services/posts/mutation";
import { useMe } from "@/services/auth/query";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function NewPostPage() {
  const [content, setContent] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter();
  const { data: userData, isLoading: isLoadingUser } = useMe();
  const { mutate: createPost, isPending: isCreatingPost } = useCreatePost();
  
  // Extract user data from the API response
  const user = userData?.data?.[0];

  // Generate a fallback avatar using the user's name
  const getAvatarUrl = () => {
    if (!user) return "";
    
    // If user has a valid avatar URL that starts with http/https, use it
    if (user.avatar_url && (user.avatar_url.startsWith('https://') || user.avatar_url.startsWith('http://'))) {
      return user.avatar_url;
    }
    
    // Otherwise generate a fallback avatar
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.name)}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      toast.error("Please enter some content for your post");
      return;
    }

    // First show a preview
    if (!submitted) {
      setSubmitted(true);
      return;
    }

    // Then create the post on second submit
    createPost(
      { content },
      {
        onSuccess: () => {
          // Navigate back to home page after successful post creation
          router.push('/');
        }
      }
    );
  };

  // Show loading state while fetching user data
  if (isLoadingUser) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto py-8 px-4"
    >
      <motion.button
        onClick={() => router.back()}
        className="mb-4 flex items-center text-muted-foreground hover:text-primary transition"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        aria-label="Back"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        Back
      </motion.button>
      <h2 className="text-2xl font-bold mb-6">Create New Post</h2>
      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        <textarea
          className="w-full rounded-lg border px-4 py-3 min-h-[150px] focus:outline-none focus:ring-2 focus:ring-primary/50"
          placeholder="What's on your mind?"
          value={content}
          onChange={e => setContent(e.target.value)}
          disabled={isCreatingPost}
        />
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-primary text-primary-foreground rounded-lg px-6 py-2 font-semibold hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!content.trim() || isCreatingPost}
          >
            {isCreatingPost ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 inline animate-spin" />
                Creating...
              </>
            ) : submitted ? "Create Post" : "Preview"}
          </button>
        </div>
      </form>
      {submitted && !isCreatingPost && user && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-8"
        >
          <h3 className="font-semibold mb-4">Preview</h3>
          <PostCard
            name={user.name}
            avatar={getAvatarUrl()}
            content={content}
            date={new Date().toLocaleDateString()}
          />
          <p className="text-sm text-muted-foreground mt-4">
            Click &quot;Create Post&quot; to publish your post.
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
