import fixture from 'can-fixture'

export let users = [
  {
    id: "1",
    login: 'nathan.lenogue',
    first_name: 'John',
    last_name: 'Doe',
  },
  {
    id: "2",
    login: 'jane.doe',
    first_name: 'Jane',
    last_name: 'Doe',
  }
]

fixture('GET /api/user', () => {
  return users
})

fixture('GET /api/user/{id}', (request) => {
  const id = request.data.id
  return users.find((user) => user.id === id)
})