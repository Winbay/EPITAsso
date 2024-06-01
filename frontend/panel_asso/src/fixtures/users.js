import fixture from 'can-fixture'

export let users = [
  {
    id: 1,
    name: 'John Doe',
  },
  {
    id: 2,
    name: 'Jane Doe',
  }
]

fixture('GET /api/user', () => {
  return users
})

fixture('GET /api/user/{id}', (request) => {
  const id = parseInt(request.data.id)
  return users.find((user) => user.id === id)
})