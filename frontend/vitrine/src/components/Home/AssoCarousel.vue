<script setup lang="ts">
import Carousel from 'primevue/carousel'
import type { AssociationCarousel } from '@/types/associationInterfaces'
import { useFunctionsStore } from '@/stores/functions'

const functionsStore = useFunctionsStore()

const carouselItems: AssociationCarousel[] = [
  {
    name: 'Cristal',
    content:
      'Formée d’étudiants volontaires, Cristal est l’association Entreprise de l’EPITA, une école d’ingénieurs en informatique du pôle technologique IONIS. \n\n' +
      'Notre vocation est de vous fournir des services de qualité, adaptés à vos besoins, et ce dans tous les domaines relatifs à l’informatique allant du conseil jusqu’à la réalisation.',
    tags: ['Travail', 'Junior Entreprise', 'Communication'],
    logo: 'https://www.cristal.je/wp-content/uploads/2021/03/cropped-logo-colored-short-512.png',
    banner:
      'https://www.cristal.je/wp-content/uploads/2021/03/illustration-banner-background-corr.svg',
    socialNetworks: [
      { id: 1, name: 'Website', link: 'https://www.cristal.je/' },
      { id: 2, name: 'Facebook', link: 'https://www.facebook.com/assoCristal/' },
      { id: 3, name: 'X', link: 'https://twitter.com/cristalassocia1' },
      { id: 4, name: 'Discord', link: 'https://discord.gg/25BFr2Kzbu' }
    ]
  },
  {
    name: 'La Paillote',
    content:
      'La Paillote est l’association des amoureux des mélanges de saveurs. Experts en l’art de titiller les papilles, ses membres proposent un large panel de cocktails, du plus classique à l’unique, spécialement inventé pour vous. L’abus d’alcool est dangereux pour la santé, à consommer avec modération.',
    tags: ['Alcool', 'Soirée', 'Afterwork'],
    logo: 'https://www.epita.fr/wp-content/uploads/la-paillote-association-epita.png',
    banner: 'https://www.epita.fr/wp-content/uploads/ephemere-association-epita.jpg',
    socialNetworks: [
      { id: 1, name: 'Mail', link: 'mailto:lapaillote@googlegroups.com' },
      { id: 2, name: 'Facebook', link: 'https://www.facebook.com/lapaillote.apero/' },
      { id: 3, name: 'Instagram', link: 'https://www.instagram.com/asso_paillote/' }
    ]
  },
  {
    name: 'Gotta Go Hack',
    content:
      'Gotta Go Hack est une association qui organise des hackathons et des talks dans le but de faire découvrir l’entreprenariat et l’innovation aux étudiants. Les Hackathons sont des événements dont l’objectif est d’imaginer et de prototyper un projet innovant en groupe le temps d’un week-end. Ces projets sont coaches et juges par des professionnels. Les talks ont pour objectifs d’échanger avec des entrepreneurs sur des sujets varies.',
    tags: ['Hackathon', 'Innovation', 'Entreprenariat'],
    logo: 'https://www.gottagohack.fr/static/media/logo.393432ca58c7fb68941c.png',
    banner: 'https://www.epita.fr/wp-content/uploads/GGH-scaled.jpg',
    socialNetworks: [
      { id: 1, name: 'Website', link: 'https://www.gottagohack.fr/' },
      { id: 2, name: 'Mail', link: 'mailto:info@gottagohack.fr' },
      { id: 3, name: 'Facebook', link: 'https://www.facebook.com/gottagohack' },
      { id: 4, name: 'Discord', link: 'https://discord.com/invite/3b73bBBEW8' }
    ]
  }
]

const getBackgroundImageStyle = (url: string) => {
  return {
    backgroundImage: `url(${url})`
  }
}
</script>

<template>
  <Carousel
    :value="carouselItems"
    :num-visible="1"
    :num-scroll="1"
    circular
    :autoplay-interval="5000"
    class="module-carousel"
  >
    <template #item="slotProps">
      <div class="asso-carousel h-80 w-full relative">
        <div
          class="h-full w-full bg-cover bg-center"
          :style="getBackgroundImageStyle(slotProps.data.banner)"
        >
          <div
            class="absolute inset-0 bg-white bg-opacity-20 backdrop-blur-md flex justify-center items-center text-white"
          >
            <img
              class="asso-logo mr-12"
              :src="slotProps.data.logo"
              :alt="slotProps.data.name + ' logo'"
            />
            <div class="asso-content flex flex-col gap-2 w-4/6">
              <h2 class="asso-name">{{ slotProps.data.name }}</h2>
              <div class="flex gap-2">
                <div v-for="(tag, index) of slotProps.data.tags" :key="index" class="tag">
                  {{ tag }}
                </div>
              </div>
              <span class="asso-desc">{{ slotProps.data.content }}</span>
              <div class="flex gap-4">
                <div v-for="(socialNetwork, index) of slotProps.data.socialNetworks" :key="index">
                  <a :href="socialNetwork.link" target="_blank" rel="noopener noreferrer">
                    <i
                      :class="functionsStore.getSocialNetworkIcon(socialNetwork.name)"
                      class="text-2xl cursor-pointer"
                    />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </Carousel>
</template>

<style>
.asso-carousel .asso-logo {
  height: 12rem;
}

.asso-carousel .asso-content {
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.6);
}

.asso-carousel .asso-content .asso-name {
  font-size: 3rem;
}

.asso-carousel .asso-content .asso-desc {
  font-size: 1.25rem;
}

.asso-carousel .asso-content .tag {
  padding: 2px 4px;
  border: solid 1px white;
  border-radius: 6px;
}

@media (max-width: 1110px) {
  .asso-carousel .asso-content .asso-name {
    font-size: 2.5rem;
  }

  .asso-carousel .asso-content .asso-desc {
    font-size: 1rem;
  }
}

@media (max-width: 894px) {
  .asso-carousel .asso-logo {
    height: 8rem;
  }

  .asso-carousel .asso-content .asso-desc {
    display: -webkit-box;
    overflow: hidden;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 5;
  }
}

@media (max-width: 708px) {
  .module-carousel {
    display: none;
  }
}
</style>
