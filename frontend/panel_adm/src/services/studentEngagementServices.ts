import axios, { AxiosError } from 'axios';
import type { Position, Status, StudentEngagement } from '@/types/studentEngagementInterface';
import type { ToastServiceMethods } from 'primevue/toastservice'

interface ApiResponse<T> {
  data: T;
  message?: string;
}

const handleApiError = (error: AxiosError | unknown, toast: ToastServiceMethods, customMessage?: string): void => {
  let errorMessage = 'Une erreur est survenue lors de la requête API.';

  if (!axios.isAxiosError(error)) {
    errorMessage = 'Une erreur inconnue est survenue.';
  } else

  if (error.response) {
    const responseData = error.response.data as ApiResponse<any>;
    errorMessage = responseData.message || errorMessage;
  } else if (error.request) {
    errorMessage = 'Aucune réponse du serveur. Veuillez réessayer plus tard.';
  } else {
    errorMessage = 'Une erreur est survenue lors de la configuration de la requête.';
  }

  if (customMessage) {
    errorMessage = customMessage;
  }

  toast.add({
    severity: 'error',
    summary: 'Erreur API',
    detail: errorMessage,
    life: 5000
  });
};

export async function loadPosition(toast: ToastServiceMethods) {
  try {
    const response = await axios.get<Position[]>('/api/studentEngagements/positions');
    return response.data;
  } catch (error) {
    handleApiError(error, toast, "La liste des postes n'a pas pu être chargée.");
    throw error;
  }
}

export async function loadStatus(toast: ToastServiceMethods) {
  try {
    const response = await axios.get<Status[]>('/api/studentEngagements/status');
    return response.data;
  } catch (error) {
    handleApiError(error, toast, "La liste des status n'a pas pu être chargée.");
    throw error;
  }
}

export async function loadStudentEngagements(toast: ToastServiceMethods) {
  try {
    const response = await axios.get<StudentEngagement[]>('/api/studentEngagements');
    return response.data;
  } catch (error) {
    handleApiError(error, toast, "La liste des engagements étudiant n'a pas pu être chargée.");
    throw error;
  }
}

export async function updateStudentEngagement(studentEngagement: StudentEngagement, toast: ToastServiceMethods) {
  try {
    await axios.put(`/api/studentEngagements/${studentEngagement.id}`, studentEngagement);
    toast.add({
      severity: 'success',
      summary: 'Engagement étudiant',
      detail: "L'engagement étudiant a bien été modifié.",
      life: 3000
    });
    return true;
  } catch (error) {
    handleApiError(error, toast, "L'engagement étudiant n'a pas pu être modifié.");
    throw error;
  }
}
