import type { BaseEntity } from "../common/base.interface";
import type { Establishment } from "../establishment/etablihment.interface";

export interface Review extends BaseEntity {
    reviewer: { id: string, firstName: string, lastName: string, avatar: string };
    establishment: Establishment;
    rating: number;
    comment: string;
}
