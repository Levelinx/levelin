"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUpdateProfile } from "@/services/profile/mutation";
import { useGetUploadUrl } from "@/services/profile/mutation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { useMe } from "@/services/auth/query";
import { Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const steps = [
    {
        id: "name",
        title: "What's your name?",
        description: "This will be displayed on your profile",
    },
    {
        id: "bio",
        title: "Tell us about yourself",
        description: "A brief bio to help others know you better",
    },
    {
        id: "date_of_birth",
        title: "When were you born?",
        description: "Your date of birth helps us personalize your experience",
    },
    {
        id: "avatar",
        title: "Add a profile picture",
        description: "Upload a photo to personalize your profile",
    },
];

export default function Onboarding() {
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState({
        name: "",
        bio: "",
        date_of_birth: "",
        avatar_url: "",
    });
    const [isUploading, setIsUploading] = useState(false);

    const router = useRouter();
    const { data: me } = useMe();
    const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfile();
    const { mutate: getUploadUrl } = useGetUploadUrl();
    const supabase = createClient();
    // If user has completed profile, redirect to home
    if (me?.data?.[0] && me.data[0].name && me.data[0].bio && me.data[0].avatar_url && me.data[0].date_of_birth) {
        router.push("/");
        return null;
    }

    // Initialize form with existing data if available
    if (me?.data?.[0] && !formData.name && !formData.bio && !formData.avatar_url && !formData.date_of_birth) {
        setFormData({
            name: me.data[0].name || "",
            bio: me.data[0].bio || "",
            date_of_birth: me.data[0].date_of_birth || "",
            avatar_url: me.data[0].avatar_url || "",
        });
    }

    const handleNext = () => {
        if (currentStep === steps.length - 1) {
            // Ensure all required fields are present
            if (!formData.name || !formData.bio || !formData.date_of_birth || !formData.avatar_url) {
                return;
            }
            
            updateProfile(formData, {
                onSuccess: () => {
                    router.push("/");
                },
            });
        } else {
            setCurrentStep((prev) => prev + 1);
        }
    };

    const handleBack = () => {
        setCurrentStep((prev) => prev - 1);
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        getUploadUrl(file.type, {
            onSuccess: async (data) => {
                try {
                    // Upload to Supabase storage
                    const response = await fetch(data.uploadUrl, {
                        method: "PUT",
                        body: file,
                        headers: {
                            "Content-Type": file.type,
                        },
                    });

                    if (!response.ok) {
                        throw new Error("Upload failed");
                    }

                    // Get the public URL
                    const { data: publicUrl } = await supabase.storage
                        .from("objects")
                        .getPublicUrl(data.path);

                    setFormData((prev) => ({
                        ...prev,
                        avatar_url: publicUrl.publicUrl,
                    }));
                } catch (error) {
                    console.error("Upload failed:", error);
                } finally {
                    setIsUploading(false);
                }
            },
        });
    };

    const currentStepData = steps[currentStep];

    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="w-full max-w-md p-6">
                <div className="mb-8">
                    <div className="flex justify-between mb-2">
                        {steps.map((step, index) => (
                            <div
                                key={step.id}
                                className={`h-1 flex-1 mx-1 rounded-full ${
                                    index <= currentStep
                                        ? "bg-primary"
                                        : "bg-muted"
                                }`}
                            />
                        ))}
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        <h2 className="text-2xl font-bold mb-2">
                            {currentStepData.title}
                        </h2>
                        <p className="text-muted-foreground mb-6">
                            {currentStepData.description}
                        </p>

                        {currentStepData.id === "name" && (
                            <Input
                                placeholder="Enter your name"
                                value={formData.name}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        name: e.target.value,
                                    }))
                                }
                                className="mb-4"
                            />
                        )}

                        {currentStepData.id === "bio" && (
                            <Textarea
                                placeholder="Write a short bio..."
                                value={formData.bio}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        bio: e.target.value,
                                    }))
                                }
                                className="mb-4"
                            />
                        )}

                        {currentStepData.id === "date_of_birth" && (
                            <Input
                                type="date"
                                value={formData.date_of_birth}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        date_of_birth: e.target.value,
                                    }))
                                }
                                className="mb-4"
                            />
                        )}

                        {currentStepData.id === "avatar" && (
                            <div className="space-y-4">
                                <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    disabled={isUploading}
                                />
                                {isUploading && (
                                    <div className="flex items-center gap-2">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        <span>Uploading...</span>
                                    </div>
                                )}
                                {formData.avatar_url && (
                                    <div className="relative w-32 h-32 mx-auto">
                                        <img
                                            src={formData.avatar_url}
                                            alt="Profile preview"
                                            className="rounded-full w-full h-full object-cover"
                                        />
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="flex justify-between mt-6">
                            {currentStep > 0 && (
                                <Button
                                    variant="outline"
                                    onClick={handleBack}
                                    disabled={isUpdating}
                                >
                                    Back
                                </Button>
                            )}
                            <Button
                                onClick={handleNext}
                                disabled={
                                    isUpdating ||
                                    isUploading ||
                                    (currentStepData.id === "name" &&
                                        !formData.name) ||
                                    (currentStepData.id === "bio" &&
                                        !formData.bio) ||
                                    (currentStepData.id === "date_of_birth" &&
                                        !formData.date_of_birth) ||
                                    (currentStepData.id === "avatar" &&
                                        !formData.avatar_url)
                                }
                                className="ml-auto"
                            >
                                {isUpdating ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : currentStep === steps.length - 1 ? (
                                    "Complete"
                                ) : (
                                    "Next"
                                )}
                            </Button>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
