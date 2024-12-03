export interface SocialNetworkType {
  label: string
  value: string
  icon: string
}

export const socialNetworkTypes: SocialNetworkType[] = [
  { label: 'Website', value: 'Website', icon: 'pi pi-globe' },
  { label: 'Mail', value: 'Mail', icon: 'pi pi-at' },
  { label: 'Facebook', value: 'Facebook', icon: 'pi pi-facebook' },
  { label: 'Instagram', value: 'Instagram', icon: 'pi pi-instagram' },
  { label: 'X', value: 'X', icon: 'pi pi-twitter' },
  { label: 'Discord', value: 'Discord', icon: 'pi pi-discord' },
  { label: 'Linkedin', value: 'Linkedin', icon: 'pi pi-linkedin' },
  { label: 'Github', value: 'Github', icon: 'pi pi-github' },
  { label: 'Youtube', value: 'Youtube', icon: 'pi pi-youtube' }
]

export function getSocialNetworkIcon(name: string): string {
  const network = socialNetworkTypes.find((type) => type.value === name)
  return network ? network.icon : 'pi pi-external-link'
}
