export const QueryKeys = {
  // User related
  USER: 'user',
  USERS: 'users',
  ADMIN_USERS_CHART: 'admin-users-chart',
  
  // Analytics
  TOTAL_VISITS: 'total-visits-for-establishment-owner',
  ADMIN_ANALYTICS_CHART: 'admin-analytics-chart',
  
  // Establishments
  ESTABLISHMENTS: 'establishments',
  ESTABLISHMENT: 'establishment',
  
  // Categories
  CATEGORIES: 'categories',
  CATEGORY: 'category',
  
  // Subcategories
  SUBCATEGORIES: 'subcategories',
  SUBCATEGORY: 'subcategory',
  
  // Events
  EVENTS: 'events',
  EVENT: 'event',
  
  // Nature Spots
  NATURE_SPOTS: 'nature-spots',
  NATURE_SPOT: 'nature-spot',
  
  // Reviews
  REVIEWS: 'reviews',
  REVIEW: 'review',
  
  // App Reviews
  APP_REVIEWS: 'app-reviews',
  
  // Pharmacies
  PHARMACIES: 'pharmacies',
  
  // Tendencies
  TENDENCIES: 'tendencies',
  TENDENCY: 'tendency',
} as const;

export type QueryKeysType = keyof typeof QueryKeys;
