/**
 * =========================================
 * @file        AllArticlesPage.vue
 * @author      hongliang
 * @created     2026-05-29 12:00
 * @version     1.0.0
 * @description 全部文章展示页面，3列5行网格布局+分页
 *
 * -----------------------------------------
 *  File Purpose:
 *      - 展示所有文章的网格布局页面
 *      - 支持3×5=15条/页的分页功能
 * -----------------------------------------
 * =========================================
 */
<template>
  <div class="all-articles-page">
    <div class="container">
      <div class="all-articles-page__header">
        <h1 class="all-articles-page__title">全部文章</h1>
        <span class="all-articles-page__count">共 {{ totalArticles }} 篇</span>
      </div>

      <div class="all-articles-grid">
        <article-card
          v-for="article in paginatedArticles"
          :key="article.id"
          :article="article"
        />
      </div>

      <div v-if="totalPages > 1" class="pagination">
        <button
          class="pagination__btn"
          :disabled="currentPage === 1"
          @click="goToPage(1)"
        >
          首页
        </button>
        <button
          class="pagination__btn"
          :disabled="currentPage === 1"
          @click="goToPage(currentPage - 1)"
        >
          上一页
        </button>

        <div class="pagination__pages">
          <button
            v-for="page in visiblePages"
            :key="page"
            :class="['pagination__page', { 'pagination__page--active': page === currentPage }]"
            @click="goToPage(page)"
          >
            {{ page }}
          </button>
        </div>

        <button
          class="pagination__btn"
          :disabled="currentPage === totalPages"
          @click="goToPage(currentPage + 1)"
        >
          下一页
        </button>
        <button
          class="pagination__btn"
          :disabled="currentPage === totalPages"
          @click="goToPage(totalPages)"
        >
          末页
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { mockData } from '../data/index.js'
import ArticleCard from '../components/ArticleCard.vue'

const PAGE_SIZE = 15

const allArticles = mockData.articles
const totalArticles = allArticles.length

const currentPage = ref(1)

const totalPages = computed(() => Math.ceil(totalArticles / PAGE_SIZE))

const paginatedArticles = computed(() => {
  const start = (currentPage.value - 1) * PAGE_SIZE
  return allArticles.slice(start, start + PAGE_SIZE)
})

const visiblePages = computed(() => {
  const pages = []
  const total = totalPages.value
  const current = currentPage.value

  let start = Math.max(1, current - 2)
  let end = Math.min(total, current + 2)

  if (end - start < 4) {
    if (start === 1) {
      end = Math.min(total, start + 4)
    } else {
      start = Math.max(1, end - 4)
    }
  }

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

function goToPage(page) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}
</script>

<style scoped>
.all-articles-page {
  padding: var(--space-8) 0 var(--space-16);
}

.all-articles-page__header {
  display: flex;
  align-items: baseline;
  gap: var(--space-4);
  margin-bottom: var(--space-8);
}

.all-articles-page__title {
  font-family: var(--font-serif);
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
}

.all-articles-page__count {
  font-size: var(--font-size-lg);
  color: var(--color-text-muted);
}

.all-articles-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-6);
  margin-bottom: var(--space-10);
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  flex-wrap: wrap;
}

.pagination__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 44px;
  min-height: 44px;
  padding: var(--space-2) var(--space-4);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-secondary);
  background: var(--color-bg-base);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.pagination__btn:hover:not(:disabled) {
  border-color: var(--color-primary);
  color: var(--color-primary);
  background: var(--color-primary-light);
}

.pagination__btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.pagination__pages {
  display: flex;
  align-items: center;
  gap: var(--space-1);
}

.pagination__page {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-secondary);
  background: transparent;
  border: 1px solid transparent;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.pagination__page:hover {
  color: var(--color-primary);
  background: var(--color-primary-light);
}

.pagination__page--active {
  color: var(--color-text-on-primary);
  background: var(--color-primary);
  border-color: var(--color-primary);
}

.pagination__page--active:hover {
  color: var(--color-text-on-primary);
  background: var(--color-primary-hover);
}

@media (max-width: 1024px) {
  .all-articles-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .all-articles-grid {
    grid-template-columns: 1fr;
  }

  .all-articles-page__title {
    font-size: var(--font-size-2xl);
  }
}
</style>
