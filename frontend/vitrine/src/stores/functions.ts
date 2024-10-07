import {defineStore} from "pinia";

export const useFunctionsStore = defineStore('functions', () => {
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

  return {
    getSocialNetworkIcon
  }
})