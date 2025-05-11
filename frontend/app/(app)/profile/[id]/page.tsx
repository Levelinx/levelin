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

export default function ProfilePage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = usePrivy();
  const isOwnProfile = user?.wallet?.address === id;
  
  // Fetch real profile data
  const { data: profileData, isLoading: profileLoading } = useProfile(id as string);
  
  // Fetch user posts
  const { data: postsData, isLoading: postsLoading, isError: postsError } = useUserPosts(id as string);

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
            <span><b>0</b> challenges</span>
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
          <TabsTrigger value="challenges">Challenges</TabsTrigger>
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
        <TabsContent value="challenges">
          <div className="text-center text-muted-foreground">No challenges yet.</div>
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