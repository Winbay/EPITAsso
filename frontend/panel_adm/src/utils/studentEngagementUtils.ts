import { type Status, StatusEnum, type StudentEngagement } from '@/types/studentEngagementInterface'

export function getDefaultStudentEngagement(): StudentEngagement {
  return {
    id: 0,
    login: '',
    name: '',
    firstname: '',
    promotion: '',
    position: { id: 0, name: 'Pas de poste' },
    comment: '',
    activities: [],
    totalHours: 0,
    status: { name: '', comment: 'Pas de status' },
  };

}

export function deepEqual(obj1: any, obj2: any): boolean {
  if (obj1 === null || obj2 === null || obj1 === undefined || obj2 === undefined) {
    return obj1 === obj2;
  }

  if (typeof obj1 !== typeof obj2) {
    return false;
  }

  if (typeof obj1 === 'object' && typeof obj2 === 'object') {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) {
      return false;
    }

    return keys1.every(key => deepEqual(obj1[key], obj2[key]));
  }

  return obj1 === obj2;
}

export function getStatusSeverity(status: Status): 'warning' | 'success' | 'danger' | '' {
  switch (status.name) {
    case StatusEnum.WAITING:
      return 'warning';
    case StatusEnum.VALIDATED:
    case StatusEnum.VALIDATED_WITH_MODIFICATIONS:
      return 'success';
    case StatusEnum.REFUSED:
      return 'danger';
    default:
      return '';
  }
}