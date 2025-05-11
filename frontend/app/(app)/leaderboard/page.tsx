"use client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGetAllDomains } from "@/services/solana/query";
import { usePrivy } from "@privy-io/react-auth";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

// interface Leader {
//   id: string;
//   name: string;
//   avatar: string;
//   score: number;
//   domain: string;
//   totalChallenges: number;
//   successfulChallenges: number;
//   failedChallenges: number;
//   successRate: number;
// }

interface Domain {
  publicKey: string;
  name: string;
}



export default function LeaderboardPage() {
  const [selectedDomain, setSelectedDomain] = useState<string>("all");
  const [domainSearch, setDomainSearch] = useState("");
  const { user } = usePrivy();
  const { data: domainsData } = useGetAllDomains(user?.wallet?.address || "");

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
        <div className="flex flex-col items-center justify-center py-20 px-6">
          <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-8">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
              <path d="M8.21 13.89 7 23l5-3 5 3-1.21-9.11" />
              <path d="M15 7a3 3 0 1 0-3.75 2.9" />
              <path d="M12 2v2" />
              <path d="M2 12h2" />
              <path d="M20 12h2" />
              <path d="m17.8 5.2-1.4 1.4" />
              <path d="m7.6 7.6-1.4-1.4" />
            </svg>
          </div>
          <h3 className="text-3xl font-bold mb-4">Leaderboard Coming Soon</h3>
          <p className="text-muted-foreground text-center max-w-md mb-8">
            We&apos;re working hard to bring you a competitive leaderboard that will showcase your achievements and help you track your progress.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-xl">
            {[
              { title: "Compete", description: "Compare your skills with others" },
              { title: "Track", description: "Monitor your progress over time" },
              { title: "Earn", description: "Gain recognition for your achievements" }
            ].map((feature, i) => (
              <div key={i} className="bg-muted/50 p-5 rounded-lg text-center">
                <h4 className="font-semibold mb-2">{feature.title}</h4>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 p-4 bg-muted/30 rounded-lg max-w-md w-full text-center">
            <p className="text-sm text-muted-foreground">Check back soon for updates or follow our social media channels for announcements</p>
          </div>
        </div>
      </div>
    </div>
  );
}