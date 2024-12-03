export function getSocialNetworkImage(name: string) {
  switch (name) {
    case 'Website': {
      return 'pi pi-globe'
    }
    case 'Mail': {
      return 'pi pi-at'
    }
    case 'Facebook': {
      return 'pi pi-facebook'
    }
    case 'Instagram': {
      return 'pi pi-instagram'
    }
    case 'X': {
      return 'pi pi-twitter'
    }
    case 'Discord': {
      return 'pi pi-discord'
    }
    case 'Linkedin': {
      return 'pi pi-linkedin'
    }
    case 'Github': {
      return 'pi pi-github'
    }
    case 'Youtube': {
      return 'pi pi-youtube'
    }
    default: {
      return 'pi pi-external-link\n'
    }
  }
}
