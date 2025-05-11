"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMe } from "@/services/auth/query";
import { useUpdateProfile } from "@/services/profile/mutation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, LogOut, ArrowLeft } from "lucide-react";
import { useLogout } from "@privy-io/react-auth";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useQueryClient } from "@tanstack/react-query";

export default function SettingsPage() {
  const router = useRouter();
  const { data: me } = useMe();
  const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfile();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name: me?.data?.[0]?.name || "",
    bio: me?.data?.[0]?.bio || "",
    avatar_url: me?.data?.[0]?.avatar_url || "",
    is_public: me?.data?.[0]?.is_public ?? true,
    date_of_birth: "",
  });
  const [isUploading, setIsUploading] = useState(false);

  // Format the date of birth when the component mounts or data changes
  useEffect(() => {
    if (me?.data?.[0]?.date_of_birth) {
      // Convert the date to the yyyy-MM-dd format required by the date input
      const dateObj = new Date(me.data[0].date_of_birth);
      if (!isNaN(dateObj.getTime())) {
        const formattedDate = dateObj.toISOString().split('T')[0]; // Get yyyy-MM-dd part
        setFormData(prev => ({
          ...prev,
          date_of_birth: formattedDate
        }));
      }
    }
  }, [me?.data]);

  const handleLogout = async () => {
    // Invalidate all queries before logging out
    queryClient.removeQueries();
    logout();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const fileType = file.type;
      const response = await fetch("/api/profiles/upload-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileType }),
      });
      const { url, path } = await response.json();

      await fetch(url, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": fileType },
      });

      setFormData((prev) => ({
        ...prev,
        avatar_url: path,
      }));
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(formData);
  };

  const { logout } = useLogout({ onSuccess: () => {
    toast.success("Logged out successfully");
    router.push("/signin");
  } });

  const handlePublicToggle = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      is_public: checked
    }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Ensure the date is in the correct format (yyyy-MM-dd)
    setFormData(prev => ({
      ...prev,
      date_of_birth: value
    }));
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="hover:bg-muted"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={formData.avatar_url} />
                <AvatarFallback>{formData.name?.[0]}</AvatarFallback>
              </Avatar>
              <div>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={isUploading}
                  className="w-full"
                />
                {isUploading && (
                  <div className="flex items-center gap-2 mt-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm text-muted-foreground">Uploading...</span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Name</label>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Date of Birth</label>
                <Input
                  type="date"
                  value={formData.date_of_birth}
                  onChange={handleDateChange}
                  placeholder="Your date of birth"
                  max={new Date().toISOString().split('T')[0]} // Prevent future dates
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Bio</label>
                <Textarea
                  value={formData.bio}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, bio: e.target.value }))
                  }
                  placeholder="Tell us about yourself"
                  rows={4}
                />
              </div>
            </div>

            <Button type="submit" disabled={isUpdating} className="w-full">
              {isUpdating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              variant="destructive"
              onClick={handleLogout}
              className="w-full"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Privacy Settings</CardTitle>
            <CardDescription>Control who can see your profile and content</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Public Profile</Label>
                <p className="text-sm text-muted-foreground">
                  When enabled, your profile will be visible to everyone
                </p>
              </div>
              <Switch
                checked={formData.is_public}
                onCheckedChange={handlePublicToggle}
              />
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
