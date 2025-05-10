"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Copy, LogOut } from "lucide-react";
import { useState } from "react";

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
      id: 1,
      content: "Just completed my first smart contract! 🚀",
      timestamp: "2 hours ago",
    },
    {
      id: 2,
      content: "Exploring the world of Web3 development",
      timestamp: "1 day ago",
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
};

export default function ProfilePage() {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto py-4">
      <div className="relative mb-6">
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-0 top-0"
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
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="challenges">Challenges</TabsTrigger>
          <TabsTrigger value="holdings">Holdings</TabsTrigger>
        </TabsList>

        <TabsContent value="posts">
          <div className="space-y-4">
            {dummyUser.posts.map((post) => (
              <Card key={post.id}>
                <CardContent className="pt-6">
                  <p>{post.content}</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    {post.timestamp}
                  </p>
                </CardContent>
              </Card>
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
      </Tabs>
    </div>
  );
}