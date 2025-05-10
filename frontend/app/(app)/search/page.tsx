"use client";
import { useState } from "react";
import { UserCard } from "@/components/widgets/UserCard";

const dummyUsers = [
  { name: "Alice Johnson", avatar: "/images/avatar1.png", subtitle: "Solana Dev" },
  { name: "Bob Lee", avatar: "/images/avatar2.png", subtitle: "Rust Expert" },
  { name: "Carol Smith", avatar: "/images/avatar3.png", subtitle: "Smart Contract Auditor" },
  { name: "David Kim", avatar: "/images/avatar4.png", subtitle: "Frontend Wizard" },
];

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const filtered = dummyUsers.filter(u => u.name.toLowerCase().includes(query.toLowerCase()));
  return (
    <div className="max-w-2xl mx-auto py-4">
      <input
        className="w-full rounded-lg border px-4 py-2 mb-4 focus:outline-none focus:ring"
        placeholder="Search users or challenges..."
        value={query}
        onChange={e => setQuery(e.target.value)}
      />
      <div className="space-y-2">
        {filtered.map((u, i) => (
          <UserCard key={i} name={u.name} avatar={u.avatar} subtitle={u.subtitle} />
        ))}
        {filtered.length === 0 && <div className="text-center text-muted-foreground py-8">No results found.</div>}
      </div>
    </div>
  );
}