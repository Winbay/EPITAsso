import axios, { AxiosError } from 'axios'
import type { ToastServiceMethods } from 'primevue/toastservice'
import type { Association } from '@/types/associationInterfaces'

interface ApiResponse<T> {
  data: T
  message?: string
}

const handleApiError = (
  error: AxiosError | unknown,
  toast: ToastServiceMethods,
  customMessage?: string
): void => {
  let errorMessage = 'Une erreur est survenue lors de la requête API.'

  if (!axios.isAxiosError(error)) {
    errorMessage = 'Une erreur inconnue est survenue.'
  } else if (error.response) {
    const responseData = error.response.data as ApiResponse<any>
    errorMessage = responseData.message || errorMessage
  } else if (error.request) {
    errorMessage = 'Aucune réponse du serveur. Veuillez réessayer plus tard.'
  } else {
    errorMessage = 'Une erreur est survenue lors de la configuration de la requête.'
  }

  if (customMessage) {
    errorMessage = customMessage
  }

  toast.add({
    severity: 'error',
    summary: 'Associations',
    detail: errorMessage,
    life: 5000
  })
}

export async function loadAssociations(toast: ToastServiceMethods) {
  try {
    const response = await axios.get<Association[]>('/api/associations')
    return response.data
  } catch (error) {
    handleApiError(error, toast, "La liste des associations n'a pas pu être chargée.")
    throw error
  }
}

export async function getAssociationById(id: number, toast: ToastServiceMethods) {
  try {
    const response = await axios.get<Association>(`/api/associations/${id}`)
    return response.data
  } catch (error) {
    handleApiError(error, toast, "L'association n'a pas pu être chargée.")
    throw error
  }
}

export async function updateAssociation(association: Association, toast: ToastServiceMethods) {
  try {
    await axios.put<Association>(`/api/associations/${association.id}`, association)
    toast.add({
      severity: 'success',
      summary: 'Associations',
      detail: "L'association a bien été mise à jour.",
      life: 5000
    })
    return true
  } catch (error) {
    handleApiError(error, toast, "L'association n'a pas pu être mise à jour.")
    throw error
  }
}
