import type { Association } from '@/types/associationInterfaces'
import type { User } from '@/types/userInterfaces'

export interface Equipment {
  id: number
  name: string
  assoOwner: Association
  quantity: number
  equipmentRequest: null | EquipmentRequest
  photo: string // Url to the image for now
}

export interface EquipmentRequest {
  id: number
  equipmentId: number // Foreign key
  equipmentName: string // Qu'on garde le nom quand un equipment est delete
  userRespoOwner: null | User
  assoBorrower: Association
  userRespoBorrower: User
  borrowingDate: number
  dueDate: number
  status: 'waiting' | 'accepted' | 'refused'
  comment: string
}

export interface EquipmentCreation extends Omit<Equipment, 'id'> {}

export interface EquipmentModification extends Omit<Equipment, 'assoOwner' | 'equipmentRequest'> {}

export interface EquipmentRequestCreation
  extends Omit<
    EquipmentRequest,
    'id' | 'userRespoOwner' | 'equipmentName' | 'userRespoBorrower' | 'status' | 'comment'
  > {}
