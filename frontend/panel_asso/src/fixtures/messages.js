import fixture from 'can-fixture'
import { conversations } from '@/fixtures/conversations.js'


export let messages = [
  {
    id: 1,
    content: 'Hello',
    user_sender: 1,
    sent_date: '2021-01-01T00:00:00.000Z',
    conversation: 1,
    association: 1,
  },
  {
    id: 2,
    content: 'Hi',
    user_sender: 2,
    sent_date: '2021-01-01T00:00:00.000Z',
    conversation: 1,
    association: 1,
  },
  {
    id: 3,
    content: 'Hey',
    user_sender: 1,
    sent_date: '2021-01-01T00:00:00.000Z',
    conversation: 2,
    association: 1,
  },
  {
    id: 4,
    content: 'Salut',
    user_sender: 2,
    sent_date: '2021-01-01T00:00:00.000Z',
    conversation: 2,
    association: 1,
  }
]


fixture('GET /api/message', () => {
  return messages
})

fixture('POST /api/message', (request, response) => {
  let newMessage = request.data
  const conversation = conversations.find((conversation) => conversation.id === newMessage.conversation)
  newMessage.id = messages[messages.length - 1].id + 1
  newMessage.sent_date = new Date().toISOString()
  messages.push(newMessage)
  conversation.messages.push(newMessage)
  response(201, newMessage)
})