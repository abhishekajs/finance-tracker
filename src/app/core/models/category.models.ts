export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
  createdAt: string;
  _count?: {
    transactions: number;
  };
}

export interface CreateCategoryRequest {
  name: string;
  color?: string;
  icon?: string;
}

export interface UpdateCategoryRequest {
  name?: string;
  color?: string;
  icon?: string;
}

export interface SeedCategoriesResponse {
  count: number;
  message: string;
}

export const DEFAULT_CATEGORY_ICONS = [
  'restaurant',
  'directions_car',
  'shopping_cart',
  'movie',
  'receipt',
  'local_hospital',
  'work',
  'trending_up',
  'home',
  'school',
  'fitness_center',
  'pets',
  'flight',
  'phone',
  'wifi',
];

export const DEFAULT_CATEGORY_COLORS = [
  '#FF6B6B',
  '#4ECDC4',
  '#45B7D1',
  '#96CEB4',
  '#FFEAA7',
  '#DDA0DD',
  '#98D8C8',
  '#F7DC6F',
  '#FF8A65',
  '#81C784',
  '#64B5F6',
  '#FFB74D',
  '#F06292',
  '#9575CD',
  '#4DB6AC',
];
