import djangoApi from './api'
import type { ToastServiceMethods } from 'primevue/toastservice'
import * as yup from 'yup'

export default class ApiService<SchemaType> {
  toast: ToastServiceMethods
  basePath: string
  schema: yup.ObjectSchema<any>
  params: string | null

  constructor(toast: ToastServiceMethods, basePath: string, schema: yup.ObjectSchema<any>, params: string | null = null) {
    this.toast = toast
    this.basePath = basePath
    this.schema = schema
    this.params = params
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
    return await this.request<ReturnType>('post', this.basePath, validatedData)
  }

  protected async get(): Promise<SchemaType> {
    const data = await this.request<SchemaType>('get', `${this.basePath}`)
    return this.validate(data)
  }

  protected async getById(id: number): Promise<SchemaType> {
    const data = await this.request<SchemaType>('get', `${this.basePath}${id}/`)
    return this.validate(data)
  }

  protected async getAll(params: string | null = null): Promise<SchemaType[]> {
    const data = await this.request<SchemaType[]>('get', this.basePath,undefined, params);
    return this.validateArray(data, yup.array().of(this.schema).required());
  }

  protected async update(data: SchemaType, id?: number): Promise<void> {
    const validatedData = await this.validate(data)
    await this.request<void>('put', `${this.basePath}${id ? id + '/' : ''}`, validatedData)
  }

  protected async delete(id: number): Promise<void> {
    await this.request<void>('delete', `${this.basePath}${id}/`)
  }

  private async request<ReturnType>(
    method: 'post' | 'get' | 'put' | 'delete',
    url: string,
    data?: SchemaType | Partial<SchemaType>,
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

  private handleError(error: any, message: string): never {
    this.toast.add({
      severity: 'error',
      summary: 'Associations',
      detail: message,
      life: 5000
    })
    console.log('API error:', error)
    throw error
  }

  private catchValidationError(error: any): never {
    this.toast.add({
      severity: 'error',
      summary: 'Erreur de validation',
      detail: 'Les données ne correspondent pas au schéma de validation: ' + error,
      life: 5000
    })
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

  private async validateArray(
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
}
