export interface Business {
    id: string;
    name: string;
    category: string;
    address: string;
    phone: string;
    website: string;
    summary: string;
    description: string;
    imageUrl?: string;
}

export interface Article {
    id: number;
    title: string;
    summary: string;
    content: string; // Markdown
    author: string;
    imageUrl?: string;
    createdAt: string;
    category?: string; // Optional for now as API doesn't have it yet
}

export interface Podcast {
    id: number;
    title: string;
    description: string;
    host: string;
    audioUrl: string;
    imageUrl?: string;
    duration: string;
    createdAt: string;
}

export interface Product {
    id: string;
    name: string;
    price: number;
    description: string;
    imageUrl: string;
}

export interface CartItem extends Product {
    quantity: number;
}
