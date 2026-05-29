<template>
  <section class="hero">
    <div class="container">
      <div class="hero__grid">
        <div class="hero__main">
          <article
            v-if="articles.length > 0"
            class="card card--elevated card--clickable"
            @click="navigateToArticle(articles[0].id)"
            tabindex="0"
            @keydown.enter="navigateToArticle(articles[0].id)"
          >
            <div class="card__emoji-cover card__emoji-cover--large">
              <span class="card__emoji card__emoji--large">{{ articles[0].emoji }}</span>
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
            class="card card--elevated card--clickable"
            @click="navigateToArticle(article.id)"
            tabindex="0"
            @keydown.enter="navigateToArticle(article.id)"
          >
            <div class="card__emoji-cover">
              <span class="card__emoji">{{ article.emoji }}</span>
            </div>
            <div class="card__content">
              <span class="card__category">{{ article.category }}</span>
              <h3 class="card__title">{{ article.title }}</h3>
            </div>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useRouter } from 'vue-router'

defineProps({
  articles: { type: Array, required: true },
})

const router = useRouter()

function navigateToArticle(id) {
  router.push(`/article/${id}`)
}
</script>
