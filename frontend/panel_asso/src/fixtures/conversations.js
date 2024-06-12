import fixture from 'can-fixture'
import { associations } from '@/fixtures/associations.js'

export let conversations = [
  {
    id: 1,
    name: 'Conversation 1',
    associations_in_conversation: [associations[0], associations[1]],
    last_sent_at: '2018-01-01T00:00:00Z',
  },
  {
    id: 2,
    name: 'Conversation 2',
    associations_in_conversation: [associations[0]],
    last_sent_at: '2018-01-02T00:00:00Z',
  }
]

fixture('GET /api/associations/{id}/conversations/', (request) => {
  const id = parseInt(request.data.id)
  return conversations.filter((conversation) => {
    return conversation.associations_in_conversation.find((association) => association.id === id)
  })
})

fixture('POST /api/associations/{association_id}/conversations/', (request) => {
  const association_id = parseInt(request.data.association_id)
  const conversation = {
    id: conversations[conversations.length - 1].id + 1,
    name: request.data.name,
    associations_in_conversation: [associations.find((association) => association.id === association_id)],
    last_sent_at: new Date().toISOString()
  }
  conversations.push(conversation)
  return conversation
})

fixture('DELETE /api/associations/{association_id}/conversations/{conversation_id}/', (request) => {
  const association_id = parseInt(request.data.association_id)
  const conversation_id = parseInt(request.data.conversation_id)
  const conversation = conversations.find((conversation) => conversation.id === conversation_id)
  const index = conversation.associations_in_conversation.findIndex((association) => association.id === association_id)
  conversation.associations_in_conversation.splice(index, 1)
  return conversation
})