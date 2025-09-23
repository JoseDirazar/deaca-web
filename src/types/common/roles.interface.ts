const Roles = {
    USER: 'user',
    ADMIN: 'admin',
    BUSINESS_OWNER: 'business_owner',
} as const
export type Roles = typeof Roles[keyof typeof Roles];
