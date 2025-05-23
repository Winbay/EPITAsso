import type { Association } from '@/types/associationInterfaces'
import type { User } from '@/types/userInterfaces'

export interface Equipment {
  id: number
  name: string
  assoOwner: Pick<Association, 'id' | 'name' | 'logo'>
  quantity: number
  equipmentRequest: null | EquipmentRequest
  photo: string // Url to the image for now
}

export interface EquipmentRequest {
  id: number
  equipmentId: number // Foreign key
  equipmentName: string // Qu'on garde le nom quand un equipment est delete
  assoOwner: Pick<Association, 'id' | 'name' | 'logo'>
  userRespoOwner: Pick<User, 'id' | 'login'> | null
  assoBorrower: Pick<Association, 'id' | 'name' | 'logo'>
  userRespoBorrower: Pick<User, 'id' | 'login'>
  borrowingDate: number
  dueDate: number
  status: 'waiting' | 'accepted' | 'refused'
  comment: string
}

export interface EquipmentCreation
  extends Omit<Equipment, 'id' | 'assoOwner' | 'equipmentRequest' | 'photo'> {
  photo: File | null
}

export interface EquipmentModification
  extends Omit<Equipment, 'assoOwner' | 'equipmentRequest' | 'photo'> {
  photo: File | null
}

export interface EquipmentRequestCreation
  extends Omit<
    EquipmentRequest,
    | 'id'
    | 'equipmentName'
    | 'userRespoOwner'
    | 'assoOwner'
    | 'assoBorrower'
    | 'userRespoBorrower'
    | 'status'
    | 'comment'
  > {}
