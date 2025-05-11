import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function ProfileSkeleton() {
  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="flex items-center gap-6 mb-8">
        <Skeleton className="h-24 w-24 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-32" />
          <div className="flex gap-4 mt-1">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-20" />
          </div>
          <Skeleton className="h-4 w-64" />
        </div>
      </div>
    </div>
  );
}

export function UserCardSkeleton() {
  return (
    <div className="flex items-center gap-3 p-2 rounded-lg">
      <Skeleton className="w-10 h-10 rounded-full" />
      <div className="space-y-1">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
  );
} 