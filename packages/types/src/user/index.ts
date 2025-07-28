export interface User {
  id: string;
  email: string;
  name: string;
  surname: string;
  birthday: Date;
  sex: string;
  createdAt: Date;
  updatedAt: Date;
  type: string;
  active: boolean;

  profileName?: string | null;
  slug?: string | null;
  description?: string | null;
  profileImage?: string | null;
  coverImage?: string | null;
}
