"use client";
import { useState } from "react";
import { PostCard } from "@/components/widgets/PostCard";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function NewPostPage() {
  const [content, setContent] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const dummyUser = {
    name: "Alice Johnson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice",
  };
  const router = useRouter();

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
        onSubmit={e => {
          e.preventDefault();
          setSubmitted(true);
        }}
        className="space-y-4"
      >
        <textarea
          className="w-full rounded-lg border px-4 py-3 min-h-[150px] focus:outline-none focus:ring-2 focus:ring-primary/50"
          placeholder="What's on your mind?"
          value={content}
          onChange={e => setContent(e.target.value)}
        />
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-primary text-primary-foreground rounded-lg px-6 py-2 font-semibold hover:bg-primary/90 transition"
            disabled={!content.trim()}
          >
            Post
          </button>
        </div>
      </form>
      {submitted && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-8"
        >
          <h3 className="font-semibold mb-4">Preview</h3>
          <PostCard
            name={dummyUser.name}
            avatar={dummyUser.avatar}
            content={content}
            date={new Date().toLocaleDateString()}
          />
        </motion.div>
      )}
    </motion.div>
  );
}
