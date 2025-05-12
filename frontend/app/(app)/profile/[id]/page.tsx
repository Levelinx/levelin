"use client";
import { usePrivy } from "@privy-io/react-auth";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Settings, ArrowLeft } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Post, PostSkeleton } from "@/components/post";
import { useProfile } from "@/services/profile/query";
import { useUserPosts } from "@/services/posts/query";
import { ProfileSkeleton } from "@/components/widgets/ProfileSkeleton";
import { useUserTargets } from "@/services/targetservice/query";
import Link from "next/link";

interface Target {
  id: string;
  title: string;
  description: string;
  token_amount: number;
  status: string;
  deadline: string;
  difficulty: string;
}

export default function ProfilePage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = usePrivy();
  const isOwnProfile = user?.wallet?.address === id;
  
  // Fetch real profile data
  const { data: profileData, isLoading: profileLoading } = useProfile(id as string);
  
  // Fetch user posts
  const { data: postsData, isLoading: postsLoading, isError: postsError } = useUserPosts(id as string);

  // Fetch user targets
  const { data: targetsData, isLoading: targetsLoading } = useUserTargets();
  const targets = targetsData?.data || [];

  // Show loading state while fetching profile data
  if (profileLoading || !profileData) {
    return <ProfileSkeleton />;
  }

  // Extract profile data
  const profile = profileData;

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="flex items-center gap-6 mb-8">
        {!isOwnProfile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}
        <Avatar className="h-24 w-24">
          <AvatarImage src={profile.avatar_url || ""} alt={profile.name} />
          <AvatarFallback>{profile.name ? profile.name[0] : "U"}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-bold">{profile.name}</h1>
          <div className="text-muted-foreground">{profile.title || "User"}</div>
          <div className="flex gap-4 mt-1 text-sm">
            <span><b>{targets.length || 0}</b> targets</span>
            <span><b>0</b> reviews</span>
            <span><b>0</b> reputation</span>
          </div>
          <p className="text-muted-foreground mt-2">{profile.bio || "No bio available"}</p>
        </div>
        {isOwnProfile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/settings")}
          >
            <Settings className="h-5 w-5" />
          </Button>
        )}
      </div>

      <Tabs defaultValue="posts" className="w-full mb-8">
        <TabsList className="mb-4 w-full grid grid-cols-4">
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="targets">Targets</TabsTrigger>
          <TabsTrigger value="holdings">Holdings</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>
        <TabsContent value="posts">
          <div className="divide-y">
            {postsLoading ? (
              // Show skeletons while loading
              Array.from({ length: 3 }).map((_, i) => (
                <PostSkeleton key={i} />
              ))
            ) : postsError ? (
              // Error state
              <div className="text-center py-8 text-muted-foreground">
                Failed to load posts. Please try again.
              </div>
            ) : postsData?.data?.length === 0 ? (
              // Empty state
              <div className="text-center py-8 text-muted-foreground">
                No posts yet.
              </div>
            ) : (
              // Display posts sorted by creation date (newest first)
              postsData?.data
                .slice()
                .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                .map((post) => (
                  <Post key={post.id} post={post} />
                ))
            )}
          </div>
        </TabsContent>
        <TabsContent value="targets">
          {targetsLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : targets.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700">
              <p className="text-gray-600 dark:text-gray-400">No targets yet.</p>
              {isOwnProfile && (
                <div className="mt-6">
                  <Link 
                    href="/new/target" 
                    className="bg-primary text-primary-foreground px-5 py-2.5 rounded-lg hover:bg-primary/90 transition-colors font-medium shadow-sm"
                  >
                    Create Target
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {targets.map((target: Target) => (
                <Link href={`/targets/${target.id}`} key={target.id} className="block">
                  <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 p-5 border border-gray-200 dark:border-gray-700 hover:border-primary/30 dark:hover:border-primary/30">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            target.status === "created" || target.status === "open" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" :
                            target.status === "accepted" ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400" :
                            target.status === "submitted" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" :
                            target.status === "reviewing" ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400" :
                            target.status === "completed" ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400" :
                            target.status === "finalized" ? "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400" :
                            target.status === "failed" ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" :
                            "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
                          }`}>
                            {target.status}
                          </span>
                        </div>
                        <h3 className="font-semibold text-lg mb-1 text-gray-900 dark:text-gray-50">{target.title}</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">{target.description}</p>
                      </div>
                      <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-end gap-2">
                        <div className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-primary" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-7.536 5.879a1 1 0 001.415 0 3 3 0 014.242 0 1 1 0 001.415-1.415 5 5 0 00-7.07 0 1 1 0 000 1.415z" clipRule="evenodd" />
                          </svg>
                          <span className="font-medium text-gray-900 dark:text-gray-100">{target.token_amount}</span>
                          <span className="text-gray-600 dark:text-gray-400 ml-1">tokens</span>
                        </div>
                        
                        {target.deadline && (
                          <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                            </svg>
                            Deadline: {new Date(target.deadline).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="holdings">
          <div className="text-center text-muted-foreground">No holdings yet.</div>
        </TabsContent>
        <TabsContent value="achievements">
          <div className="text-center text-muted-foreground">No achievements yet.</div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 