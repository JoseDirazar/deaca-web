import type { BaseEntity } from "../common/baes.interface";
import type { Subcategory } from "./subcategory.interface";
import type { Establishment } from "../establishment/etablihment.interface";

export interface Category extends BaseEntity {
    name: string;
    subcategories: Subcategory[];
    establishments: Establishment[];
}