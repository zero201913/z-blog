<template>
  <button
    :class="['back-to-top', { 'back-to-top--visible': visible }]"
    title="返回顶部"
    @click="scrollToTop"
    aria-label="返回顶部"
  >
    ⬆️
  </button>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const visible = ref(false)

function handleScroll() {
  visible.value = window.scrollY > 300
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>
