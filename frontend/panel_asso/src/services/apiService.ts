import djangoApi from './api'
import type { ToastServiceMethods } from 'primevue/toastservice'
import SelectedAssoService from '@/services/association/selectedAsso'
import * as yup from 'yup'

const API_PATH = 'api'

export default class ApiService<SchemaType> {
  toast: ToastServiceMethods | null
  basePath: string
  schema: yup.ObjectSchema<any>
  params: string | null
  replacePath?: string
  apiPath: string = API_PATH

  constructor(
    toast: ToastServiceMethods | null,
    basePath: string,
    schema: yup.ObjectSchema<any>,
    params: string | null = null,
    replacePath?: string // TODO change that
  ) {
    this.toast = toast
    this.basePath = basePath
    this.replacePath = replacePath
    this.schema = schema
    this.params = params
  }

  protected getFullPath(): string {
    if (this.replacePath) {
      return this.replacePath
    }
    const associationId: string = SelectedAssoService.getAssociationId()
    return `${this.apiPath}/${associationId}/${this.basePath}`
  }

  // TODO not safe (ex: if omittedFields contains some fields in data)
  protected async create<ReturnType>(
    data: Partial<SchemaType>,
    omittedFields?: string[]
  ): Promise<ReturnType> {
    let validatedData
    if (omittedFields && omittedFields.length > 0) {
      validatedData = await this.validateWithoutFields(data, omittedFields)
    } else {
      validatedData = await this.validate(data as SchemaType)
    }
    return await this.request<ReturnType>('post', this.getFullPath(), validatedData)
  }

  protected async createFormData<ReturnType>(data: Partial<SchemaType>): Promise<ReturnType> {
    const formData = new FormData()
    for (const key in data) {
      const value = data[key]
      if (typeof value === 'object' && !(value instanceof Blob)) {
        formData.append(key, JSON.stringify(value))
      } else {
        formData.append(key, value as string | Blob)
      }
    }
    return await this.requestFormData<ReturnType>('post', this.getFullPath(), formData)
  }

  protected async get(): Promise<SchemaType> {
    const data = await this.request<SchemaType>('get', `${this.getFullPath()}`)
    return this.validate(data)
  }

  protected async getById(id: number): Promise<SchemaType> {
    const data = await this.request<SchemaType>('get', `${this.getFullPath()}${id}/`)
    return this.validate(data)
  }

  protected async getAll(): Promise<SchemaType[]> {
    const data = await this.request<SchemaType[]>('get', `${this.getFullPath()}`)
    return this.validateArray(data, yup.array().of(this.schema).required())
  }

  protected async getAllWithPaginationParams(params: string): Promise<{
    count: number
    next: string | null
    previous: string | null
    results: SchemaType[]
  }> {
    const { results, ...rest } = await this.request<{
      count: number
      next: string | null
      previous: string | null
      results: SchemaType[]
    }>('get', this.getFullPath(), undefined, params)
    const res = await this.validateArray(results, yup.array().of(this.schema).required())
    return { ...rest, results: res }
  }

  protected async getAllWithParams(params: string): Promise<SchemaType[]> {
    const data = await this.request<SchemaType[]>('get', `${this.getFullPath()}`, undefined, params)
    return this.validateArray(data, yup.array().of(this.schema).required())
  }

  protected async getAllCustomWithParams(
    route: string,
    params: string
  ): Promise<{
    count: number
    next: string | null
    previous: string | null
    results: SchemaType[]
  }> {
    const { results, ...rest } = await this.request<{
      count: number
      next: string | null
      previous: string | null
      results: SchemaType[]
    }>('get', `${this.getFullPath()}${route}`, undefined, params)
    const res = await this.validateArray(results, yup.array().of(this.schema).required())
    return { ...rest, results: res }
  }

  protected async getAllCustom(route: string): Promise<SchemaType[]> {
    const data = await this.request<SchemaType[]>('get', `${this.getFullPath()}${route}`)
    return this.validateArray(data, yup.array().of(this.schema).required())
  }

  protected async bulkUpdate<ReturnType>(data: SchemaType[]): Promise<ReturnType> {
    const validatedData = await this.validateArray(data, yup.array().of(this.schema).required())
    return await this.request<ReturnType>('patch', `${this.getFullPath()}`, validatedData)
  }

