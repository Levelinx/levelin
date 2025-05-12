"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useCreateTarget } from "@/services/targetservice/mutation";
import { useDomains } from "@/services/domain/query";

export default function NewTargetPage() {
  const router = useRouter();
  const { mutate: createTarget, isPending } = useCreateTarget();
  const { data: domains } = useDomains();
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    domain_id: "",
    difficulty: "beginner" as "beginner" | "intermediate" | "advanced",
    proof_requirements: "",
    deadline: "",
    token_fee: 0,
    media_urls: [""]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Calculate deadline from today + days
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + parseInt(formData.deadline));
    
    createTarget({
      ...formData,
      deadline: deadline.toISOString(),
      media_urls: formData.media_urls.filter(url => url.trim() !== "")
    }, {
      onSuccess: () => {
        router.push("/targets");
      }
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "token_fee" ? parseFloat(value) : value
    }));
  };

  const handleMediaUrlChange = (index: number, value: string) => {
    const newUrls = [...formData.media_urls];
    newUrls[index] = value;
    
    // If we're editing the last item and it's not empty, add a new empty field
    if (index === newUrls.length - 1 && value.trim() !== "") {
      newUrls.push("");
    }
    
    setFormData(prev => ({
      ...prev,
      media_urls: newUrls
    }));
  };

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
      <h2 className="text-2xl font-bold mb-6">Create New Target</h2>
      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        <div className="space-y-2">
          <label htmlFor="title" className="block font-medium">
            Target Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            className="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
            placeholder="Enter target title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="description" className="block font-medium">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            className="w-full rounded-lg border px-4 py-3 min-h-[150px] focus:outline-none focus:ring-2 focus:ring-primary/50"
            placeholder="Describe your target in detail..."
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="domain_id" className="block font-medium">
            Domain
          </label>
          <select
            id="domain_id"
            name="domain_id"
            className="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
            value={formData.domain_id}
            onChange={handleChange}
            required
          >
            <option value="">Select a domain</option>
            {domains?.data?.map((domain: any) => (
              <option key={domain.id} value={domain.id}>
                {domain.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="difficulty" className="block font-medium">
            Difficulty
          </label>
          <select
            id="difficulty"
            name="difficulty"
            className="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
            value={formData.difficulty}
            onChange={handleChange}
            required
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="proof_requirements" className="block font-medium">
            Proof Requirements
          </label>
          <textarea
            id="proof_requirements"
            name="proof_requirements"
            className="w-full rounded-lg border px-4 py-3 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-primary/50"
            placeholder="Describe what proof will be required to complete this target..."
            value={formData.proof_requirements}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="token_fee" className="block font-medium">
            Token Fee
          </label>
          <input
            id="token_fee"
            name="token_fee"
            type="number"
            min="0"
            step="0.01"
            className="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
            placeholder="Amount of tokens to stake"
            value={formData.token_fee}
            onChange={handleChange}
            required
          />
          <p className="text-sm text-muted-foreground">You'll pay this amount to create this target. Successful completion will earn 1.5x this amount.</p>
        </div>

        <div className="space-y-2">
          <label htmlFor="deadline" className="block font-medium">
            Deadline (days)
          </label>
          <select
            id="deadline"
            name="deadline"
            className="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
            value={formData.deadline}
            onChange={handleChange}
            required
          >
            <option value="">Select a deadline</option>
            <option value="7">7 days</option>
            <option value="14">14 days</option>
            <option value="30">30 days</option>
            <option value="60">60 days</option>
            <option value="90">90 days</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="block font-medium">
            Media URLs (Optional)
          </label>
          <div className="space-y-2">
            {formData.media_urls.map((url, index) => (
              <input
                key={index}
                type="url"
                className="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Enter media URL (image, video, etc.)"
                value={url}
                onChange={(e) => handleMediaUrlChange(index, e.target.value)}
              />
            ))}
          </div>
          <p className="text-sm text-muted-foreground">Add URLs to images, videos, or other media to illustrate your target.</p>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-primary text-primary-foreground rounded-lg px-6 py-2 font-semibold hover:bg-primary/90 transition disabled:opacity-50"
            disabled={isPending || !formData.title || !formData.description || !formData.domain_id || 
              !formData.proof_requirements || formData.token_fee <= 0 || !formData.deadline}
          >
            {isPending ? "Creating..." : "Create Target"}
          </button>
        </div>
      </form>
    </motion.div>
  );
} 