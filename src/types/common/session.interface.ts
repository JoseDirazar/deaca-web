import type { BaseEntity } from "../common/baes.interface";
import type { User } from "../user/user.interface";

export interface Session extends BaseEntity {
    expiredAt: Date;
    ip: string;
    browser: string;
    operatingSystem: string;
    user: User;
}
