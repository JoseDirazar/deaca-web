import type { BaseEntity } from "../common/baes.interface";
import type { Roles } from "../common/roles.interface";
import type { Review } from "../reviews/review.interface";
import type { Session } from "../common/session.interface";
import type { Establishment } from "../establishment/etablihment.interface";

export interface User extends BaseEntity {
    email: string;
    emailVerified: boolean;
    password: string;
    avatar: string;
    emailCode: string;
    firstName: string;
    lastName: string;
    emailCodeCreateAt: Date;
    role: Roles;
    lastLogin?: Date;
    sessions: Session[];
    reviewsGiven: Review[];
    establishments: Establishment[];
}
