import { useRouter } from "next/navigation";

interface UserCardProps {
    id: string;
    name: string;
    avatar: string;
    subtitle?: string;
}

export function UserCard({ id, name, avatar, subtitle }: UserCardProps) {
    const router = useRouter();

    const handleClick = () => {
        router.push(`/profile/${id}`);
    };

    return (
        <div 
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition cursor-pointer" 
            onClick={handleClick}
        >
            <img src={avatar} alt={name} width={40} height={40} className="rounded-full" />
            <div>
                <div className="font-medium hover:underline">{name}</div>
                {subtitle && <div className="text-xs text-muted-foreground">{subtitle}</div>}
            </div>
        </div>
    );
} 