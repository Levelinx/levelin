"use client";
import { LeaderboardRow } from "@/components/widgets/LeaderboardRow";

const dummyLeaders = [
  { name: "Alice Johnson", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice", score: 1200 },
  { name: "Bob Lee", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob", score: 1100 },
  { name: "Carol Smith", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Carol", score: 950 },
  { name: "David Kim", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David", score: 900 },
];

export default function LeaderboardPage() {
  return (
    <div className="max-w-2xl mx-auto py-4">
      <h2 className="text-xl font-bold mb-4">Leaderboard</h2>
      <div className="rounded-lg border overflow-hidden bg-card">
        {dummyLeaders.map((u, i) => (
          <LeaderboardRow key={i} rank={i + 1} name={u.name} avatar={u.avatar} score={u.score} />
        ))}
      </div>
    </div>
  );
}