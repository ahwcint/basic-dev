export type User = {
  username: string;
  id: string;
  createAt: string;
  role: UserRole;
};

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export type TokenData = {
  user: User;
  sub: string;
  exp: number;
  iat: number;
};
