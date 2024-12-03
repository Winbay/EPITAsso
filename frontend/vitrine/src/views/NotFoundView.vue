<template>
  <div class="not-found-page">
    <img src="@/assets/not-found.svg" alt="Page introuvable" class="not-found-image" />
    <h1>Page introuvable</h1>
    <p>Oups ! La page que vous recherchez semble introuvable.</p>
    <router-link to="/" class="btn-go-home">Retour à l'accueil</router-link>
  </div>
</template>

<style scoped>
.not-found-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  min-height: 100vh;
  padding: 20px;
}

.not-found-image {
  max-width: 100%;
  width: 400px;
  height: auto;
  margin-bottom: 20px;
}

h1 {
  font-size: 2.5rem;
}

p {
  font-size: 1.2rem;
  margin-bottom: 20px;
}

.btn-go-home {
  padding: 10px 20px;
  background-color: #4482a1;
  color: white;
  border-radius: 6px;
}
</style>
