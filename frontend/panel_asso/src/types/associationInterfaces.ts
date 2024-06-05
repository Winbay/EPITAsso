export interface Association {
  id: number
  name: string
  description: string
  location: 'KB' | 'VJ'
  logo: LogoAsso
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

export interface AssociationCreation {
  name: string
  description: string
  location: 'KB' | 'VJ'
  logo: LogoAsso['id']
}

export interface LogoAsso {
  id: number
  url: string
}
