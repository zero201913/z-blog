<template>
  <header class="header">
    <div class="header__inner">
      <a href="#" class="header__logo" @click.prevent="$router.push('/')">MyBlog</a>

      <div class="header__search">
        <div class="header__search-box">
          <input
            ref="searchInput"
            v-model="query"
            type="text"
            class="header__search-input"
            placeholder="搜索文章标题..."
            @input="onInput"
            @keydown.enter="onEnter"
            @focus="onFocus"
            @blur="onBlur"
          >
          <button class="header__search-btn" title="搜索" @click="onSearch">
            🔍
          </button>
        </div>
        <div
          v-show="showDropdown && suggestions.length > 0"
          class="header__search-dropdown"
        >
          <div
            v-for="(item, index) in suggestions"
            :key="item.id"
            :class="['header__search-item', { 'header__search-item--active': index === activeIndex }]"
            @mousedown.prevent="goToArticle(item.id)"
            @mouseenter="activeIndex = index"
          >
            <span class="header__search-item-emoji">{{ item.emoji }}</span>
            <div class="header__search-item-info">
              <span class="header__search-item-title">{{ item.title }}</span>
              <span class="header__search-item-category">{{ item.category }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="header__actions">
        <div class="header__hue-picker" title="调整主题色">
          <input
            type="range"
            min="0"
            max="360"
            :value="store.hue"
            class="header__hue-slider"
            @input="onHueChange"
          >
        </div>
        <button class="header__icon-btn" title="夜间模式" @click="toggleDarkMode">
          {{ store.darkMode ? '☀️' : '🌙' }}
        </button>
        <base-button variant="solid" size="sm">订阅</base-button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { mockData } from '../data/index.js'
import { store } from '../store/index.js'

const router = useRouter()
const searchInput = ref(null)
const query = ref('')
const showDropdown = ref(false)
const activeIndex = ref(-1)

const articles = mockData.articles

const suggestions = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return []
  return articles
    .filter(a => a.title.toLowerCase().includes(q))
    .slice(0, 6)
})

function onInput() {
  showDropdown.value = true
  activeIndex.value = -1
}

function onFocus() {
  if (suggestions.value.length > 0) {
    showDropdown.value = true
  }
}

function onBlur() {
  setTimeout(() => {
    showDropdown.value = false
    activeIndex.value = -1
  }, 200)
}

function onEnter() {
  if (activeIndex.value >= 0 && suggestions.value[activeIndex.value]) {
    goToArticle(suggestions.value[activeIndex.value].id)
  } else if (suggestions.value.length > 0) {
    goToArticle(suggestions.value[0].id)
  }
}

function onSearch() {
  if (suggestions.value.length > 0) {
    goToArticle(suggestions.value[0].id)
  }
}

function goToArticle(id) {
  query.value = ''
  showDropdown.value = false
  activeIndex.value = -1
  router.push(`/article/${id}`)
}

function toggleDarkMode() {
  store.toggleDarkMode()
}

function onHueChange(e) {
  store.setHue(parseInt(e.target.value, 10))
}
</script>
