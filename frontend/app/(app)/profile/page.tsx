"use client";
import { UserCard } from "@/components/widgets/UserCard";

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
};

export default function ProfilePage() {
  return (
    <div className="max-w-2xl mx-auto py-4">
      <div className="flex flex-col items-center gap-2 mb-4">
        <img src={dummyUser.avatar} alt={dummyUser.name} className="w-24 h-24 rounded-full border-4 border-primary" />
        <div className="text-xl font-bold">{dummyUser.name}</div>
        <div className="text-muted-foreground">{dummyUser.subtitle}</div>
      </div>
      <div className="mb-6 text-center text-muted-foreground">{dummyUser.bio}</div>
      <div className="flex justify-around mb-8">
        <div className="flex flex-col items-center">
          <div className="font-bold text-lg">{dummyUser.stats.challenges}</div>
          <div className="text-xs text-muted-foreground">Challenges</div>
        </div>
        <div className="flex flex-col items-center">
          <div className="font-bold text-lg">{dummyUser.stats.reviews}</div>
          <div className="text-xs text-muted-foreground">Reviews</div>
        </div>
        <div className="flex flex-col items-center">
          <div className="font-bold text-lg">{dummyUser.stats.reputation}</div>
          <div className="text-xs text-muted-foreground">Reputation</div>
        </div>
      </div>
      <div className="rounded-lg border p-4 bg-card">
        <UserCard name={dummyUser.name} avatar={dummyUser.avatar} subtitle={dummyUser.subtitle} />
        <div className="mt-2 text-sm text-muted-foreground">Joined: Jan 2024</div>
      </div>
    </div>
  );
}