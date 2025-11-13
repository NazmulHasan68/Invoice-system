// src/types/user.ts
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  emailVerified: boolean;
  role: "admin" | "user";
  createdAt: Date;
  updatedAt: Date;
  banned?: boolean;
  banReason?: string | null;
  banExpires?: Date | null;
}
