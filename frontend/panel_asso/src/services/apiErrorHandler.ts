import axios, { AxiosError } from 'axios'
import type { ToastServiceMethods } from 'primevue/toastservice'

export interface ApiResponse<T> {
  data: T
  message?: string
}

export const handleApiError = (
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
