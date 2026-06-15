export interface User {
    id: number;
    email: string;
    name: string;
}

export interface Category {
    id: number;
    name: string;
    description?: string;
    createdAt: string;
}

export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
    stock: number;
    categoryId: number;
    brand: string;
    model?: string;
    category?: Category;
    createdAt: string;
    updatedAt: string;
}

export interface CartItem {
    id: number;
    userId: number;
    productId: number;
    quantity: number;
    product: Product;
    createdAt: string;
}

export interface WishlistItem {
    id: number;
    userId: number;
    productId: number;
    product: Product;
    createdAt: string;
}

export interface OrderItem {
    id: number;
    orderId: number;
    productId: number;
    quantity: number;
    price: number;
    product: Product;
}

export interface Order {
    id: number;
    userId: number;
    total: number;
    status: string;
    createdAt: string;
    items: OrderItem[];
}

export interface AuthResponse {
    message: string;
    user: User;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterCredentials {
    name: string;
    email: string;
    password: string;
}
