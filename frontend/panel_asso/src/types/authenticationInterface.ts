export interface AuthenticationToken {
  accessToken: string
  expiresIn: number
  refreshToken: string
  tokenType: string
}

export interface AuthenticationCode {
  code: string
  redirect_uri: string
}

export interface AuthenticationRefresh {
  access: string
  refresh: string
}