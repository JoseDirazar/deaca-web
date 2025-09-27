import type { BaseEntity } from "../common/base.interface";
import type { Establishment } from "../establishment/etablihment.interface";
import type { User } from "../user/user.interface";

export interface Review extends BaseEntity {
    reviewer: User;
    establishment: Establishment;
    rating: number;
    comment: string;
}
