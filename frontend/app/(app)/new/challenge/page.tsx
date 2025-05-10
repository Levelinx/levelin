"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function NewChallengePage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("7"); // Default 7 days
  const [submitted, setSubmitted] = useState(false);
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
      <h2 className="text-2xl font-bold mb-6">Create New Challenge</h2>
      <form
        onSubmit={e => {
          e.preventDefault();
          setSubmitted(true);
        }}
        className="space-y-6"
      >
        <div className="space-y-2">
          <label htmlFor="title" className="block font-medium">
            Challenge Title
          </label>
          <input
            id="title"
            type="text"
            className="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
            placeholder="Enter challenge title"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="description" className="block font-medium">
            Description
          </label>
          <textarea
            id="description"
            className="w-full rounded-lg border px-4 py-3 min-h-[150px] focus:outline-none focus:ring-2 focus:ring-primary/50"
            placeholder="Describe your challenge..."
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="duration" className="block font-medium">
            Duration (days)
          </label>
          <select
            id="duration"
            className="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
            value={duration}
            onChange={e => setDuration(e.target.value)}
          >
            <option value="7">7 days</option>
            <option value="14">14 days</option>
            <option value="21">21 days</option>
            <option value="30">30 days</option>
          </select>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-primary text-primary-foreground rounded-lg px-6 py-2 font-semibold hover:bg-primary/90 transition"
            disabled={!title.trim() || !description.trim()}
          >
            Create Challenge
          </button>
        </div>
      </form>

      {submitted && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-8 bg-card rounded-lg p-6"
        >
          <h3 className="font-semibold mb-4">Challenge Preview</h3>
          <div className="space-y-4">
            <div>
              <h4 className="text-lg font-medium">{title}</h4>
              <p className="text-muted-foreground">{description}</p>
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{duration} days</span>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
