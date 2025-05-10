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
  return (
    <div className="p-4 border-b">
      <div className="flex items-center gap-3">
        <Image src={avatar} alt={name} width={40} height={40} className="rounded-full" />
        <div>
          <div className="font-medium">{name}</div>
          <div className="text-xs text-muted-foreground">{date}</div>
        </div>
      </div>
      <div className="mt-3 whitespace-pre-wrap">{content}</div>
    </div>
  );
} 