  protected async update(data: SchemaType, id?: number): Promise<void> {
    const validatedData = await this.validate(data)
    await this.request<void>('put', `${this.getFullPath()}${id ? id + '/' : ''}`, validatedData)
  }

  protected async patch<ReturnType>(
    data: Partial<SchemaType>,
    id?: number,
    omittedFields?: string[]
  ): Promise<ReturnType> {
    let validatedData
    if (omittedFields && omittedFields.length > 0) {
      validatedData = await this.validateWithoutFields(data, omittedFields)
    } else {
      validatedData = await this.validate(data as SchemaType)
    }
    return await this.request<ReturnType>(
      'patch',
      `${this.getFullPath()}${id ? id + '/' : ''}`,
      validatedData
    )
  }

  protected async patchFormData(data: FormData, id?: number): Promise<void> {
    await this.requestFormData<void>('patch', `${this.getFullPath()}${id ? id + '/' : ''}`, data)
  }

  protected async delete(id: number): Promise<void> {
    await this.request<void>('delete', `${this.getFullPath()}${id}/`)
  }

  protected async request<ReturnType>(
    method: 'post' | 'get' | 'put' | 'patch' | 'delete',
    url: string,
    data?: SchemaType | Partial<SchemaType> | SchemaType[],
    params?: string | null
  ): Promise<ReturnType> {
    try {
      params = this.params ? this.params + (params ? '&' + params : '') : params
      const fullUrl = params ? `${url}?${params}` : url
      const response = await djangoApi[method]<ReturnType>(fullUrl, data)
      return response.data
    } catch (error) {
      this.handleError(error, `${method.toUpperCase()}: An error occured.`)
    }
  }

  protected async requestFormData<ReturnType>(
    method: 'post' | 'get' | 'put' | 'patch' | 'delete',
    url: string,
    data: FormData,
    params?: string | null
  ): Promise<ReturnType> {
    try {
      params = this.params ? this.params + (params ? '&' + params : '') : params
      const fullUrl = params ? `${url}?${params}` : url
      const response = await djangoApi[method]<ReturnType>(fullUrl, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      return response.data
    } catch (error) {
      this.handleError(error, `${method.toUpperCase()}: An error occured.`)
    }
  }

  private handleError(error: any, message: string): never {
    if (this.toast) {
      this.toast.add({
        severity: 'error',
        summary: 'Associations',
        detail: message,
        life: 5000
      })
    }
    console.log('API error:', error)
    throw error
  }

  private catchValidationError(error: any): never {
    if (this.toast) {
      this.toast.add({
        severity: 'error',
        summary: 'Erreur de validation',
        detail: 'Les données ne correspondent pas au schéma de validation: ' + error,
        life: 5000
      })
    }
    throw error
  }

  private async validate(data: SchemaType): Promise<SchemaType> {
    try {
      return await this.schema.validate(data, { abortEarly: false })
    } catch (error) {
      this.catchValidationError(error)
    }
  }

  private async validateWithoutFields(
    data: Partial<SchemaType>,
    omitFields: string[]
  ): Promise<Partial<SchemaType>> {
    try {
      const schemaWithOmittedFields = this.schema.omit(omitFields as any)
      return await schemaWithOmittedFields.validate(data, { abortEarly: false })
    } catch (error) {
      this.catchValidationError(error)
    }
  }

  protected async validateArray(
    data: SchemaType[],
    schema: yup.ArraySchema<SchemaType[], any, '', ''>
  ): Promise<SchemaType[]> {
    try {
      return await schema.validate(data, { abortEarly: false })
    } catch (error) {
      this.catchValidationError(error)
    }
  }

  /**
   * used to convert the schema (backend type) to the interface (frontend type)
   * override it when backend and frontend types are different
   *
   * @param data
   * @returns
   */
  protected converterSchemaToInterface(data: SchemaType): unknown {
    return data
  }

  protected camelToSnake(obj: any): any {
    if (obj === null || typeof obj !== 'object') {
      return obj
    }

    const newObj: any = Array.isArray(obj) ? [] : {}

    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        let newKey = key.replace(/[A-Z]/g, (match) => `_${match.toLowerCase()}`)
        newKey = newKey.startsWith('_') ? newKey.substring(1) : newKey
        if (obj[key] instanceof File) {
          newObj[newKey] = obj[key]
        } else {
          newObj[newKey] = this.camelToSnake(obj[key])
        }
      }
    }

    return newObj
  }

  protected snakeToCamel(obj: any): any {
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
