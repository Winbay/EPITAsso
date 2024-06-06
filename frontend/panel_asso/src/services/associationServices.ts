import axios from 'axios'
import type { ToastServiceMethods } from 'primevue/toastservice'
import type { Association, FAQItem } from '@/types/associationInterfaces'
import * as yup from 'yup'
import { type ApiResponse, handleApiError } from '@/services/apiErrorHandler'

interface BackendFAQItem {
  id: number
  question: string
  answer: string
}

interface BackendAssociation {
  id: number
  name: string
  logo: { id: number; url: string }
  description: string
  location: string
  members: {
    id: string
    login: string
    email: string
    first_name: string
    last_name: string
    school: string
  }[]
  social_networks: { id: number; name: string; link: string }[]
  faq: BackendFAQItem[]
}

const backendFAQItemSchema = yup.object().shape({
  id: yup.number().required(),
  question: yup.string().required(),
  answer: yup.string().required()
})

const backendAssociationSchema = yup.object().shape({
  id: yup.number().required(),
  name: yup.string().required(),
  logo: yup
    .object()
    .shape({
      id: yup.number().required(),
      url: yup.string().required()
    })
    .required(),
  description: yup.string().required(),
  location: yup.string().required(),
  members: yup
    .array()
    .of(
      yup.object().shape({
        id: yup.string().required(),
        login: yup.string().required(),
        email: yup.string().required(),
        first_name: yup.string().required(),
        last_name: yup.string().required(),
        school: yup.string().required()
      })
    )
    .required(),
  social_networks: yup
    .array()
    .of(
      yup.object().shape({
        id: yup.number().required(),
        name: yup.string().required(),
        link: yup.string().required()
      })
    )
    .required(),
  faq: yup
    .array()
    .of(backendFAQItemSchema)
    .required()
})

const mapBackendFAQItemToFrontend = (backendFAQItem: BackendFAQItem): FAQItem => ({
  id: backendFAQItem.id,
  question: backendFAQItem.question,
  answer: backendFAQItem.answer
})

const mapBackendAssociationToFrontend = (backendAssociation: BackendAssociation): Association => ({
  id: backendAssociation.id,
  name: backendAssociation.name,
  description: backendAssociation.description,
  location: backendAssociation.location,
  logo: {
    id: backendAssociation.logo.id,
    url: backendAssociation.logo.url
  },
  members: backendAssociation.members.map((member) => ({
    id: member.id,
    login: member.login,
    email: member.email,
    firstName: member.first_name,
    lastName: member.last_name,
    school: member.school
  })),
  socialNetworks: backendAssociation.social_networks.map((socialNetwork) => ({
    id: socialNetwork.id,
    name: socialNetwork.name,
    link: socialNetwork.link
  })),
  faq: backendAssociation.faq.map(mapBackendFAQItemToFrontend)
})

const faqItemSchema = yup.object().shape({
  id: yup.number().required(),
  question: yup.string().required(),
  answer: yup.string().required()
})

const associationSchema = yup.object().shape({
  id: yup.number().required(),
  name: yup.string().required(),
  logo: yup
    .object()
    .shape({
      id: yup.number().required(),
      url: yup.string().required()
    })
    .required(),
  description: yup.string().required(),
  location: yup.string().required(),
  members: yup
    .array()
    .of(
      yup.object().shape({
        id: yup.string().required(),
        login: yup.string().required(),
        email: yup.string().required(),
        firstName: yup.string().required(),
        lastName: yup.string().required(),
        school: yup.string().required()
      })
    )
    .required(),
  socialNetworks: yup
    .array()
    .of(
      yup.object().shape({
        id: yup.number().required(),
        name: yup.string().required(),
        link: yup.string().required()
      })
    )
    .required(),
  faq: yup
    .array()
    .of(faqItemSchema)
    .required()
})

const mapFrontendFAQItemToBackend = (faqItem: FAQItem): BackendFAQItem => ({
  id: faqItem.id,
  question: faqItem.question,
  answer: faqItem.answer
})

