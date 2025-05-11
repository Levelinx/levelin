"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Copy, Trophy, Star, Zap, Target, Loader2, Cake } from "lucide-react";
import { useState } from "react";
import { Post, PostSkeleton } from "@/components/post";
import { useRouter } from "next/navigation";
import { useMe } from "@/services/auth/query";
import { useUserPosts } from "@/services/posts/query";
import { toast } from "sonner";

const dummyChallenges = [
  {
    id: 1,
    title: "Complete 5 Smart Contracts",
    progress: 3,
    total: 5,
  },
  {
    id: 2,
    title: "Earn 1000 Points",
    progress: 750,
    total: 1000,
  },
];

const dummyHoldings = [
  {
    token: "ETH",
    amount: 2.5,
    value: 5000,
  },
  {
    token: "USDC",
    amount: 1000,
    value: 1000,
  },
];

const dummyAchievements = [
  {
    id: 1,
    title: "Early Adopter",
    description: "Joined during the beta phase",
    icon: Star,
    unlockedAt: "2024-01-15",
    rarity: "rare",
  },
  {
    id: 2,
    title: "Challenge Master",
    description: "Completed 10 challenges",
    icon: Trophy,
    unlockedAt: "2024-02-20",
    rarity: "epic",
  },
  {
    id: 3,
    title: "Speed Demon",
    description: "Completed a challenge in under 24 hours",
    icon: Zap,
    unlockedAt: "2024-03-01",
    rarity: "legendary",
  },
  {
    id: 4,
    title: "Perfect Score",
    description: "Achieved 100% on a challenge",
    icon: Target,
    unlockedAt: "2024-03-15",
    rarity: "epic",
  },
];

export default function ProfilePage() {
  const [copied, setCopied] = useState(false);
  const router = useRouter();
  const { data: userData, isLoading } = useMe();
  
  // Extract user data from the API response
  const user = userData?.data?.[0];
  
  // Fetch user posts if user data is available
  const { 
    data: postsData, 
    isLoading: postsLoading, 
    isError: postsError 
  } = useUserPosts(user?.id || "");

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "rare":
        return "text-blue-500";
      case "epic":
        return "text-purple-500";
      case "legendary":
        return "text-yellow-500";
      default:
        return "text-muted-foreground";
    }
  };

  // Format date of birth to a readable format
  const formatDateOfBirth = (dateString: string | null) => {
    if (!dateString) return "Not provided";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Show loading state while fetching user data
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // If user data is not available, show a message
  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-muted-foreground">User profile not found</p>
      </div>
    );
  }

  // Define user stats (these would ideally come from the API in the future)
  const userStats = {
    challenges: 0,
    reviews: 0,
    reputation: 0,
  };

  return (
    <div className="max-w-2xl mx-auto py-4">
      <div className="relative mb-6">
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-0 top-0"
          onClick={() => router.push("/settings")}
        >
          <Settings className="h-5 w-5" />
        </Button>
      </div>

      {/* Profile Header */}
      <div className="flex items-center gap-6 mb-8">
        <Avatar className="h-24 w-24">
          <AvatarImage src={user.avatar_url || ""} />
          <AvatarFallback>{user.name ? user.name[0] : "U"}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{user.name}</h1>
          <div className="flex gap-4">
            <div>
              <span className="font-semibold">{userStats.challenges}</span>{" "}
              <span className="text-muted-foreground">challenges</span>
            </div>
            <div>
              <span className="font-semibold">{userStats.reviews}</span>{" "}
              <span className="text-muted-foreground">reviews</span>
            </div>
            <div>
              <span className="font-semibold">{userStats.reputation}</span>{" "}
              <span className="text-muted-foreground">reputation</span>
            </div>
          </div>
          {user.date_of_birth && (
            <div className="flex items-end gap-1 mt-2 text-muted-foreground text-sm">
              <Cake className="h-5 w-5" />
              <span>{formatDateOfBirth(user.date_of_birth)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Bio */}
      <div className="mb-8">
        <p className="text-muted-foreground">{user.bio || "No bio available"}</p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="posts" className="mb-8">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="challenges">Challenges</TabsTrigger>
          <TabsTrigger value="holdings">Holdings</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        <TabsContent value="posts">
          <div className="divide-y">
            {postsLoading ? (
              // Show skeletons while loading
              Array.from({ length: 3 }).map((_, i) => (
                <PostSkeleton key={i} />
              ))
            ) : postsError ? (
              // Error state
              <div className="py-4 text-center text-muted-foreground">
                Error loading posts. Please try again.
              </div>
            ) : !postsData?.data || postsData.data.length === 0 ? (
              // No posts state
              <div className="py-4 text-center text-muted-foreground">
                No posts available
              </div>
            ) : (
              // Display posts sorted by creation date (newest first)
              postsData.data
                .slice()
                .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                .map((post) => (
                  <Post key={post.id} post={post} />
                ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="challenges">
          <div className="space-y-4">
            {dummyChallenges.map((challenge) => (
              <Card key={challenge.id}>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2">{challenge.title}</h3>
                  <div className="w-full bg-secondary h-2 rounded-full">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{
                        width: `${(challenge.progress / challenge.total) * 100}%`,
                      }}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    {challenge.progress} / {challenge.total}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="holdings">
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">Balance</p>
                  <p className="text-2xl font-bold">$0.00</p>
                </div>
                <Button variant="outline" size="sm">
                  Add Funds
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-sm text-muted-foreground">
                  { user.solana_wallet || "No wallet connected"}
                </p>
                {(user.solana_wallet) && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      if (user.solana_wallet) {
                        copyToClipboard(user.solana_wallet);
                        toast.success("Copied to clipboard");
                      }
                    }}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            {dummyHoldings.map((holding) => (
              <Card key={holding.token}>
                <CardContent className="">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold">{holding.token}</p>
                      <p className="text-sm text-muted-foreground">
                        {holding.amount} (${holding.value})
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="achievements">
          <div className="grid grid-cols-2 gap-4">
            {dummyAchievements.map((achievement) => (
              <Card key={achievement.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <div
                      className={`p-2 rounded-full bg-secondary ${getRarityColor(
                        achievement.rarity
                      )}`}
                    >
                      <achievement.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{achievement.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {achievement.description}
                      </p>
                      <p
                        className={`text-xs mt-1 ${getRarityColor(
                          achievement.rarity
                        )}`}
                      >
                        {achievement.rarity}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}