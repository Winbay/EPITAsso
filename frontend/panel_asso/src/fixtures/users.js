import fixture from 'can-fixture'

export let users = [
  {
    id: "1",
    login: 'john.doe',
    email: 'john.doe@epita.fr',
    firstName: 'John',
    lastName: 'Doe',
    school: 'epita',
    isAdmin: true,
    associations: [0]
  },
  {
    id: "2",
    login: 'jane.doe',
    email: 'jane.doe@epita.fr',
    firstName: 'Jane',
    lastName: 'Doe',
    school: 'epita',
    isAdmin: false,
    associations: [1, 2]
  }
]

fixture('GET /api/user', () => {
  return users
})

fixture('GET /api/user/{id}', (request) => {
  const id = request.data.id
  return users.find((user) => user.id === id)
})