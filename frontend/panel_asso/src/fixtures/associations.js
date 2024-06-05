import fixture from 'can-fixture'

let faqItems = [
  { id: 1, question: 'Question 1', answer: 'Réponse 1' },
  { id: 2, question: 'Question 2', answer: 'Réponse 2' },
  { id: 3, question: 'Question 3', answer: 'Réponse 3' },
  { id: 4, question: 'Question 4', answer: 'Réponse 4' }
]

let images = [
  {
    id: 1,
    url: 'https://yt3.googleusercontent.com/cOzPj17JbobUiEmTVMe2jmNPuy5LOExELFWjx8eIOlgK__wStz5hWIRzqivRsGiz-Lot-0XR=s900-c-k-c0x00ffffff-no-rj'
  },
  { id: 2, url: 'https://bdekraken.fr/assets/kraken.png' }
]

let socialNetworks = [
  {
    id: 1,
    name: 'Instagram',
    link: 'https://www.instagram.com/'
  },
  {
    id: 2,
    name: 'Discord',
    link: 'https://discord.com/'
  }
]

let associations = [
  {
    id: 1,
    name: 'EPTV',
    description: 'Ceci est une description.',
    location: 'VJ',
    logo: images[0],
    socialNetworks: [socialNetworks[0], socialNetworks[1]],
    faq: [faqItems[0], faqItems[1]]
  },
  {
    id: 2,
    name: 'Kraken',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.',
    location: 'KB',
    logo: images[1],
    socialNetworks: [socialNetworks[1]],
    faq: [faqItems[2], faqItems[3]]
  }
]

fixture('GET /api/associations', () => {
  return associations
})

fixture('GET /api/associations/{id}', (request) => {
  const id = parseInt(request.data.id)
  return associations.find((asso) => asso.id === id)
})

fixture('POST /api/associations', (request, response) => {
  let newAsso = request.data
  newAsso.id = associations[associations.length - 1].id + 1
  const index = images.findIndex((image) => image.id === newAsso.logo)
  if (index !== -1) {
    newAsso.logo = images[index]
  }
  associations.push(newAsso)
  response(201)
})

fixture('POST /api/images', () => {
  const nextId = images[images.length - 1].id + 1
  images.push({
    id: nextId,
    url: 'https://www.shutterstock.com/image-vector/default-ui-image-placeholder-wireframes-260nw-1037719192.jpg'
  })
  return images[images.length - 1]
})

fixture('PUT /api/associations/{id}', (request, response) => {
  let id = parseInt(request.data.id)
  const index = associations.findIndex((item) => item.id === id)
  if (index !== -1) {
    let newAsso = request.data
    newAsso.id = id
    associations.splice(index, 1, newAsso)
  }
  response(201)
})

export default fixture
