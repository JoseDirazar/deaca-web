import type { BaseEntity } from "../common/baes.interface";
import type { Establishment } from "../establishment/etablihment.interface";
import type { Category } from "./category.interface";

export interface Subcategory extends BaseEntity {
    name: string;
    category: Category;
    establishments: Establishment[];
}