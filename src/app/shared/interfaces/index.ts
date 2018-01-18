export interface Product {
    id: string;
    count: number;
    title: string;
    price: number;
    currency: string;
    url: string;
    photo: string;
}

export interface SearchQuery {
    product: string;
    currency: string;
    price: number;
}
