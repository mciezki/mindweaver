import { User } from '../user';

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  surname: string;
  birthday: Date;
  sex: 'm' | 'f';

  profileName?: string | null;
  slug?: string | null;
  description?: string | null;
  profileImage?: string | null;
  coverImage?: string | null;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}
