import fixture from 'can-fixture'

let faq_items = [
  { id: 1, question: 'Question 1', answer: 'Réponse 1' },
  { id: 2, question: 'Question 2', answer: 'Réponse 2' },
  { id: 3, question: 'Question 3', answer: 'Réponse 3' },
  { id: 4, question: 'Question 4', answer: 'Réponse 4' }
]

let logos = [
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
    logo: logos[0],
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
    logo: logos[1],
    members: [],
    social_networks: [social_networks[0]],
    faq: [faq_items[2], faq_items[3]]
  }
]

fixture('GET /api/associations/', () => {
  return associations.map((asso) => {
    return {
      id: asso.id,
      name: asso.name,
      description: asso.description,
      location: asso.location,
      logo: asso.logo
    }
  })
})

fixture('GET /api/associations/{id}/', (request) => {
  const id = parseInt(request.data.id)
  const index = associations.findIndex((asso) => asso.id === id)
  if (index !== -1) {
    return {
      id: associations[index].id,
      name: associations[index].name,
      description: associations[index].description,
      location: associations[index].location,
      logo: associations[index].logo
    }
  }
})

fixture('GET /api/associations/{id}/details/', (request) => {
  const id = parseInt(request.data.id)
  return associations.find((asso) => asso.id === id)
})

fixture('POST /api/images', () => {
  const nextId = logos[logos.length - 1].id + 1
  logos.push({
    id: nextId,
    url: 'https://www.shutterstock.com/image-vector/default-ui-image-placeholder-wireframes-260nw-1037719192.jpg'
  })
  return logos[logos.length - 1]
})

fixture('PUT /api/associations/{id}/', (request, response) => {
  let id = parseInt(request.data.id)
  const index = associations.findIndex((item) => item.id === id)
  if (index !== -1) {
    let newAsso= {
      ...associations[index],
      ...request.data,
      id: id
    }
    associations.splice(index, 1, newAsso)
  }
  response(201)
})

fixture('DELETE /api/associations/{id}/', (request, response) => {
  let id = parseInt(request.data.id)
  const index = associations.findIndex((item) => item.id === id)
  if (index !== -1) {
    associations.splice(index, 1)
  }
  response(204)
})

fixture('GET /api/associations/{id}/faqs/', (request) => {
  const id = parseInt(request.data.id)
  return associations.find((asso) => asso.id === id).faq
})

fixture('POST /api/associations/{id}/faqs/', (request, response) => {
  const id = parseInt(request.data.id)
  const index = associations.findIndex((asso) => asso.id === id)
  if (index !== -1) {
    const newFaq = request.data
    if (faq_items.length === 0) {
      newFaq.id = 1
    }
    else {
      newFaq.id = faq_items[faq_items.length - 1].id + 1
    }
    faq_items.push(newFaq)
    associations[index].faq.push(newFaq)
  }
  response(201, request.data)
})

fixture('PUT /api/associations/{id}/faqs/{faq_id}/', (request, response) => {
  const id = parseInt(request.data.id)
  const faq_id = parseInt(request.data.faq_id)
  delete request.data.faq_id
  const index = associations.findIndex((asso) => asso.id === id)
  if (index !== -1) {
    const newFaqItem = {
      ...request.data,
      id: faq_id
    }
    let faq_index = faq_items.findIndex((faq) => faq.id === faq_id)
    if (faq_index !== -1) {
      faq_items.splice(faq_index, 1, newFaqItem)
      faq_index = associations[index].faq.findIndex((faq) => faq.id === faq_id)
      if (faq_index !== -1) {
        associations[index].faq.splice(faq_index, 1, newFaqItem)
      }
    }
  }
  response(201)
})

fixture('DELETE /api/associations/{id}/faqs/{faq_id}/', (request, response) => {
  const id = parseInt(request.data.id)
  const faq_id = parseInt(request.data.faq_id)
  delete request.data.faq_id
  const index = associations.findIndex((asso) => asso.id === id)
  if (index !== -1) {
    let faq_index = associations[index].faq.findIndex((faq) => faq.id === faq_id)
    if (faq_index !== -1) {
      associations[index].faq.splice(faq_index, 1)
      faq_index = faq_items.findIndex((faq) => faq.id === faq_id)
      if (faq_index !== -1) {
        faq_items.splice(faq_index, 1)
      }
    }
  }
  response(204)
})

fixture('GET /api/associations/{id}/socialNetworks/', (request) => {
  const id = parseInt(request.data.id)
  return associations.find((asso) => asso.id === id).social_networks
})

fixture('POST /api/associations/{id}/socialNetworks/', (request, response) => {
  const id = parseInt(request.data.id)
  const index = associations.findIndex((asso) => asso.id === id)
  if (index !== -1) {
    const newSocialNetwork = request.data
    if (social_networks.length === 0) {
      newSocialNetwork.id = 1
    }
    else {
      newSocialNetwork.id = social_networks[social_networks.length - 1].id + 1
    }
    social_networks.push(newSocialNetwork)
    associations[index].social_networks.push(newSocialNetwork)
  }
  response(201, request.data)
})

fixture('PUT /api/associations/{id}/socialNetworks/{social_network_id}/', (request, response) => {
  const id = parseInt(request.data.id)
  const social_network_id = parseInt(request.data.social_network_id)
  delete request.data.social_network_id
  const index = associations.findIndex((asso) => asso.id === id)
  if (index !== -1) {
    const newSocialNetwork = {
      ...request.data,
      id: social_network_id
    }
    let social_network_index = social_networks.findIndex((social_network) => social_network.id === social_network_id)
    if (social_network_index !== -1) {
      social_networks.splice(social_network_index, 1, newSocialNetwork)
      social_network_index = associations[index].social_networks.findIndex((social_network) => social_network.id === social_network_id)
      if (social_network_index !== -1) {
        associations[index].social_networks.splice(social_network_index, 1, newSocialNetwork)
      }
    }
  }
  response(201)
})

fixture('DELETE /api/associations/{id}/socialNetworks/{social_network_id}/', (request, response) => {
  const id = parseInt(request.data.id)
  const social_network_id = parseInt(request.data.social_network_id)
  delete request.data.social_network_id
  const index = associations.findIndex((asso) => asso.id === id)
  if (index !== -1) {
    let social_network_index = associations[index].social_networks.findIndex((social_network) => social_network.id === social_network_id)
    if (social_network_index !== -1) {
      associations[index].social_networks.splice(social_network_index, 1)
      social_network_index = social_networks.findIndex((social_network) => social_network.id === social_network_id)
      if (social_network_index !== -1) {
        social_networks.splice(social_network_index, 1)
      }
    }
  }
  response(204)
})

fixture('GET /api/associations/{id}/members/', (request) => {
  const id = parseInt(request.data.id)
  return associations.find((asso) => asso.id === id).members
})

fixture('POST /api/associations/{id}/members/', (request, response) => {
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

fixture('PUT /api/associations/{id}/members/{member_id}/', (request, response) => {
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

fixture('DELETE /api/associations/{id}/members/{member_id}/', (request, response) => {
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
