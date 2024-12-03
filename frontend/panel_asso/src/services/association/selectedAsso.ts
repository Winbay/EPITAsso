import djangoApi, { ASSOCIATION_ID } from '@/services/api'
import type { Association } from '@/types/associationInterfaces'
import * as yup from 'yup'

const associationSchema = yup.object({
  id: yup.number().required(),
  name: yup.string().required(),
  content: yup.string().required(),
  location: yup.string().required(),
  logo: yup.string().required(),
  webhook: yup.string().required()
})

export default class SelectedAssoService {
  static associationId: string | null = localStorage.getItem(ASSOCIATION_ID)

  static getAssociationId(): string {
    return this.associationId !== null ? this.associationId : '0'
  }

  static setAssociationId(associationId: string): void {
    localStorage.setItem('associationId', associationId)
    this.associationId = associationId
  }

  static async getUserAssociations(): Promise<Association[]> {
    try {
      const response = await djangoApi['get']<(typeof associationSchema)[]>(
        '/api/users/me/associations'
      )
      return response.data.map((asso) => this.snakeToCamel(asso))
    } catch (error) {
      this.handleError(error, `GET: An error occured.`)
    }
  }

  static handleError(error: any, message: string): never {
    console.log('API error:', error, message)
    throw error
  }

  static snakeToCamel(obj: any): any {
    if (obj === null || typeof obj !== 'object') {
      return obj
    }

    const newObj: any = Array.isArray(obj) ? [] : {}

    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const newKey = key.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase())
        newObj[newKey] = this.snakeToCamel(obj[key])
      }
    }

    return newObj
  }
}
