import fixture from 'can-fixture'

let events = [
  {
    id: 1,
    title: "Titre d'un évènement",
    content: 'Some content...',
    author: 'Célian Cusey',
    tags: [1, 2],
    startDate: Date.now() / 1000,
    endDate: Date.now() / 1000,
    recurrent: false,
    frequency: 0,
    endRecurrence: Date.now() / 1000
  },
  {
    id: 2,
    title: "Deuxième exemple de titre d'évènement",
    content: 'Some content...',
    author: 'Nathan Lenogue',
    tags: [4, 5],
    startDate: Date.now() / 1000,
    endDate: Date.now() / 1000,
    recurrent: false,
    frequency: 0,
    endRecurrence: Date.now() / 1000
  }
]

fixture('GET /api/events/tags', () => {
  return [
    { id: 1, name: 'Afterwork' },
    { id: 2, name: 'Soirée' },
    { id: 3, name: 'Tournoi' },
    { id: 4, name: 'TeamBuilding' },
    { id: 5, name: 'Sport' },
    { id: 6, name: 'Conférence' }
  ]
})

// TIPS: uncomment this to test the error on events loading
// fixture('GET /api/events/tags', (request, response) => {
//   response(500, "Erreur au niveau du serveur...");
// });

fixture('GET /api/events', () => {
  return events
})

// TIPS: uncomment this to test the error on events loading
// fixture('GET /api/events', (request, response) => {
//   response(500, "Erreur au niveau du serveur...");
// });

fixture('POST /api/events', (request, response) => {
  let newEvent = request.data
  newEvent.id = events[events.length - 1].id + 1
  events.push(newEvent)
  response(201)
})

fixture('PUT /api/events/{id}', (request, response) => {
  const id = parseInt(request.data.id)
  const index = events.findIndex((item) => item.id === id)
  if (index !== -1) {
    let newEvent = request.data
    newEvent.id = id
    events.splice(index, 1, newEvent)
  }
  response(201)
})

fixture('DELETE /api/events/{id}', (request, response) => {
  const id = parseInt(request.data.id)
  events = events.filter((event) => event.id !== id)
  response(201)
})

fixture('POST /api/users', (request, response) => {
  const newUser = JSON.parse(request.data)
  newUser.id = Date.now()
  response(200, newUser)
})

export default fixture
