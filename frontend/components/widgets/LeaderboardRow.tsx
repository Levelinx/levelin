import Image from "next/image";

export function LeaderboardRow({
  rank,
  name,
  avatar,
  score,
}: {
  rank: number;
  name: string;
  avatar: string;
  score: number;
}) {
  return (
    <div className="flex items-center gap-3 p-2 border-b">
      <div className="w-6 text-center font-bold text-muted-foreground">{rank}</div>
      <Image src={avatar} alt={name} width={32} height={32} className="rounded-full" />
      <div className="flex-1">
        <div className="font-medium">{name}</div>
      </div>
      <div className="font-mono font-bold">{score}</div>
    </div>
  );
} 