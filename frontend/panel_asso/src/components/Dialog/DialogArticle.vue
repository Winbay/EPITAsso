<script setup lang="ts">
import InputText from 'primevue/inputtext'
import Editor from 'primevue/editor'
import Button from 'primevue/button'
import MultiSelect from 'primevue/multiselect'
import Dialog from 'primevue/dialog'

import { ref, onMounted, defineProps, type PropType } from 'vue'
import type { ArticleTag } from '@/types/tagInterfaces'
import type { ArticleCreation, ArticleModification } from '@/types/articleInterfaces'
import { useToast } from 'primevue/usetoast'
import PostService from '@/services/post/post'

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
const postService: PostService = new PostService(toast)

const getDefaultArticle = (): ArticleCreation | ArticleModification => ({
  title: '',
  content: '',
  tags: []
});

const currArticleRef = ref<ArticleCreation | ArticleModification>(getDefaultArticle())

const editOrCreate = async (): Promise<void> => {
  if (props.article) {
    await postService.updatePost(currArticleRef.value as ArticleModification)
  } else {
    await postService.createPost(currArticleRef.value)
  }
  await props.reloadArticles();
  props.setHidden();
};


const cancelDialog = () => {
  if (props.article) {
    currArticleRef.value = props.article
  } else {
    currArticleRef.value = getDefaultArticle()
  }
  props.setHidden()
}

onMounted(() => {
  if (props.article) {
    currArticleRef.value = props.article
  }
})
</script>

<template>
  <Dialog 
    class="dialog-event h-full" 
    modal @update:visible="cancelDialog"
    :header="props.article ? 'Modification de l\'article' : 'Création d\'un article'"
  >
    <div class="title mb-6 flex flex-col justify-start">
      <label for="title" class="mb-2 text-2xl font-bold text-wrap">Titre</label>
      <InputText 
        id="title" 
        v-model="currArticleRef.title" 
        aria-describedby="username-help"
        placeholder="Titre de l'article" 
        maxlength="255" 
        class="max-w-3xl" 
      />
    </div>
    <div class="content mb-6 flex flex-col justify-start">
      <label for="content" class="mb-2 text-2xl font-bold text-wrap">Contenu</label>
      <Editor id="content" v-model="currArticleRef.content" editorStyle="height: 320px" />
    </div>
    <div class="mb-6 flex flex-col justify-start w-8/12">
      <label for="tags" class="mb-2 text-xl font-bold text-wrap">Tags</label>
      <MultiSelect 
        v-model="currArticleRef.tags" 
        :options="props.tags" 
        option-label="name" 
        display="chip" 
      />
    </div>
    <div class="mb-6 flex flex-col justify-start">
      <div class="flex justify-start items-center">
        <Button 
          label="Annuler" 
          severity="secondary" 
          class="w-1/4 mr-4" 
          @click="cancelDialog" 
        />
        <Button 
          :label="props.article ? 'Sauvegarder' : 'Créer'" 
          severity="success" 
          class="w-1/4"
          @click="editOrCreate" 
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
