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
import { useUserTargets } from "@/services/target/query";
import Link from "next/link";

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
            <div className="text-center py-8 text-muted-foreground">
              No targets yet.
              {isOwnProfile && (
                <div className="mt-4">
                  <Link 
                    href="/new/target" 
                    className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    Create Target
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {targets.map((target: any) => (
                <Link href={`/targets/${target.id}`} key={target.id}>
                  <div className="bg-card rounded-lg p-4 hover:shadow-md transition-shadow h-full">
                    <div className="flex justify-between mb-2">
                      <span className={`px-2 py-1 rounded text-xs capitalize ${
                        target.status === "created" || target.status === "open" ? "bg-green-100 text-green-800" :
                        target.status === "accepted" ? "bg-emerald-100 text-emerald-800" :
                        target.status === "submitted" ? "bg-yellow-100 text-yellow-800" :
                        target.status === "reviewing" ? "bg-amber-100 text-amber-800" :
                        target.status === "completed" ? "bg-blue-100 text-blue-800" :
                        target.status === "finalized" ? "bg-indigo-100 text-indigo-800" :
                        target.status === "failed" ? "bg-red-100 text-red-800" :
                        "bg-gray-100 text-gray-800"
                      }`}>
                        {target.status}
                      </span>
                      <span className="text-sm">{target.token_amount} tokens</span>
                    </div>
                    <h3 className="font-semibold text-md mb-1 line-clamp-2">{target.title}</h3>
                    <p className="text-muted-foreground text-sm line-clamp-2 mb-2">{target.description}</p>
                    {target.deadline && (
                      <div className="text-xs text-muted-foreground mt-2">
                        Deadline: {new Date(target.deadline).toLocaleDateString()}
                      </div>
                    )}
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