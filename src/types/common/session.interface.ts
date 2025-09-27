import type { BaseEntity } from "./base.interface";
import type { User } from "../user/user.interface";

export interface Session extends BaseEntity {
    expiredAt: Date;
    ip: string;
    browser: string;
    operatingSystem: string;
    user: User;
}
