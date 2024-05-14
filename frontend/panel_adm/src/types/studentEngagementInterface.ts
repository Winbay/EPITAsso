export enum Status {
  WAITING = 'En attente',
  VALIDATED = 'Validé',
  VALIDATED_WITH_MODIFICATIONS = 'Validé avec modifications',
  REFUSED = 'Refusé'
}

export type Severity = 'warning' | 'success' | 'danger';

export interface Activity {
  text: string
  hours: number
}

export interface Position {
  id: number
  name: string
}

export interface StatusDetails {
  name: string
  comment: string
}

export interface StudentEngagement {
  id: number
  login: string
  name: string
  firstname: string
  promotion: string
  position: Position
  comment: string
  activities: Activity[]
  totalHours: number
  status: StatusDetails
}
