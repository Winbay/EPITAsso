interface User {
  id: string;
  login: string;
  email: string;
  name: string;
  lastName: string;
  school: string;
  isAdmin: boolean;
}

export interface FetchedUser extends Omit<User, 'isAdmin'> { }