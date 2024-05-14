import fixture from 'can-fixture'

let studentEngagements = [
  {
    id: 1,
    login: 'john.doe',
    name: 'Doe',
    firstname: 'John',
    promotion: '2024',
    position: { id: 1, name: 'Membre' },
    comment: "Très investis dans l'association",
    activities: [
      { text: 'Vente crepes', hours: 2 },
      { text: 'Afterwork 15/11', hours: 5 },
      { text: 'JPO 17/12', hours: 5 }
    ],
    totalHours: 12,
    status: { id: 1, name: 'En attente', comment: '' }
  },
  {
    id: 2,
    login: 'jane.doe',
    name: 'Doe',
    firstname: 'Jane',
    promotion: '2024',
    position: { id: 2, name: 'Président'},
    comment: "Présidente de l'association",
    activities: [
      { text: 'Vente crepes', hours: 2 },
      { text: 'Afterwork 15/11', hours: 3 },
      { text: 'JPO 17/12', hours: 3 }
    ],
    totalHours: 12,
    status: { id: 4, name: 'Refusé', comment: 'Activité 2 non validée' }
  },
  {
    id: 3,
    login: 'john.smith',
    name: 'Smith',
    firstname: 'John',
    promotion: '2024',
    position: { id: 3, name: 'Vice-Président' },
    comment: "Vice-président de l'association",
    activities: [
      { text: 'Vente crepes', hours: 2 },
      { text: 'Afterwork 15/11', hours: 3 },
      { text: 'JPO 17/12', hours: 3 }
    ],
    totalHours: 12,
    status: { id: 2, name: 'Validé', comment: '' }
  }
]

let positions = [
  { id: 1, name: 'Membre' },
  { id: 2, name: 'Président' },
  { id: 3, name: 'Vice-Président' },
  { id: 4, name: 'Secrétaire' },
  { id: 5, name: 'Trésorier' }
]

let status = [
  { id: 1, name: 'En attente', comment: ''},
  { id: 2, name: 'Validé', comment: '' },
  { id: 3, name: 'Validé avec modifications', comment: '' },
  { id: 4, name: 'Refusé' , comment: ''}
]

fixture('GET /api/studentEngagements', () => {
  return studentEngagements
})

fixture('GET /api/studentEngagements/{id}', (request) => {
  const id = parseInt(request.data.id)
  return studentEngagements.find((studentEngagement) => studentEngagement.id === id)
})

fixture('GET /api/studentEngagements/positions', () => {
  return positions
})

fixture('GET /api/studentEngagements/positions/{id}', (request) => {
  const id = parseInt(request.data.id)
  return positions.find((position) => position.id === id)
})

fixture('GET /api/studentEngagements/status', () => {
  return status
})

fixture('POST /api/studentEngagements', (request, response) => {
  let studentEngagement = request.data
  studentEngagement.id = studentEngagements[studentEngagements.length - 1].id + 1
  studentEngagements.push(studentEngagement)
  response(201)
})

fixture('PUT /api/studentEngagements/{id}', (request, response) => {
  let id = parseInt(request.data.id)
  const index = studentEngagements.findIndex((item) => item.id === id)
  if (index !== -1) {
    let newStudentEngagement = request.data
    newStudentEngagement.id = id
    studentEngagements.splice(index, 1, newStudentEngagement)
  }
  response(201)
})

fixture('DELETE /api/studentEngagements/{id}', (request, response) => {
  let id = parseInt(request.data.id)
  const index = studentEngagements.findIndex((item) => item.id === id)
  if (index !== -1) {
    studentEngagements.splice(index, 1)
  }
  response(204)
})
