export function UserCard({ name, avatar, subtitle }: { name: string; avatar: string; subtitle?: string }) {
  return (
    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition">
      <img src={avatar} alt={name} width={40} height={40} className="rounded-full" />
      <div>
        <div className="font-medium">{name}</div>
        {subtitle && <div className="text-xs text-muted-foreground">{subtitle}</div>}
      </div>
    </div>
  );
} 