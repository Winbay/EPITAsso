<script setup lang="ts">
import { ref, onMounted } from 'vue'

const videoId = 'dTTm-LRku-c'
const videoUrl = ref(
  `https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1&playlist=${videoId}&mute=1&controls=0&modestbranding=1&disablekb=1&showinfo=0&rel=0`
)

const text = "Vie associative de l'EPITA et l'EPITECH"
const typedText = ref<HTMLElement>()
const cursor = ref<HTMLElement>()

onMounted(() => {
  let index = 0

  const type = () => {
    if (!typedText.value) return
    if (index < text.length) {
      typedText.value.innerHTML += text.charAt(index)
      index++
      setTimeout(type, 40)
    } else {
      if (cursor.value) {
        cursor.value.style.display = 'none'
      }
    }
  }

  setTimeout(type, 500)
})
</script>

<template>
  <div class="video-container mb-6">
    <iframe
      width="100%"
      :src="videoUrl"
      frameborder="0"
      tabindex="-1"
      allow="autoplay; loop; muted"
      allowfullscreen
    ></iframe>
    <div class="frost-overlay">
      <div class="flex flex-col gap-4 overlay-text px-12">
        <h1 class="title text-7xl">Associations</h1>
        <div class="flex">
          <span ref="typedText" class="typed-text text-2xl"></span>
          <span class="cursor" ref="cursor">_</span>
        </div>
      </div>
    </div>
    <div class="wei-overlay">
      <span>Revivez l'expérience des Week-end d'intégration via la chaine Youtube d'EPTV !</span>
      <a href="https://www.youtube.com/@EPTV_asso" target="_blank"></a>
    </div>
  </div>
</template>

<style>
main .video-container {
  position: relative;
  width: 100%;
  padding-bottom: 56.25%;
  height: 0;
  overflow: hidden;
}

main .video-container iframe {
  position: absolute;
  top: -10%;
  left: -10%;
  width: 120%;
  height: 120%;
  pointer-events: none;
}

main .frost-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 60%;
  height: 100%;
  backdrop-filter: blur(10px);
  background: rgba(0, 0, 0, 0.2);
  clip-path: polygon(0 0, 100% 0, 70% 100%, 0 100%);
  display: flex;
  align-items: center;
}

main .overlay-text {
  color: white;
  font-weight: bold;
  z-index: 2;
}

main .cursor {
  font-size: 1.5rem;
  color: white;
  animation: blink 0.7s steps(1) infinite;
  display: inline-block;
}

@keyframes blink {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

main .wei-overlay {
  position: absolute;
  width: 30%;
  height: 300px;
  top: 50%;
  right: 5%;
  padding: 10px 20px;
  border-radius: 12px;
  transform: translateY(-50%);
  backdrop-filter: blur(10px);
  background: rgba(0, 0, 0, 0.2);
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
}

main .wei-overlay span {
  color: white;
  font-size: 1.75rem;
}

main .wei-overlay a {
  display: inline-block;
  background-image: url('/images/YouTube.jpg');
  width: 160px;
  height: 60px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border-radius: 12px;
}

@media (max-width: 708px) {
  main .frost-overlay {
    width: 100%;
    clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
    justify-content: center;
  }

  main .frost-overlay .title {
    font-size: 2.5rem;
  }

  main .frost-overlay .typed-text {
    display: none;
  }

  main .frost-overlay .cursor {
    display: none;
  }

  main .wei-overlay {
    display: none;
  }
}
</style>