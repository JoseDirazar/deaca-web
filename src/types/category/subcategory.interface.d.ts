import type { BaseEntity } from "../common/base.interface";
import type { Establishment } from "../establishment/etablihment.interface";
import type { Category } from "./category.interface";

export interface Subcategory extends BaseEntity {
    name: string;
    category: Category;
    establishments: Establishment[];
}