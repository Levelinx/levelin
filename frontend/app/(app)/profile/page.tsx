"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Copy, Trophy, Star, Zap, Target } from "lucide-react";
import { useState } from "react";
import { Post } from "@/components/post";
import { useRouter } from "next/navigation";

const dummyUser = {
  name: "Alice Johnson",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice",
  subtitle: "Solana Dev",
  bio: "Building on Solana. Love Rust and DeFi. Always up for a challenge!",
  stats: {
    challenges: 12,
    reviews: 8,
    reputation: 1500,
  },
  balance: 1250.50,
  walletAddress: "0x1234...5678",
  posts: [
    {
      id: "1",
      user: {
        id: "1",
        name: "Alice Johnson",
        avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice",
      },
      content: "Just completed my first smart contract! 🚀",
      created_at: "2024-03-20T10:00:00Z",
    },
    {
      id: "2",
      user: {
        id: "1",
        name: "Alice Johnson",
        avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice",
      },
      content: "Exploring the world of Web3 development",
      created_at: "2024-03-19T15:30:00Z",
    },
  ],
  challenges: [
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
  ],
  holdings: [
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
  ],
  achievements: [
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
  ],
};

export default function ProfilePage() {
  const [copied, setCopied] = useState(false);
  const router = useRouter();
  console.log(copied);

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
          <AvatarImage src={dummyUser.avatar} />
          <AvatarFallback>{dummyUser.name[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{dummyUser.name}</h1>
          <p className="text-muted-foreground mb-2">{dummyUser.subtitle}</p>
          <div className="flex gap-4">
            <div>
              <span className="font-semibold">{dummyUser.stats.challenges}</span>{" "}
              <span className="text-muted-foreground">challenges</span>
            </div>
            <div>
              <span className="font-semibold">{dummyUser.stats.reviews}</span>{" "}
              <span className="text-muted-foreground">reviews</span>
            </div>
            <div>
              <span className="font-semibold">{dummyUser.stats.reputation}</span>{" "}
              <span className="text-muted-foreground">reputation</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bio */}
      <div className="mb-8">
        <p className="text-muted-foreground">{dummyUser.bio}</p>
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
            {dummyUser.posts.map((post) => (
              <Post key={post.id} post={post} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="challenges">
          <div className="space-y-4">
            {dummyUser.challenges.map((challenge) => (
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
                  <p className="text-2xl font-bold">${dummyUser.balance}</p>
                </div>
                <Button variant="outline" size="sm">
                  Add Funds
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-sm text-muted-foreground">
                  {dummyUser.walletAddress}
                </p>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => copyToClipboard(dummyUser.walletAddress)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            {dummyUser.holdings.map((holding) => (
              <Card key={holding.token}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold">{holding.token}</p>
                      <p className="text-sm text-muted-foreground">
                        {holding.amount} tokens
                      </p>
                    </div>
                    <p className="font-semibold">${holding.value}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="achievements">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dummyUser.achievements.map((achievement) => (
              <Card key={achievement.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-lg bg-muted ${getRarityColor(achievement.rarity)}`}>
                      <achievement.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{achievement.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {achievement.description}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Unlocked on {new Date(achievement.unlockedAt).toLocaleDateString()}
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