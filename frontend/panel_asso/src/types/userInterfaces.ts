export interface User {
  id: string
  login: string
  firstName: string
  lastName: string
}

export interface UserDetail extends User {
  email: string
  school: string
}

export interface UserDetail extends User {
  email: string
  isAdmin: boolean | undefined
}

export interface FetchedUser extends Omit<UserDetail, 'isAdmin'> {}
