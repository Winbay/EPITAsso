import fixture from 'can-fixture'

let articles = [
  {
    id: 1,
    title: "Titre d'un article",
    content: '<p>Some content...</p>',
    author: 'Célian Cusey',
    tags: [1]
  },
  {
    id: 2,
    title: '[ANNONCE] Vie associative',
    content: 'Some content...',
    author: 'Nathan Lenogue',
    tags: [2, 3, 5]
  }
]

fixture('GET /api/articles/tags', () => {
  return [
    { id: 1, name: 'Présentation' },
    { id: 2, name: 'Annonce' },
    { id: 3, name: 'Campus' },
    { id: 4, name: 'VJ' },
    { id: 5, name: 'Kremlin' }
  ]
})

// TIPS: uncomment this to test the error on events loading
// fixture('GET /api/articles/tags', (request, response) => {
//   response(500, "Erreur au niveau du serveur...");
// });

fixture('GET /api/articles', () => {
  return articles
})

// TIPS: uncomment this to test the error on events loading
// fixture('GET /api/articles', (request, response) => {
//   response(500, "Erreur au niveau du serveur...");
// });

fixture('POST /api/articles', (request, response) => {
  let newArticle = request.data
  newArticle.id = articles[articles.length - 1].id + 1
  articles.push(newArticle)
  response(201)
})

fixture('PUT /api/articles/{id}', (request, response) => {
  const id = parseInt(request.data.id)
  const index = articles.findIndex((item) => item.id === id)
  if (index !== -1) {
    let newArticle = request.data
    newArticle.id = id
    articles.splice(index, 1, newArticle)
  }
  response(201)
})

fixture('DELETE /api/articles/{id}', (request, response) => {
  const id = parseInt(request.data.id)
  articles = articles.filter((event) => event.id !== id)
  response(201)
})

export default fixture
