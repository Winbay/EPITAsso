import fixture from 'can-fixture'
import { conversations } from '@/fixtures/conversations.js'
import { users } from '@/fixtures/users.js'
import { associations } from '@/fixtures/associations.js'


export let messages = [
  {
    id: 1,
    conversation: conversations[0],
    content: 'Hello',
    author: users[0],
    association_sender: associations[0],
    sent_at: '2021-01-01T00:00:00.000Z',
  },
  {
    id: 2,
    conversation: conversations[0],
    content: 'Hi',
    author: users[1],
    association_sender: associations[1],
    sent_at: '2021-01-02T00:00:00.000Z',
  }
]


fixture('GET /api/messages/', () => {
  return messages
})

fixture('GET /api/conversations/{id}/messages/', (request) => {
  const id = parseInt(request.data.id)
  return messages.filter((message) => message.conversation.id === id)
})

fixture('POST /api/conversations/{id}/messages/', (request) => {
  console.log(request)
  const id = parseInt(request.data.id)
  const message = {
    id: messages.length + 1,
    conversation: conversations.find((conversation) => conversation.id === id),
    content: request.data.content,
    author: users.find((user) => user.id === request.data.author.id),
    association_sender: associations.find((association) => association.id === request.data.association_sender.id),
    sent_at: new Date().toISOString()
  }
  messages.push(message)
  return message
})