interface User {
  id: string
  login: string
  email: string
  first_name: string
  last_name: string
  school: string
  isAdmin: boolean
}

export interface FetchedUser extends Omit<User, 'isAdmin'> {}
