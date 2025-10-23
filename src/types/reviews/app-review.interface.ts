import type { BaseEntity } from "../common/base.interface";
import type { User } from "../user/user.interface";

export interface AppReview extends BaseEntity {
    comment: string;
    user: User;
}