interface User {
  id: string
  login: string
  email: string
  firstName: string
  lastName: string
  school: string
  isAdmin: boolean
}

export interface FetchedUser extends Omit<User, 'isAdmin'> {}
