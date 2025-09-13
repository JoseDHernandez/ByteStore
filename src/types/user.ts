export type User = {
  id: string;
  name: string;
  role: number;
  token: string;
};

export type UserUpdate = {
  id: string;
  name: string;
  email: string;
  physical_address: string;
};
export type UserRegister = {
  name: string;
  email: string;
  physical_address: string;
  password: string;
  role?: number;
};
//Actualizar contraseña
export type UserChangePassword = {
  id: string;
  password: string;
};
