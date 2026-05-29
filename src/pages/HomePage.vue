<template>
  <div>
    <hero-section :articles="featuredArticles" />

    <div class="container">
      <div class="content-layout">
        <main>
          <h2 class="section-title">最新文章</h2>
          <div class="article-grid">
            <article-card
              v-for="article in normalArticles"
              :key="article.id"
              :article="article"
            />
          </div>
        </main>

        <sidebar />
      </div>
    </div>
  </div>
</template>

<script setup>
import { mockData } from '../data/index.js'
import HeroSection from '../components/HeroSection.vue'
import ArticleCard from '../components/ArticleCard.vue'
import Sidebar from '../components/Sidebar.vue'

const featuredArticles = mockData.getFeaturedArticles()
const normalArticles = mockData.getNormalArticles()
</script>

<style scoped>
.section-title {
  font-family: var(--font-serif);
  margin-bottom: var(--space-6);
}
</style>
