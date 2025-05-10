export interface User {
    id: string;
    name: string;
    avatar_url: string;
}

export interface Comment {
    id: string;
    content: string;
    created_at: string;
    user: User;
    replies?: Comment[];
}

export interface Post {
    id: string;
    content: string;
    created_at: string;
    user: User;
    comments?: Comment[];
    likes?: number;
}

export type Challenge = {
    id: string;
    title: string;
    description: string;
    difficulty: 'easy' | 'medium' | 'hard';
    points: number;
    created_at: string;
};

export const dummyPosts: Post[] = [
    {
        id: '1',
        user: {
            id: '1',
            name: 'John Doe',
            avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
        },
        content: 'Just completed my first coding challenge! 🚀 #coding #challenge',
        created_at: '2024-03-20T10:00:00Z',
    },
    {
        id: '2',
        user: {
            id: '2',
            name: 'Jane Smith',
            avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
        },
        content: 'Working on a new project using Next.js and TypeScript. Loving the developer experience! 💻',
        created_at: '2024-03-19T15:30:00Z',
    },
    {
        id: '3',
        user: {
            id: '3',
            name: 'Mike Johnson',
            avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
        },
        content: 'Just learned about React Query. It\'s a game-changer for data fetching! 🔥',
        created_at: '2024-03-18T09:15:00Z',
    },
];

export const dummyChallenges: Challenge[] = [
    {
        id: '1',
        title: 'Build a Todo App',
        description: 'Create a full-stack todo application with user authentication and CRUD operations.',
        difficulty: 'easy',
        points: 100,
        created_at: '2024-03-20T00:00:00Z',
    },
    {
        id: '2',
        title: 'Real-time Chat Application',
        description: 'Build a real-time chat application using WebSocket and React.',
        difficulty: 'medium',
        points: 200,
        created_at: '2024-03-19T00:00:00Z',
    },
    {
        id: '3',
        title: 'E-commerce Platform',
        description: 'Develop a complete e-commerce platform with payment integration and inventory management.',
        difficulty: 'hard',
        points: 300,
        created_at: '2024-03-18T00:00:00Z',
    },
]; 