import type { User } from "../user/user.interface";
import type { BaseEntity } from "./base.interface";

export interface ISession extends BaseEntity {
    expiredAt: Date;
    ip: string;
    browser: string;
    operatingSystem: string;
    user: User;
}

export interface RequestPasswordResetDto {
    email: string;
}

export interface VerifyResetCodeDto {
    email: string;
    resetCode: string;
}

export interface ResetPasswordDto {
    email: string;
    resetCode: string;
    newPassword: string;
}

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    user: User;
    ok: boolean;
}


export interface SignUp {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}

export interface VerifyEmailDto {
    email: string;
    emailCode: string;
}