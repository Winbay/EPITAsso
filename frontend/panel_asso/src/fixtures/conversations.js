import fixture from 'can-fixture'
import { associations } from './associations.js'
import { messages } from './messages.js'

export let conversations = [
  {
    id: 1,
    name: 'Conversation 1',
    associations: [associations[0], associations[1]],
    messages: [messages[0], messages[1]]
  },
  {
    id: 2,
    name: 'Conversation 2',
    associations: [associations[0]],
    messages: [messages[2], messages[3]]
  }
]

fixture('GET /api/conversation', (request) => {
  const associationId = parseInt(request.data.associationId)
  if (associationId) {
    return conversations.filter((conversation=> {
      return conversation.associations.some((association) => association.id === associationId)
    }))
  }
  return conversations
})

fixture('GET /api/conversation/{id}', (request) => {
  const id = parseInt(request.data.id)
  return conversations.find((conversation) => conversation.id === id)
})

fixture('POST /api/conversation', (request, response) => {
  let newConversation = request.data
  newConversation.id = conversations[conversations.length - 1].id + 1
  newConversation.messages = []
  conversations.push(newConversation)
  response(201, newConversation)
})

fixture('DELETE /api/conversation/{id}', (request, response) => {
  const id = parseInt(request.data.id)
  const index = conversations.findIndex((conversation) => conversation.id === id)
  conversations.splice(index, 1)
  response(204)
})