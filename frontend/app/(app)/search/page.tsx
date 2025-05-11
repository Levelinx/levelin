"use client";
import { useState } from "react";
import { UserCard } from "@/components/widgets/UserCard";
import { useSearchProfiles } from "@/services/profile/query";
import { UserCardSkeleton } from "@/components/widgets/ProfileSkeleton";
import { useDebounce } from "@/hooks/useDebounce";

interface Profile {
  id: string;
  name: string;
  avatar_url?: string;
  title?: string;
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 500);
  
  // Use the search profiles API
  const { 
    data: searchResults, 
    isLoading, 
    isError 
  } = useSearchProfiles(debouncedQuery);
  
  // Get profiles from search results
  const profiles = searchResults?.data || [];
  
  return (
    <div className="max-w-2xl mx-auto py-4">
      <input
        className="w-full rounded-lg border px-4 py-2 mb-4 focus:outline-none focus:ring"
        placeholder="Search users or challenges..."
        value={query}
        onChange={e => setQuery(e.target.value)}
      />
      
      <div className="space-y-2">
        {isLoading ? (
          // Loading state with skeletons
          Array.from({ length: 3 }).map((_, index) => (
            <UserCardSkeleton key={index} />
          ))
        ) : isError ? (
          // Error state
          <div className="text-center text-muted-foreground py-8">
            Error loading results. Please try again.
          </div>
        ) : !debouncedQuery ? (
          // Initial state
          <div className="text-center text-muted-foreground py-8">
            Start typing to search for users...
          </div>
        ) : profiles.length === 0 ? (
          // Empty results state
          <div className="text-center text-muted-foreground py-8">
            No results found for &quot;{debouncedQuery}&quot;.
          </div>
        ) : (
          // Results
          profiles.map((profile: Profile) => (
            <UserCard 
              key={profile.id}
              id={profile.id}
              name={profile.name}
              avatar={profile.avatar_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + profile.name}
              subtitle={profile.title || "User"}
            />
          ))
        )}
      </div>
    </div>
  );
}