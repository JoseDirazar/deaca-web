import type { BaseEntity } from "../common/baes.interface";
import type { Category } from "../category/category.interface";
import type { User } from "../user/user.interface";
import type { Subcategory } from "../category/subcategory.interface";
import type { Review } from "../reviews/review.interface";
import type { Image } from "../common/image.interface";

export interface Establishment extends BaseEntity {
    name: string;
    address: string;
    phone: string;
    email: string;
    website: string;
    description: string;
    avatar: string;
    instagram: string;
    facebook: string;
    latitude: string;
    longitude: string;
    reviewsReceived: Review[] | null;
    categories: Category[]
    subcategories: Subcategory[];
    images: Image[] | null;
    user: User;
}
