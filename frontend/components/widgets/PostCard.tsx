import { useState, useEffect } from "react";
import Image from "next/image";

export function PostCard({
  name,
  avatar,
  content,
  date,
}: {
  name: string;
  avatar: string;
  content: string;
  date: string;
}) {
  const [imgError, setImgError] = useState(false);
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  
  // Generate a fallback avatar using DiceBear
  const fallbackAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`;
  
  // Validate image URL before using it
  useEffect(() => {
    // If avatar URL is empty or contains "supabase" but isn't properly configured
    if (!avatar || (avatar.includes('supabase') && !avatar.startsWith('https://') && !avatar.startsWith('http://'))) {
      setImgSrc(fallbackAvatar);
    } else {
      setImgSrc(avatar);
    }
  }, [avatar, fallbackAvatar, name]);

  if (!imgSrc) {
    return null; // Return null while determining the image source
  }

  return (
    <div className="p-4 border-b">
      <div className="flex items-center gap-3">
        <div className="relative w-10 h-10 rounded-full overflow-hidden bg-muted">
          <Image 
            src={imgError ? fallbackAvatar : imgSrc} 
            alt={name} 
            width={40}
            height={40}
            className="rounded-full object-cover"
            onError={() => setImgError(true)}
          />
        </div>
        <div>
          <div className="font-medium">{name}</div>
          <div className="text-xs text-muted-foreground">{date}</div>
        </div>
      </div>
      <div className="mt-3 whitespace-pre-wrap">{content}</div>
    </div>
  );
} 