import type { User } from '@/types/userInterfaces'

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

export interface Member extends Pick<User, 'id' | 'login' | 'firstName' | 'lastName' | 'school'> {
  role: string
}

export interface Association {
  id: number
  name: string
  content: string
  location: string
  logo: string
}

export interface AssociationDetail extends Association {
  socialNetworks: SocialNetwork[]
  faqs: Faq[]
}
