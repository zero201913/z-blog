<template>
  <section class="hero">
    <div class="container">
      <div class="hero__grid">
        <div class="hero__main">
          <article
            v-if="articles.length > 0"
            :class="['card', 'card--elevated', 'card--clickable', { 'card--locked': articles[0].locked }]"
            @click="handleClick(articles[0])"
            tabindex="0"
            @keydown.enter="handleClick(articles[0])"
          >
            <div class="card__emoji-cover card__emoji-cover--large">
              <span class="card__emoji card__emoji--large">{{ articles[0].emoji }}</span>
              <span v-if="articles[0].locked" class="card__lock-badge card__lock-badge--large" title="需要密码查看">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0110 0v4"/>
                </svg>
              </span>
            </div>
            <div class="card__content">
              <span class="card__category">{{ articles[0].category }}</span>
              <h2 class="card__title">{{ articles[0].title }}</h2>
              <p class="card__excerpt">{{ articles[0].excerpt }}</p>
              <div class="card__meta">
                <div class="card__author">
                  <span>{{ articles[0].author.name }}</span>
                </div>
                <span>{{ articles[0].date }}</span>
                <span>{{ articles[0].readTime }}</span>
              </div>
            </div>
          </article>
        </div>
        <div class="hero__side">
          <article
            v-for="article in articles.slice(1, 3)"
            :key="article.id"
            :class="['card', 'card--elevated', 'card--clickable', { 'card--locked': article.locked }]"
            @click="handleClick(article)"
            tabindex="0"
            @keydown.enter="handleClick(article)"
          >
            <div class="card__emoji-cover">
              <span class="card__emoji">{{ article.emoji }}</span>
              <span v-if="article.locked" class="card__lock-badge" title="需要密码查看">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0110 0v4"/>
                </svg>
              </span>
            </div>
            <div class="card__content">
              <span class="card__category">{{ article.category }}</span>
              <h3 class="card__title">{{ article.title }}</h3>
            </div>
          </article>
        </div>
      </div>
    </div>

    <lock-modal
      :visible="showLockModal"
      :article="targetArticle"
      @close="showLockModal = false"
      @unlock="handleUnlock"
    />
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { store } from '../store/index.js'
import LockModal from './LockModal.vue'

defineProps({
  articles: { type: Array, required: true },
})

const router = useRouter()
const showLockModal = ref(false)
const targetArticle = ref({})

function handleClick(article) {
  if (article.locked && !store.isArticleUnlocked(article.id)) {
    targetArticle.value = article
    showLockModal.value = true
  } else {
    navigateToArticle(article.id)
  }
}

function handleUnlock(id) {
  store.unlockArticle(id)
  showLockModal.value = false
  navigateToArticle(id)
}

function navigateToArticle(id) {
  router.push(`/article/${id}`)
}
</script>

<style scoped>
.card__emoji-cover {
  position: relative;
}

.card__lock-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.55);
  border-radius: 50%;
  color: #ffffff;
  backdrop-filter: blur(4px);
  z-index: 2;
}

.card__lock-badge--large {
  width: 36px;
  height: 36px;
  top: 14px;
  right: 14px;
}

body.dark-mode .card__lock-badge {
  background: rgba(255, 255, 255, 0.2);
}

.card--locked:hover .card__lock-badge {
  background: var(--color-primary);
  transform: scale(1.1);
  transition: all var(--transition-fast);
}
</style>
