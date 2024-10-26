import {defineStore} from "pinia";
import { ref } from 'vue'

export const useFunctionsStore = defineStore('functions', () => {
  const shouldReloadHeader = ref(false);

  const triggerHeaderReload = () => {
    shouldReloadHeader.value = !shouldReloadHeader.value;
  };

  function getSocialNetworkIcon(name: string): string {
    switch (name) {
      case "Website": {
        return "pi pi-globe";
      }
      case "Mail": {
        return "pi pi-at"
      }
      case "Facebook": {
        return "pi pi-facebook"
      }
      case "Instagram": {
        return "pi pi-instagram"
      }
      case "X": {
        return "pi pi-twitter"
      }
      case "Discord": {
        return "pi pi-discord"
      }
      default: {
        return "pi pi-external-link\n"
      }
    }
  }

  function formatDateRange(date1: Date, date2: Date): string {
    const formatDate = (date: Date): string => {
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${day}/${month}/${year} ${hours}:${minutes}`;
    };

    const isSameDay = (date1: Date, date2: Date): boolean => {
      return (
        date1.getDate() === date2.getDate() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getFullYear() === date2.getFullYear()
      );
    };

    if (date1.getTime() === date2.getTime()) {
      return formatDate(date1);
    }

    if (isSameDay(date1, date2)) {
      return `${formatDate(date1)} - ${date2.getHours().toString().padStart(2, '0')}:${date2.getMinutes().toString().padStart(2, '0')}`;
    }

    return `${formatDate(date1)} - ${formatDate(date2)}`;
  }

  return {
    shouldReloadHeader,
    triggerHeaderReload,
    getSocialNetworkIcon,
    formatDateRange
  }
})