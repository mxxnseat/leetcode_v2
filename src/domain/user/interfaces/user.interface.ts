import { Nullable } from '@lib/types';

export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  nickname: string;
  email: Nullable<string>;
  role: UserRole;
  clerk_user_id: string;
}
