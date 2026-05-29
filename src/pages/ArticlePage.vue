<template>
  <div>
    <div class="progress-bar" :style="{ width: scrollProgress + '%' }" />

    <article v-if="article" class="article-page">
      <nav class="article-page__breadcrumb">
        <a href="#" @click.prevent="goBack">首页</a>
        <span> &gt; </span>
        <span>{{ article.category }}</span>
      </nav>

      <header class="article-page__header">
        <h1 class="article-page__title">{{ article.title }}</h1>
        <div class="article-page__meta">
          <div class="article-page__author">
            <span class="article-page__author-emoji">{{ article.emoji }}</span>
            <span>{{ article.author.name }}</span>
          </div>
          <span>{{ formatDate(article.date) }}</span>
          <span>阅读时间 {{ article.readTime }}</span>
          <span>浏览量 {{ article.views.toLocaleString() }}</span>
        </div>
      </header>

      <div class="article-page__content" v-html="article.content" />

      <footer class="article-page__footer">
        <div class="article-page__tags">
          <span v-for="tag in article.tags" :key="tag" class="tag">{{ tag }}</span>
        </div>

        <div class="article-page__author-card">
          <span class="article-page__author-card-emoji">{{ article.emoji }}</span>
          <div class="article-page__author-card-info">
            <h4>{{ article.author.name }}</h4>
            <p>{{ article.author.bio }}</p>
            <base-button variant="outline" size="sm">关注</base-button>
          </div>
        </div>

        <nav class="article-page__nav">
          <div class="article-page__nav-item" @click="goBack">
            <div class="article-page__nav-label">上一篇</div>
            <div class="article-page__nav-title">返回首页</div>
          </div>
          <div class="article-page__nav-item" @click="goBack">
            <div class="article-page__nav-label">下一篇</div>
            <div class="article-page__nav-title">浏览更多文章</div>
          </div>
        </nav>

        <div class="article-page__related">
          <h3>相关推荐</h3>
          <div class="article-grid" style="margin-top: var(--space-4);">
            <article-card
              v-for="related in relatedArticles"
              :key="related.id"
              :article="related"
              variant="compact"
            />
          </div>
        </div>
      </footer>
    </article>

    <div class="floating-toolbar" v-if="article">
      <button class="floating-toolbar__btn" title="分享">📤</button>
      <button class="floating-toolbar__btn" title="收藏">⭐</button>
      <button class="floating-toolbar__btn" title="评论">💬</button>
    </div>

    <div v-if="!article" style="text-align: center; padding: var(--space-16);">
      <h3>文章不存在</h3>
      <base-button variant="solid" style="margin-top: var(--space-4);" @click="goBack">返回首页</base-button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { mockData } from '../data/index.js'
import ArticleCard from '../components/ArticleCard.vue'

const route = useRoute()
const router = useRouter()
const article = ref(null)
const relatedArticles = ref([])
const scrollProgress = ref(0)

function loadArticle() {
  article.value = mockData.getArticleById(route.params.id)
  if (article.value) {
    relatedArticles.value = mockData.getRelatedArticles(article.value.id)
    window.scrollTo(0, 0)
  }
}

watch(
  () => route.params.id,
  () => {
    loadArticle()
  },
  { immediate: true }
)

function handleScroll() {
  const winScroll = document.documentElement.scrollTop
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight
  scrollProgress.value = height > 0 ? (winScroll / height) * 100 : 0
}

function goBack() {
  router.push('/')
}

function formatDate(dateStr) {
  const date = new Date(dateStr)
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>
