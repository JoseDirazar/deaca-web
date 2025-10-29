import type { BaseEntity } from "../common/base.interface";
import type { Category } from "../category/category.interface";
import type { User } from "../user/user.interface";
import type { Subcategory } from "../category/subcategory.interface";
import type { Review } from "../reviews/review.interface";
import type { Image } from "../common/image.interface";
import type { EstablishmentStatus } from "./establishment-status.enum";

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
  status: EstablishmentStatus;
  isComplete?: boolean;
  rating: number;
  reviewsReceived?: Review[] | null;
  categories: Category[] | Partial<Category>[];
  subcategories: Subcategory[];
  images?: Image[] | null;
  user: User;
  slug: string;
}
