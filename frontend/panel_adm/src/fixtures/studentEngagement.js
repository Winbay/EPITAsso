import fixture from 'can-fixture';

let studentEngagements = [
  {
    login: 'prenom.nom@epita.fr',
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
    totalDays: 1
  },
  {
    login: 'prenom.nom@epita.fr',
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
    totalDays: 1
  }];


fixture('GET /api/studentEngagements/positions', () => {
  return [
    { id: 1, name: "Membre" },
    { id: 2, name: "Président" },
    { id: 3, name: "Vice-Président" },
    { id: 4, name: "Secrétaire" },
    { id: 5, name: "Trésorier" },
  ];
});

fixture('GET /api/studentEngagements', () => {
  return studentEngagements;
});