<template>
  <article
    :class="['card', 'card--elevated', 'card--clickable']"
    @click="navigateToArticle"
    tabindex="0"
    @keydown.enter="navigateToArticle"
  >
    <div class="card__emoji-cover">
      <span class="card__emoji">{{ article.emoji }}</span>
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
</template>

<script setup>
import { useRouter } from 'vue-router'

const props = defineProps({
  article: { type: Object, required: true },
  variant: {
    type: String,
    default: 'default',
    validator: (v) => ['default', 'featured', 'compact'].includes(v),
  },
})

const router = useRouter()

function navigateToArticle() {
  router.push(`/article/${props.article.id}`)
}

function formatDate(dateStr) {
  const date = new Date(dateStr)
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
}
</script>
