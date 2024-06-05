import type { FetchedUser } from '@/types/userInterfaces'

export interface Association {
  id: number
  name: string
  description: string
  location: string
  logo: LogoAsso
  members: FetchedUser[]
  socialNetworks: SocialNetwork[]
  faq: FAQItem[]
}

export interface SocialNetwork {
  id: number
  name: string
  link: string
}

export interface FAQItem {
  id: number
  question: string
  answer: string
}

export interface AssociationCreation extends Omit<Association, 'id' | 'socialNetwork' | 'faq'> {}

export interface LogoAsso {
  id: number
  url: string
}
