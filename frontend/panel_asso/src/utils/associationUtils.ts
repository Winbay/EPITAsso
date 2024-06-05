export function getSocialNetworkImage(name: string) {
  switch (name) {
    case 'Instagram':
      return '/images/instagram-logo.png'
    case 'Discord':
      return '/images/discord-logo.png'
    case 'Twitch':
      return '/images/twitch-logo.png'
    case 'Twitter':
      return '/images/twitter-logo.png'
    default:
      return '/images/default-social-network-logo.png'
  }
}
