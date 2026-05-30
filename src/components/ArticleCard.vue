<template>
  <article
    :class="['card', 'card--elevated', 'card--clickable', { 'card--locked': article.locked }]"
    @click="handleClick"
    tabindex="0"
    @keydown.enter="handleClick"
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
      <p v-if="variant !== 'compact'" class="card__excerpt">{{ article.excerpt }}</p>
      <div class="card__meta">
        <div class="card__author">
          <span>{{ article.author.name }}</span>
        </div>
        <span>{{ formatDate(article.date) }}</span>
        <span>{{ article.readTime }}</span>
      </div>
    </div>
  </article>

  <lock-modal
    :visible="showLockModal"
    :article="article"
    @close="showLockModal = false"
    @unlock="handleUnlock"
  />
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { store } from '../store/index.js'
import LockModal from './LockModal.vue'

const props = defineProps({
  article: { type: Object, required: true },
  variant: {
    type: String,
    default: 'default',
    validator: (v) => ['default', 'featured', 'compact'].includes(v),
  },
})

const router = useRouter()
const showLockModal = ref(false)

function handleClick() {
  if (props.article.locked && !store.isArticleUnlocked(props.article.id)) {
    showLockModal.value = true
  } else {
    navigateToArticle()
  }
}

function handleUnlock(id) {
  store.unlockArticle(id)
  showLockModal.value = false
  navigateToArticle()
}

function navigateToArticle() {
  router.push(`/article/${props.article.id}`)
}

function formatDate(dateStr) {
  const date = new Date(dateStr)
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
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

body.dark-mode .card__lock-badge {
  background: rgba(255, 255, 255, 0.2);
}

.card--locked:hover .card__lock-badge {
  background: var(--color-primary);
  transform: scale(1.1);
  transition: all var(--transition-fast);
}
</style>
