interface LeaderboardRowProps {
  rank: number;
  name: string;
  avatar: string;
  score: number;
  totalChallenges: number;
  successfulChallenges: number;
  failedChallenges: number;
  successRate: number;
}

export function LeaderboardRow({
  rank,
  name,
  avatar,
  score,
  totalChallenges,
  successfulChallenges,
  failedChallenges,
  successRate,
}: LeaderboardRowProps) {
  return (
    <div className="flex items-center gap-3 p-4 border-b hover:bg-muted/50 transition-colors">
      <div className="w-6 text-center font-bold text-muted-foreground">{rank}</div>
      <img src={avatar} alt={name} width={40} height={40} className="rounded-full" />
      <div className="flex-1">
        <div className="font-medium">{name}</div>
        <div className="flex gap-4 text-sm text-muted-foreground mt-1">
          <div className="flex items-center gap-1">
            <span className="font-medium text-foreground">{totalChallenges}</span>
            <span>challenges</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-green-500 font-medium">{successfulChallenges}</span>
            <span>success</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-red-500 font-medium">{failedChallenges}</span>
            <span>failed</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-medium text-foreground">{successRate}%</span>
            <span>success rate</span>
          </div>
        </div>
      </div>
      <div className="font-mono font-bold text-lg">{score}</div>
    </div>
  );
} 