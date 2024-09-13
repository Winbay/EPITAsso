<script setup lang="ts">
import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Tag from 'primevue/tag'
import ConfirmPopup from 'primevue/confirmpopup'
import Paginator from 'primevue/paginator'

import { ref, onMounted } from 'vue'
import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'
import DialogArticle from '@/components/Dialog/DialogArticle.vue'
import { type ArticleModification } from '@/types/articleInterfaces'
import type { ArticleTag } from '@/types/tagInterfaces'
import TagService from '@/services/tag'
import PostService from '@/services/post/post'

const tagsRef = ref<ArticleTag[]>([])
const articlesRef = ref<ArticleModification[]>([])

const visibleDialogRef = ref(false)
const selectedArticleRef = ref<ArticleModification | null>(null)
const confirm = useConfirm()
const toast = useToast()
const tagService: TagService = new TagService(toast, 'posts')
const postService: PostService = new PostService(toast)

const rowsPerPage = ref(5)
const articlesCount = ref(0)
const currentPage = ref(0)

const confirmDelete = (event: Event, articleId: number) => {
  confirm.require({
    target: event.currentTarget as HTMLElement,
    message: 'Êtes-vous sûr de vouloir supprimer cet article ?',
    icon: 'pi pi-exclamation-triangle',
    rejectClass: 'p-button-secondary p-button-outlined p-button-sm',
    acceptClass: 'p-button-danger p-button-sm',
    rejectLabel: 'Annuler',
    acceptLabel: 'Supprimer',
    accept: async () => {
      await deleteArticle(articleId)
    }
  })
}

const closeDialog = () => {
  visibleDialogRef.value = false
  selectedArticleRef.value = null
}

const loadTags = async () => {
  tagsRef.value = await tagService.getTags()
}

const reloadArticles = async () => {
  const offset = currentPage.value * rowsPerPage.value
  const articles = await postService.getPosts(rowsPerPage.value, offset)
  articlesCount.value = articles.count
  articlesRef.value = articles.results
}

const deleteArticle = async (articleId: number) => {
  await postService.deletePost(articleId)
  await reloadArticles()
}

onMounted(async () => {
  await loadTags()
  await reloadArticles()
})
</script>

<template>
  <div class="articles-list w-full h-full px-10 py-8">
    <div class="articles-list-header h-10 mb-6 flex justify-start items-center">
      <span class="mr-4 text-2xl font-bold text-wrap">Articles</span>
      <Button label="Ajouter" class="add-btn py-0 px-4 h-full" @click="visibleDialogRef = true" />
      <DialogArticle
        v-model:visible="visibleDialogRef"
        :set-hidden="closeDialog"
        :reload-articles="reloadArticles"
        :tags="tagsRef"
      />
    </div>
    <DataTable
      :value="articlesRef"
      show-gridlines
      striped-rows
      tableStyle="min-width: 50rem"
      size="small"
      removableSort
    >
      <Column field="title" header="Titre" sortable></Column>
      <Column field="author" header="Auteur" sortable></Column>
      <Column header="Tags" class="max-w-60">
        <template #body="slotProps">
          <Tag
            v-for="(tag, index) in slotProps.data.tags"
            :key="index"
            :value="tag.name"
            :style="{
              backgroundColor: tag.backgroundColor ?? 'var(--primary-color)',
              color: tag.textColor ?? ''
            }"
            severity="primary"
            class="mx-1 my-0.5"
          />
        </template>
      </Column>
      <Column header="Actions">
        <template #body="slotProps">
          <div class="flex flex-col">
            <a
              href="javascript:void(0)"
              class="hover:underline"
              @click="selectedArticleRef = slotProps.data"
              >Editer</a
            >
            <DialogArticle
              :visible="selectedArticleRef === slotProps.data"
              :set-hidden="closeDialog"
              :reload-articles="reloadArticles"
              :tags="tagsRef"
              :article="slotProps.data"
            />
            <ConfirmPopup></ConfirmPopup>
            <a
              href="javascript:void(0)"
              @click="confirmDelete($event, slotProps.data.id)"
              class="hover:underline"
              >Supprimer</a
            >
          </div>
        </template>
      </Column>
    </DataTable>
    <Paginator
      class="p-paginator-bottom"
      :rows="rowsPerPage"
      :totalRecords="articlesCount"
      :rowsPerPageOptions="[5, 10, 20, 50]"
      @page="currentPage = $event.page; rowsPerPage = $event.rows; reloadArticles()"
    />
  </div>
</template>

<style>
.articles-list .add-btn {
  color: var(--text-color);
}

.articles-list a {
  color: var(--primary-color);
}

.articles-list .p-paginator-bottom {
  border: none;
}

.articles-list .p-paginator-rpp-options span.p-dropdown-label {
  align-content: center;
}
</style>
