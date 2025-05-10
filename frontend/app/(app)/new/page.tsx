"use client";
import { useState } from "react";
import { PostCard } from "@/components/widgets/PostCard";

export default function NewPage() {
  const [content, setContent] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const dummyUser = {
    name: "Alice Johnson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice",
  };
  return (
    <div className="max-w-2xl mx-auto py-4">
      <h2 className="text-xl font-bold mb-4">Create New Post</h2>
      <form
        onSubmit={e => {
          e.preventDefault();
          setSubmitted(true);
        }}
        className="space-y-4"
      >
        <textarea
          className="w-full rounded-lg border px-4 py-2 min-h-[100px] focus:outline-none focus:ring"
          placeholder="What's on your mind?"
          value={content}
          onChange={e => setContent(e.target.value)}
        />
        <button
          type="submit"
          className="w-full bg-primary text-primary-foreground rounded-lg py-2 font-semibold hover:bg-primary/90 transition"
          disabled={!content.trim()}
        >
          Post
        </button>
      </form>
      {submitted && (
        <div className="mt-8">
          <h3 className="font-semibold mb-2">Preview</h3>
          <PostCard
            name={dummyUser.name}
            avatar={dummyUser.avatar}
            content={content}
            date={new Date().toLocaleDateString()}
          />
        </div>
      )}
    </div>
  );
}