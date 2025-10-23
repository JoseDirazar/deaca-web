import type { BaseEntity } from "./base.interface";
import type { Roles } from "./roles.interface";


export interface BasePaginationQueryParamsDto {
    search?: string;
    page?: number;
    limit?: number;
}

export interface CreateEstablishmentDto {
    name?: string;
    address?: string;
    phone?: string;
    email?: string;
    website?: string;
    description?: string;
    instagram?: string;
    facebook?: string;
    latitude?: string;
    longitude?: string;
    categories?: { id: string }[];
    subcategories?: { id: string }[];
}

export interface SignInDto {
    email: string;
    password: string;
}

export interface SignUpDto {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}

export interface SignInWithGoogleDto {
    accessToken: string;
}

export interface RequestPasswordResetDto {
    email: string;
}

export interface VerifyEmailDto {
    email: string;
    emailCode: string;
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


export interface EditProfileDto {
    firstName?: string;
    lastName?: string;
    avatar?: string;
    emailVerified?: boolean;
    emailCode?: string;
    emailCodeCreatedAt?: Date;
    password?: string;
    role?: Roles;
    lastLogin?: Date;
}


export interface GetUsersPaginatedQueryParamsDto extends BasePaginationQueryParamsDto {
    role?: Roles;
    sortBy?: 'firstName' | 'lastName' | 'email' | 'createdAt' | 'role' | 'lastLogin';
    sortOrder?: 'ASC' | 'DESC';
}

export interface EstablishmentsPaginationQueryParamsDto extends BasePaginationQueryParamsDto {
    name?: string;
    address?: string;
    sortBy?: 'name' | 'address' | 'createdAt';
    sortOrder?: 'ASC' | 'DESC';
    'categories[]'?: string[];
    'subcategories[]'?: string[];
}
export interface GetReviewsPaginatedQueryParamsDto extends BasePaginationQueryParamsDto {
    establishmentId?: string;
    sortBy?: 'createdAt' | 'updatedAt';
    sortOrder?: 'ASC' | 'DESC';
}


export interface EditEstablishmentDto extends BaseEntity {
    name?: string;
    address?: string;
    phone?: string;
    email?: string;
    website?: string;
    description?: string;
    instagram?: string;
    facebook?: string;
    latitude?: string;
    longitude?: string;
    categories?: { id: string }[];
    subcategories?: { id: string }[];
}

export interface CreateReviewDto {
    rating: number;
    comment: string;
}

export interface AppReviewDto {
    comment: string;
}
