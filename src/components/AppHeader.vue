/**
 * =========================================
 * @file        AppHeader.vue
 * @author      hongliang
 * @created     2026-05-29 12:00
 * @version     1.0.0
 * @description 顶部导航栏，支持搜索、移动端汉堡菜单
 *
 * -----------------------------------------
 *  File Purpose:
 *      - 全局导航：首页 / 全部文章
 *      - 搜索文章标题并跳转
 *      - 主题色调节 + 暗黑模式切换
 *      - 移动端自适应汉堡菜单
 * -----------------------------------------
 * =========================================
 */
<template>
  <header class="header">
    <div class="header__inner">
      <div class="header__left">
        <button
          class="header__hamburger"
          :class="{ 'header__hamburger--open': menuOpen }"
          @click="menuOpen = !menuOpen"
          aria-label="菜单"
        >
          <span class="header__hamburger-line" />
          <span class="header__hamburger-line" />
          <span class="header__hamburger-line" />
        </button>

        <a href="#" class="header__logo" @click.prevent="goHome">MyBlog</a>

        <nav class="header__nav" :class="{ 'header__nav--open': menuOpen }">
          <router-link to="/" class="header__nav-link" exact-active-class="header__nav-link--active">
            首页
          </router-link>
          <router-link to="/all" class="header__nav-link" active-class="header__nav-link--active">
            全部文章
          </router-link>
        </nav>
      </div>

      <div class="header__center">
        <div class="header__search" :class="{ 'header__search--expanded': searchExpanded }">
          <div class="header__search-box">
            <button
              v-if="isMobile"
              class="header__search-back"
              @click="searchExpanded = false"
            >
              ←
            </button>
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
            />
            <button class="header__search-btn" title="搜索" @click="onSearchOrToggle">
              {{ isMobile && !searchExpanded ? '🔍' : '' }}
              <svg v-if="!isMobile || searchExpanded" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <circle cx="11" cy="11" r="8"/>
                <path d="M21 21l-4.35-4.35"/>
              </svg>
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
          />
        </div>
        <button class="header__icon-btn" title="夜间模式" @click="toggleDarkMode">
          {{ store.darkMode ? '☀️' : '🌙' }}
        </button>
      </div>
    </div>

    <div v-if="menuOpen" class="header__overlay" @click="menuOpen = false" />
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { mockData } from '../data/index.js'
import { store } from '../store/index.js'

const router = useRouter()
const searchInput = ref(null)
const query = ref('')
const showDropdown = ref(false)
const activeIndex = ref(-1)
const menuOpen = ref(false)
const searchExpanded = ref(false)
const windowWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 1024)

const isMobile = computed(() => windowWidth.value <= 768)

const articles = mockData.articles

const suggestions = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return []
  return articles
    .filter(a => a.title.toLowerCase().includes(q))
    .slice(0, 6)
})

function handleResize() {
  windowWidth.value = window.innerWidth
  if (windowWidth.value > 768) {
    menuOpen.value = false
    searchExpanded.value = false
  }
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})

function goHome() {
  menuOpen.value = false
  searchExpanded.value = false
  router.push('/')
}

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

function onSearchOrToggle() {
  if (isMobile.value && !searchExpanded.value) {
    searchExpanded.value = true
    setTimeout(() => searchInput.value?.focus(), 100)
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
  searchExpanded.value = false
  menuOpen.value = false
  router.push(`/article/${id}`)
}

function toggleDarkMode() {
  store.toggleDarkMode()
}

function onHueChange(e) {
  store.setHue(parseInt(e.target.value, 10))
}
</script>

<style scoped>
.header__left {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.header__center {
  flex: 1;
  display: flex;
  justify-content: center;
}

.header__hamburger {
  display: none;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 5px;
  width: 40px;
  height: 40px;
  padding: 0;
  border: none;
  border-radius: var(--radius-md);
  background: transparent;
  cursor: pointer;
}

.header__hamburger-line {
  display: block;
  width: 20px;
  height: 2px;
  border-radius: 2px;
  background: var(--color-text-primary);
  transition: all 0.3s ease;
  transform-origin: center;
}

.header__hamburger--open .header__hamburger-line:nth-child(1) {
  transform: translateY(7px) rotate(45deg);
}

.header__hamburger--open .header__hamburger-line:nth-child(2) {
  opacity: 0;
}

.header__hamburger--open .header__hamburger-line:nth-child(3) {
  transform: translateY(-7px) rotate(-45deg);
}

.header__search-back {
  display: none;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  background: transparent;
  color: var(--color-text-secondary);
  font-size: 18px;
  cursor: pointer;
  flex-shrink: 0;
}

.header__overlay {
  display: none;
}

@media (max-width: 768px) {
  .header__hamburger {
    display: flex;
  }

  .header__nav {
    display: none;
    position: fixed;
    top: var(--header-height);
    left: 0;
    right: 0;
    bottom: 0;
    background: var(--color-bg-base);
    flex-direction: column;
    padding: var(--space-4);
    padding-top: var(--space-6);
    gap: 0;
    z-index: 99;
    overflow-y: auto;
  }

  .header__nav--open {
    display: flex;
  }

  .header__nav-link {
    display: block;
    padding: 14px var(--space-4);
    font-size: var(--font-size-lg);
    color: var(--color-text-primary);
    border-radius: var(--radius-md);
    transition: background-color var(--transition-fast);
  }

  .header__nav-link:hover,
  .header__nav-link--active {
    background-color: var(--color-primary-light);
    color: var(--color-primary);
  }

  .header__overlay {
    display: block;
    position: fixed;
    inset: 0;
    top: var(--header-height);
    background: rgba(0, 0, 0, 0.3);
    z-index: 98;
  }

  .header__search--expanded {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 110;
    max-width: 100%;
    margin: 0;
    padding: 0;
  }

  .header__search--expanded .header__search-box {
    border-radius: 0;
    height: var(--header-height);
    background: var(--color-bg-base);
    padding: 0 var(--space-3);
  }

  .header__search--expanded .header__search-back {
    display: flex;
  }

  .header__search--expanded .header__search-dropdown {
    position: fixed;
    top: var(--header-height);
    left: 0;
    right: 0;
    border-radius: 0;
    max-height: calc(100vh - var(--header-height));
    overflow-y: auto;
  }
}
</style>
