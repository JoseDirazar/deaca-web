import type { BaseEntity } from "../common/base.interface";
import type { User } from "./user.interface";

export interface ISession extends BaseEntity {
    expiredAt: Date;
    ip: string;
    browser: string;
    operatingSystem: string;
    user: User;
}
