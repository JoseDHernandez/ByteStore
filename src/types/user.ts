//usuario login
export type User = {
  id: string;
  name: string;
  role: string;
  token: string;
};
//actualizar usuario
export type UserUpdate = {
  name: string;
  email: string;
  physical_address: string;
};
//registro usuario
export type UserRegister = {
  name: string;
  email: string;
  physical_address: string;
  password: string;
  role?: string;
};
//Actualizar contraseña
export type UserChangePassword = {
  id: string;
  password: string;
};
//todos los usuarios
export type UserDataItem = Omit<User, "token"> & {
  physical_address: string;
  email: string;
};
export type UserData = {
  total: number;
  pages: number;
  first: number;
  next: number | null;
  prev: number | null;
  data: UserDataItem[];
};
