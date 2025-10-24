import type { BaseEntity } from "../common/base.interface";
import type { Roles } from "../common/roles.interface";
import type { Review } from "../reviews/review.interface";
import type { Session } from "../common/session.interface";
import type { Establishment } from "../establishment/etablihment.interface";
import type { AccountStatus } from "../common/api-request.interface";

export interface User extends BaseEntity {
    email: string;
    status: AccountStatus;
    password?: string;
    avatar: string;
    emailCode: string;
    firstName: string;
    lastName: string;
    emailCodeCreateAt?: Date;
    role: Roles;
    lastLogin?: Date;
    sessions?: Session[];
    reviewsGiven?: Review[];
    establishments?: Establishment[];
}
