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
    id: string;
    title: string;
    category: string;
    publishedDate: string;
    summary: string;
    content: string; // Markdown
}

export interface Podcast {
    id: string;
    title: string;
    category: string;
    publishedDate: string;
    summary: string;
    thumbnailUrl: string;
    audioUrl: string;
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
