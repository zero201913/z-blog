/**
 * =========================================
 * @file        HomePage.vue
 * @author      hongliang
 * @created     2026-05-29 12:00
 * @version     1.0.0
 * @description 首页：精选区 + 分类过滤 + 文章网格 + 侧边栏
 *
 * -----------------------------------------
 *  File Purpose:
 *      - Hero 精选区展示置顶文章
 *      - 分类标签过滤最新文章
 *      - 文章卡片网格自适应列数
 *      - 侧边栏：一言/标签/位置/天气
 * -----------------------------------------
 * =========================================
 */
<template>
  <div>
    <hero-section :articles="featuredArticles" />

    <div class="container">
      <div class="content-layout">
        <main>
          <div class="home-section">
            <div class="home-section__head">
              <h2 class="section-title">最新文章</h2>
              <router-link to="/all" class="home-section__more">
                查看全部 →</router-link>
            </div>

            <div class="category-tabs">
              <button
                :class="['category-tabs__item', { 'category-tabs__item--active': activeCategory === '' }]"
                @click="activeCategory = ''"
              >
                全部
              </button>
              <button
                v-for="cat in categories"
                :key="cat.id"
                :class="['category-tabs__item', { 'category-tabs__item--active': activeCategory === cat.name }]"
                @click="activeCategory = cat.name"
              >
                {{ cat.name }}
              </button>
            </div>

            <div v-if="filteredArticles.length > 0" class="article-grid">
              <article-card
                v-for="article in filteredArticles"
                :key="article.id"
                :article="article"
              />
            </div>
            <div v-else class="empty-state">
              <p>该分类下暂无文章</p>
            </div>
          </div>
        </main>

        <sidebar />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { mockData } from '../data/index.js'
import HeroSection from '../components/HeroSection.vue'
import ArticleCard from '../components/ArticleCard.vue'
import Sidebar from '../components/Sidebar.vue'

const featuredArticles = mockData.getFeaturedArticles()
const normalArticles = mockData.getNormalArticles()
const categories = mockData.categories

const activeCategory = ref('')

const filteredArticles = computed(() => {
  if (!activeCategory.value) return normalArticles
  return normalArticles.filter(a => a.category === activeCategory.value)
})
</script>

<style scoped>
.section-title {
  font-family: var(--font-serif);
  margin-bottom: 0;
}

.home-section__head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: var(--space-5);
}

.home-section__more {
  font-size: var(--font-size-sm);
  color: var(--color-primary);
  transition: opacity var(--transition-fast);
  white-space: nowrap;
}

.home-section__more:hover {
  opacity: 0.7;
}

.category-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin-bottom: var(--space-6);
  padding-bottom: var(--space-4);
  border-bottom: 1px solid var(--color-border);
}

.category-tabs__item {
  padding: var(--space-1) var(--space-4);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-muted);
  background: var(--color-bg-subtle);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: all var(--transition-fast);
  white-space: nowrap;
}

.category-tabs__item:hover {
  color: var(--color-primary);
  border-color: var(--color-primary);
}

.category-tabs__item--active {
  color: var(--color-text-on-primary);
  background: var(--color-primary);
  border-color: var(--color-primary);
}

.category-tabs__item--active:hover {
  color: var(--color-text-on-primary);
  background: var(--color-primary-hover);
}

.empty-state {
  text-align: center;
  padding: var(--space-12) 0;
  color: var(--color-text-muted);
  font-size: var(--font-size-lg);
}

@media (max-width: 768px) {
  .category-tabs {
    gap: var(--space-1);
    margin-bottom: var(--space-4);
    padding-bottom: var(--space-3);
  }

  .category-tabs__item {
    padding: 4px 12px;
    font-size: var(--font-size-xs);
  }

  .home-section__head {
    margin-bottom: var(--space-4);
  }
}

@media (max-width: 480px) {
  .category-tabs {
    gap: 6px;
  }

  .category-tabs__item {
    padding: 3px 10px;
    font-size: 11px;
  }

  .home-section__more {
    font-size: var(--font-size-xs);
  }
}
</style>
