<script setup lang="ts"></script>

<template>
  <footer class="w-full h-52 gap-6 flex flex-col py-6 items-center bg-cover bg-center text-white">
    <div class="flex gap-10">
      <div class="websites flex flex-col">
        <span class="text-xl font-bold">Sites Officiels</span>
        <a href="https://www.epita.fr/" target="”_blank”">> Epita - Site principal</a>
        <a href="https://www.epita.net/" target="”_blank”">> Epita - Relations entreprises</a>
        <a href="https://cri.epita.fr/" target="”_blank”">> Epita - CRI</a>
        <a href="https://www.epitech.eu/" target="”_blank”">> Epitech - Site principal</a>
      </div>
      <div class="websites flex flex-col">
        <span class="text-xl font-bold">Sites pratiques</span>
        <a href="https://epimap.fr/kb" target="”_blank”">> Plan des campus</a>
        <a href="https://epita.it/" target="”_blank”">> Epita.it</a>
      </div>
    </div>
    <span class="info text-sm">Ce site n'est pas directement affilié à Epita ou Epitech.</span>
  </footer>
</template>

<style>
footer {
  background-image: url('/images/footer-background.jpg');
}

footer .websites > a:hover {
  text-decoration: underline;
}

@media (max-width: 708px) {
  footer .websites > span {
    font-size: 1rem;
  }

  footer .websites > a {
    font-size: 0.75rem;
  }

  footer .info {
    font-size: 0.75rem;
  }
}
</style>
