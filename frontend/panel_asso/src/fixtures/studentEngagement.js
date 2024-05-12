import fixture from 'can-fixture';

let studentEngagements = [
  {
    id: 1,
    login: 'john.doe',
    name: 'Doe',
    firstname: 'John',
    promotion: '2024',
    position: 1,
    comment: 'Très investis dans l\'association',
    activities: [
      { text: 'Vente crepes', hours: 2 },
      { text: 'Afterwork 15/11', hours: 5 },
      { text: 'JPO 17/12', hours: 5 }
    ],
    totalHours: 12,
    totalDays: 1,
    status: 1
  },
  {
    id: 2,
    login: 'jane.doe',
    name: 'Doe',
    firstname: 'Jane',
    promotion: '2024',
    position: 2,
    comment: 'Présidente de l\'association',
    activities: [
      { text: 'Vente crepes', hours: 2 },
      { text: 'Afterwork 15/11', hours: 5 },
      { text: 'JPO 17/12', hours: 5 }
    ],
    totalHours: 12,
    totalDays: 1,
    status: 4
  }];


fixture('GET /api/studentEngagements', () => {
  return studentEngagements;
});

fixture('GET /api/studentEngagements/{id}', (request) => {
  const id = parseInt(request.data.id);
  return studentEngagements.find(studentEngagement => studentEngagement.id === id);
});

fixture('GET /api/studentEngagements/positions', () => {
  return [
    { id: 1, name: "Membre" },
    { id: 2, name: "Président" },
    { id: 3, name: "Vice-Président" },
    { id: 4, name: "Secrétaire" },
    { id: 5, name: "Trésorier" },
  ];
});

fixture('GET /api/studentEngagements/status', () => {
  return [
    { id: 1, name: "Validé" },
    { id: 2, name: "En attente" },
    { id: 3, name: "Validé avec modifications" },
    { id: 4, name: "Refusé" },
  ];
});

fixture('POST /api/studentEngagements', (request, response) => {
  let studentEngagement = request.data;
  studentEngagement.id = studentEngagements[studentEngagements.length - 1].id + 1;
  studentEngagements.push(studentEngagement);
  response(201);
});

fixture('PUT /api/studentEngagements/{id}', (request, response) => {
  let id = parseInt(request.data.id);
  const index = studentEngagements.findIndex(item => item.id === id);
  if (index !== -1) {
    let newStudentEngagement = request.data;
    newStudentEngagement.id = id;
    studentEngagements.splice(index, 1, newStudentEngagement);
  }
  response(201);
});

fixture('DELETE /api/studentEngagements/{id}', (request, response) => {
  let id = parseInt(request.data.id);
  const index = studentEngagements.findIndex(item => item.id === id);
  if (index !== -1) {
    studentEngagements.splice(index, 1);
  }
  response(204);
});