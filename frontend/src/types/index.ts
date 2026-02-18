export interface Tour {
    _id: string;
    name: string;
    duration: number;
    maxGroupSize: number;
    difficulty: 'easy' | 'medium' | 'difficult';
    ratingsAverage: number;
    ratingsQuantity: number;
    price: number;
    priceDiscount?: number;
    summary: string;
    description: string;
    imageCover: string;
    images: string[];
    startDates: string[];
    secretTour?: boolean;
    startLocation?: {
        description: string;
        type: string;
        coordinates: number[];
        address: string;
    };
    locations: {
        _id: string;
        description: string;
        type: string;
        coordinates: number[];
        day: number;
    }[];
    guides: User[];
    id?: string;
    state?: string;
}

export type Trip = Tour;

export interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
}

export interface Booking {
    _id: string;
    tour: Tour;
    user: User;
    price: number;
    seats: number;
    createdAt: string;
    paid: boolean;
    status: 'pending' | 'confirmed' | 'cancelled';
}

export interface Review {
    _id: string;
    review: string;
    rating: number;
    user: User;
    tour: string | Tour;
    createdAt: string;
}