const mapFrontendAssociationToBackend = (association: Association): BackendAssociation => ({
  id: association.id,
  name: association.name,
  description: association.description,
  location: association.location,
  logo: {
    id: association.logo.id,
    url: association.logo.url
  },
  members: association.members.map((member) => ({
    id: member.id,
    login: member.login,
    email: member.email,
    first_name: member.firstName,
    last_name: member.lastName,
    school: member.school
  })),
  social_networks: association.socialNetworks.map((socialNetwork) => ({
    id: socialNetwork.id,
    name: socialNetwork.name,
    link: socialNetwork.link
  })),
  faq: association.faq.map(mapFrontendFAQItemToBackend)
})

export async function getAssociations(toast: ToastServiceMethods) {
  try {
    const response = await axios.get<BackendAssociation[]>('/api/associations')
    const validatedAssociations = await yup
      .array()
      .of(backendAssociationSchema)
      .validate(response.data, { abortEarly: false })
    return validatedAssociations!.map(mapBackendAssociationToFrontend)
  } catch (error) {
    handleApiError(error, toast, "La liste des associations n'a pas pu être chargée.")
    throw error
  }
}

export async function getAssociationById(id: number, toast: ToastServiceMethods) {
  try {
    const response = await axios.get<ApiResponse<BackendAssociation>>(`/api/associations/${id}`)
    const validatedAssociation = await backendAssociationSchema.validate(response.data, {
      abortEarly: false
    })
    return mapBackendAssociationToFrontend(validatedAssociation)
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      console.error('Validation error:', error.errors)
    }
    handleApiError(error, toast, "L'association n'a pas pu être chargée.")
    throw error
  }
}

export async function updateAssociation(association: Association, toast: ToastServiceMethods) {
  try {
    const validatedAssociation = await associationSchema.validate(association, {
      abortEarly: false
    })
    const backendAssociation = mapFrontendAssociationToBackend(validatedAssociation)
    await axios.put<BackendAssociation>(`/api/associations/${association.id}`, backendAssociation)
    toast.add({
      severity: 'success',
      summary: 'Associations',
      detail: "L'association a bien été mise à jour.",
      life: 5000
    })
    return true
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      console.error('Validation error:', error.errors)
    }
    handleApiError(error, toast, "L'association n'a pas pu être mise à jour.")
    throw error
  }
}

export async function getFaqByAssociationId(id: number, toast: ToastServiceMethods) {
  try {
    const response = await axios.get<BackendFAQItem[]>(`/api/associations/${id}/faq`)
    const validatedFaq = await yup
      .array()
      .of(backendFAQItemSchema)
      .validate(response.data, { abortEarly: false })
    return validatedFaq!.map(mapBackendFAQItemToFrontend)
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      console.error('Validation error:', error.errors)
    }
    handleApiError(error, toast, "La FAQ n'a pas pu être chargée.")
    throw error
  }
}

export async function addFaqItem(
  associationId: number,
  faqItem: FAQItem,
  toast: ToastServiceMethods
) {
  try {
    const validatedFaqItem = await faqItemSchema.validate(faqItem, { abortEarly: false })
    const backendFaqItem = mapFrontendFAQItemToBackend(validatedFaqItem)
    const response = await axios.post<BackendFAQItem>(`/api/associations/${associationId}/faq`, backendFaqItem)
    return mapBackendFAQItemToFrontend(response.data)
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      console.error('Validation error:', error.errors)
    }
    handleApiError(error, toast, "La question n'a pas pu être ajoutée.")
    throw error
  }
}

export async function updateFaqItem(
  associationId: number,
  faqItem: FAQItem,
  toast: ToastServiceMethods
) {
  try {
    const validatedFaqItem = await faqItemSchema.validate(faqItem, { abortEarly: false })
    const backendFaqItem = mapFrontendFAQItemToBackend(validatedFaqItem)
    const response = await axios.put<BackendFAQItem>(`/api/associations/${associationId}/faq/${faqItem.id}`, backendFaqItem)
    return mapBackendFAQItemToFrontend(response.data)
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      console.error('Validation error:', error.errors)
    }
    handleApiError(error, toast, "La question n'a pas pu être mise à jour.")
    throw error
  }
}

export async function deleteFaqItem(
  associationId: number,
  faqItemId: number,
  toast: ToastServiceMethods
) {
  try {
    const response = await axios.delete(`/api/associations/${associationId}/faq/${faqItemId}`)
    return response.data
  } catch (error) {
    handleApiError(error, toast, "La question n'a pas pu être supprimée.")
    throw error
  }
}
