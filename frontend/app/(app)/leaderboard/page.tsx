"use client";
import { LeaderboardRow } from "@/components/widgets/LeaderboardRow";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGetAllDomains } from "@/services/solana/query";
import { usePrivy } from "@privy-io/react-auth";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import Link from "next/link";

interface Leader {
  id: string;
  name: string;
  avatar: string;
  score: number;
  domain: string;
  totalChallenges: number;
  successfulChallenges: number;
  failedChallenges: number;
  successRate: number;
}

interface Domain {
  publicKey: string;
  name: string;
}

const dummyLeaders: Leader[] = [
  { 
    id: "user1",
    name: "Alice Johnson", 
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice", 
    score: 1200, 
    domain: "Web3",
    totalChallenges: 15,
    successfulChallenges: 12,
    failedChallenges: 3,
    successRate: 80
  },
  { 
    id: "user2",
    name: "Bob Lee", 
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob", 
    score: 1100, 
    domain: "AI",
    totalChallenges: 20,
    successfulChallenges: 15,
    failedChallenges: 5,
    successRate: 75
  },
  { 
    id: "user3",
    name: "Carol Smith", 
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Carol", 
    score: 950, 
    domain: "Web3",
    totalChallenges: 10,
    successfulChallenges: 8,
    failedChallenges: 2,
    successRate: 80
  },
  { 
    id: "user4",
    name: "David Kim", 
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David", 
    score: 900, 
    domain: "AI",
    totalChallenges: 18,
    successfulChallenges: 14,
    failedChallenges: 4,
    successRate: 78
  },
];

export default function LeaderboardPage() {
  const [selectedDomain, setSelectedDomain] = useState<string>("all");
  const [domainSearch, setDomainSearch] = useState("");
  const { user } = usePrivy();
  const { data: domainsData } = useGetAllDomains(user?.wallet?.address || "");

  const filteredLeaders = selectedDomain === "all" 
    ? dummyLeaders 
    : dummyLeaders.filter(leader => leader.domain === selectedDomain);

  const filteredDomains = domainsData?.domains.filter((domain: Domain) => 
    domain.name.toLowerCase().includes(domainSearch.toLowerCase())
  ) || [];

  return (
    <div className="max-w-2xl mx-auto py-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Leaderboard</h2>
        <div className="flex gap-2">
          <Select value={selectedDomain} onValueChange={setSelectedDomain}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select domain" />
            </SelectTrigger>
            <SelectContent>
              <div className="relative px-3 pb-2">
                <Input
                  placeholder="Search domains..."
                  value={domainSearch}
                  onChange={(e) => setDomainSearch(e.target.value)}
                  className="h-8 pl-8"
                />
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>
              <SelectItem value="all">All Domains</SelectItem>
              {filteredDomains.map((domain: Domain) => (
                <SelectItem key={domain.publicKey} value={domain.name}>
                  {domain.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="rounded-lg border overflow-hidden bg-card">
        {filteredLeaders.map((u, i) => (
          <Link href={`/profile/${u.id}`} key={i}>
            <LeaderboardRow 
              rank={i + 1} 
              name={u.name} 
              avatar={u.avatar} 
              score={u.score}
              totalChallenges={u.totalChallenges}
              successfulChallenges={u.successfulChallenges}
              failedChallenges={u.failedChallenges}
              successRate={u.successRate}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}