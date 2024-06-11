import fixture from 'can-fixture'

let faq_items = [
  { id: 1, question: 'Question 1', answer: 'Réponse 1' },
  { id: 2, question: 'Question 2', answer: 'Réponse 2' },
  { id: 3, question: 'Question 3', answer: 'Réponse 3' },
  { id: 4, question: 'Question 4', answer: 'Réponse 4' }
]

let images = [
  'https://yt3.googleusercontent.com/cOzPj17JbobUiEmTVMe2jmNPuy5LOExELFWjx8eIOlgK__wStz5hWIRzqivRsGiz-Lot-0XR=s900-c-k-c0x00ffffff-no-rj',
  'https://bdekraken.fr/assets/kraken.png'
]

let social_networks = [
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
    logoUrl: images[0],
    members: [],
    social_networks: [social_networks[0], social_networks[1]],
    faq: [faq_items[0], faq_items[1]]
  },
  {
    id: 2,
    name: 'Kraken',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.',
    location: 'KB',
    logoUrl: images[1],
    members: [],
    social_networks: [social_networks[0]],
    faq: [faq_items[2], faq_items[3]]
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
  const index = images.findIndex((image) => image.id === newAsso.logoUrl)
  if (index !== -1) {
    newAsso.logoUrl = images[index]
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

fixture('DELETE /api/associations/{id}', (request, response) => {
  let id = parseInt(request.data.id)
  const index = associations.findIndex((item) => item.id === id)
  if (index !== -1) {
    associations.splice(index, 1)
  }
  response(204)
})

fixture('GET /api/associations/{id}/faq', (request) => {
  const id = parseInt(request.data.id)
  return associations.find((asso) => asso.id === id).faq
})

fixture('POST /api/associations/{id}/faq', (request, response) => {
  const id = parseInt(request.data.id)
  const index = associations.findIndex((asso) => asso.id === id)
  if (index !== -1) {
    const newFaq = request.data
    if (associations[index].faq.length === 0) {
      newFaq.id = 1
    } else {
      newFaq.id = associations[index].faq[associations[index].faq.length - 1].id + 1
    }
    associations[index].faq.push(newFaq)
  }
  response(201, request.data)
})

fixture('PUT /api/associations/{id}/faq/{faq_id}', (request, response) => {
  const id = parseInt(request.data.id)
  const faq_id = parseInt(request.data.faq_id)
  const newFaqItem = { id: faq_id, question: request.data.question, answer: request.data.answer }
  const index = associations.findIndex((asso) => asso.id === id)
  if (index !== -1) {
    const faq_index = associations[index].faq.findIndex((faq) => faq.id === faq_id)
    if (faq_index !== -1) {
      associations[index].faq.splice(faq_index, 1, newFaqItem)
    }
  }
  response(201, newFaqItem)
})

fixture('DELETE /api/associations/{id}/faq/{faq_id}', (request, response) => {
  const id = parseInt(request.data.id)
  const faq_id = parseInt(request.data.faq_id)
  const index = associations.findIndex((asso) => asso.id === id)
  if (index !== -1) {
    const faq_index = associations[index].faq.findIndex((faq) => faq.id === faq_id)
    if (faq_index !== -1) {
      associations[index].faq.splice(faq_index, 1)
    }
  }
  response(204, faq_id)
})

fixture('GET /api/associations/{id}/members', (request) => {
  const id = parseInt(request.data.id)
  return associations.find((asso) => asso.id === id).members
})

fixture('POST /api/associations/{id}/members', (request, response) => {
  const id = parseInt(request.data.id)
  const index = associations.findIndex((asso) => asso.id === id)
  if (index !== -1) {
    const newMember = request.data
    if (associations[index].members.length === 0) {
      newMember.id = 1
    } else {
      newMember.id = associations[index].members[associations[index].members.length - 1].id + 1
    }
    associations[index].members.push(newMember)
  }
  response(201, request.data)
})

fixture('PUT /api/associations/{id}/members/{member_id}', (request, response) => {
  const id = parseInt(request.data.id)
  const member_id = parseInt(request.data.member_id)
  const index = associations.findIndex((asso) => asso.id === id)
  if (index !== -1) {
    const member_index = associations[index].members.findIndex((member) => member.id === member_id)
    if (member_index !== -1) {
      associations[index].members.splice(member_index, 1, request.data)
    }
  }
  response(201, request.data)
})

fixture('DELETE /api/associations/{id}/members/{member_id}', (request, response) => {
  const id = parseInt(request.data.id)
  const member_id = parseInt(request.data.member_id)
  const index = associations.findIndex((asso) => asso.id === id)
  if (index !== -1) {
    const member_index = associations[index].members.findIndex((member) => member.id === member_id)
    if (member_index !== -1) {
      associations[index].members.splice(member_index, 1)
    }
  }
  response(204, member_id)
})

export default fixture
