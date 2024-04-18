<script setup lang="ts">
import InputText from 'primevue/inputtext'
import Editor from 'primevue/editor'
import Button from 'primevue/button'
import MultiSelect from 'primevue/multiselect'
import Dialog from 'primevue/dialog'
import axios from 'axios'

import { ref, onMounted, defineProps, type PropType } from 'vue'
import type { ArticleTag } from '@/types/tagInterfaces'
import type { ArticleCreation, ArticleModification } from '@/types/articleInterfaces'
import { useToast } from 'primevue/usetoast'

const props = defineProps({
  setHidden: {
    type: Function,
    required: true
  },
  reloadArticles: {
    type: Function,
    required: true
  },
  tags: {
    type: Object as PropType<ArticleTag[]>,
    required: true
  },
  article: {
    type: Object as PropType<ArticleModification | null>,
    default: null
  }
})

const toast = useToast()

const currArticle = ref<ArticleCreation | ArticleModification>({title: "", content: "", tagIds: []});

const createOrSave = async () => {
  if (props.article) {
    // Modification
    try {
      await axios.put(`/api/posts/${props.article.id}/`, currArticle.value);
    } catch (error) {
      toast.add({
        severity: 'error',
        summary: 'Articles',
        detail: "L'article n'a pas pu être modifié.",
        life: 3000
      })
      console.log(error)
      return false
    }
  } else {
    // Creation
    try {
      console.log(currArticle.value);
      await axios.post(`/api/posts/`, currArticle.value, );
    } catch (error) {
      toast.add({
        severity: 'error',
        summary: 'Articles',
        detail: "L'article n'a pas pu être créé.",
        life: 3000
      })
      console.log(error)
      return false
    }
  }
  await props.reloadArticles()
  props.setHidden()
  return true
}

const cancelDialog = () => {
  // Reset all local values
  if (props.article) {
    currArticle.value = props.article
  } else {
    currArticle.value = {title: "", content: "", tagIds: []};
  }
  props.setHidden()
}

onMounted(() => {
  if (props.article) {
    currArticle.value = props.article
  }
})
</script>

<template>
  <Dialog
    class="dialog-event h-full"
    modal
    @update:visible="cancelDialog"
    :header="props.article ? 'Modification de l\'article' : 'Création d\'un article'"
  >
    <div class="title mb-6 flex flex-col justify-start">
      <label for="title" class="mb-2 text-2xl font-bold text-wrap">Titre</label>
      <InputText
        id="title"
        v-model="currArticle.title"
        aria-describedby="username-help"
        placeholder="Titre de l'article"
        maxlength="255"
        class="max-w-3xl"
      />
    </div>
    <div class="content mb-6 flex flex-col justify-start">
      <label for="content" class="mb-2 text-2xl font-bold text-wrap">Contenu</label>
      <Editor id="content" v-model="currArticle.content" editorStyle="height: 320px" />
      <!--      <Button label="Display" @click="console.log(currArticle)"></Button>-->
    </div>
    <div class="mb-6 flex flex-col justify-start w-8/12">
      <label for="tags" class="mb-2 text-xl font-bold text-wrap">Tags</label>
      <MultiSelect
        v-model="currArticle.tagIds"
        :options="props.tags"
        option-label="name"
        option-value="id"
        display="chip"
      />
    </div>
    <div class="mb-6 flex flex-col justify-start">
      <div class="flex justify-start items-center">
        <Button label="Annuler" severity="secondary" class="w-1/4 mr-4" @click="cancelDialog" />
        <Button
          :label="props.article ? 'Sauvegarder' : 'Créer'"
          severity="success"
          class="w-1/4"
          @click="createOrSave"
        />
      </div>
    </div>
  </Dialog>
</template>

<style>
.dialog-event {
  width: 764px;
}
</style>
