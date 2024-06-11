export interface SocialNetwork {
  id: number
  name: string
  link: string
}

export interface Faq {
  id: number
  question: string
  answer: string
}

export interface Association {
  id: number
  name: string
  description: string
  location: string
  logoUrl: string
}

export interface AssociationDetail extends Association {
  // members: User[]
  socialNetworks: SocialNetwork[]
  faq: Faq[]
}
