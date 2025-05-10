"use client";
import { LeaderboardRow } from "@/components/widgets/LeaderboardRow";

const dummyLeaders = [
  { name: "Alice Johnson", avatar: "/images/avatar1.png", score: 1200 },
  { name: "Bob Lee", avatar: "/images/avatar2.png", score: 1100 },
  { name: "Carol Smith", avatar: "/images/avatar3.png", score: 950 },
  { name: "David Kim", avatar: "/images/avatar4.png", score: 900 },
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