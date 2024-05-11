<script setup lang="ts">
import Button from 'primevue/button'
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Tag from 'primevue/tag';
import ConfirmPopup from 'primevue/confirmpopup';
import axios from 'axios';

import { ref, onMounted  } from 'vue'
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import DialogArticle from '@/components/Dialog/DialogArticle.vue'
import { type ArticleModification } from '@/types/articleInterfaces'
import '@/fixtures/articles';
import type { ArticleTag } from '@/types/tagInterfaces'

const tagsRef = ref<ArticleTag[]>([]);
const articles = ref<ArticleModification[]>([])

const visibleCreation = ref(false);
const visibleModification = ref<number>(0);
const confirm = useConfirm();
const toast = useToast();

const confirm1 = (event: Event, articleId: number) => {
  confirm.require({
    target: event.currentTarget as HTMLElement,
    message: 'Êtes-vous sûr de vouloir supprimer cet article ?',
    icon: 'pi pi-exclamation-triangle',
    rejectClass: 'p-button-secondary p-button-outlined p-button-sm',
    acceptClass: 'p-button-danger p-button-sm',
    rejectLabel: 'Annuler',
    acceptLabel: 'Supprimer',
    accept: async () => {
      await deleteArticle(articleId);
    },
    reject: () => {}
  });
};

const closeDialog = () => {
  visibleCreation.value = false;
  visibleModification.value = 0;
}

const getTagName = (tagId: number): string => {
  return tagsRef.value.find(item => item.id === tagId)?.name ?? "";
}

const loadTags = async () => {
  try {
    const rep1 = await axios.get<ArticleTag[]>('/api/articles/tags');
    tagsRef.value = rep1.data;
    return true;
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Articles',
      detail: 'La liste des tags des articles n\'a pas pu être chargée.', life: 3000 });
    console.log(error);
    return false;
  }
}

async function reloadArticles() {
  try {
    const rep2 = await axios.get<ArticleModification[]>('/api/articles');
    articles.value = rep2.data;
    return true;
  }
  catch (error) {
    toast.add({ severity: 'error', summary: 'Articles',
      detail: 'La liste des articles n\'a pas pu être chargée.', life: 3000 });
    console.log(error);
    return false;
  }
}

async function deleteArticle(articleId: number) {
  try {
    await axios.delete(`/api/articles/${articleId}`);
    toast.add({ severity: 'info', summary: 'Suppression', detail: 'L\'article a été supprimé.', life: 3000 });
    await reloadArticles();
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Articles',
      detail: "L'article n'a pas pu être supprimé.", life: 3000 });
    console.log(error);
  }
}

onMounted(async () => {
  if (await loadTags()) {
    await reloadArticles();
  }
});
</script>

<template>
  <div class="events-list w-full h-full px-10 py-8">
    <div class="events-list-header h-10 mb-6 flex justify-start items-center">
      <span class="mr-4 text-2xl font-bold text-wrap">Articles</span>
      <Button label="Ajouter" class="add-btn py-0 px-4 h-full" @click="visibleCreation = true"/>
      <DialogArticle v-model:visible="visibleCreation" :set-hidden="closeDialog"
                   :reload-articles="reloadArticles" :tags="tagsRef"/>
    </div>
    <DataTable :value="articles" show-gridlines striped-rows tableStyle="min-width: 50rem"
               size="small" paginator :rows="5" :rowsPerPageOptions="[5, 10, 20, 50]" removableSort>
      <Column field="title" header="Titre" sortable></Column>
      <Column field="author" header="Auteur" sortable></Column>
      <Column header="Tags" class="max-w-60">
        <template #body="slotProps">
          <Tag v-for="(tag, index) in slotProps.data.tags" :key="index" :value="getTagName(tag)" severity="primary" class="mx-1 my-0.5"/>
        </template>
      </Column>
      <Column header="Actions">
        <template #body="slotProps">
          <div class="flex flex-col">
            <a href="javascript:void(0)" class="hover:underline" @click="visibleModification = slotProps.data.id">Editer</a>
            <DialogArticle :visible="visibleModification === slotProps.data.id" :set-hidden="closeDialog"
                         :reload-articles="reloadArticles" :tags="tagsRef" :article="JSON.parse(JSON.stringify(slotProps.data))"/>
            <ConfirmPopup></ConfirmPopup>
            <a href="javascript:void(0)" @click="confirm1($event, slotProps.data.id)" class="hover:underline">Supprimer</a>
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<style>
.events-list .add-btn {
  color: var(--text-color);
}

.events-list a {
  color: var(--primary-color);
}

.events-list .p-paginator-bottom {
  border: none;
}

.events-list .p-paginator-rpp-options span.p-dropdown-label {
  align-content: center;
}
</style>