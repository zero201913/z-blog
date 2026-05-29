<template>
  <div id="app-root">
    <template v-if="!splashDone">
      <splash-screen @done="onSplashDone" />
    </template>
    <template v-else>
      <app-header />
      <main>
        <router-view />
      </main>
      <back-to-top />
      <app-footer />
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { store } from './store/index.js'
import { useDogExplosion } from './composables/useDogExplosion.js'
import SplashScreen from './components/SplashScreen.vue'
import AppHeader from './components/AppHeader.vue'
import AppFooter from './components/AppFooter.vue'
import BackToTop from './components/BackToTop.vue'

const router = useRouter()
const splashDone = ref(false)
const { start: startDogExplosion, stop: stopDogExplosion } = useDogExplosion()

function onSplashDone() {
  splashDone.value = true
  requestAnimationFrame(() => {
    store.initTheme()
    startDogExplosion()
  })
}

onMounted(() => {
  store.initTheme()
  router.afterEach(() => {
    window.scrollTo(0, 0)
  })
})

onBeforeUnmount(() => {
  stopDogExplosion()
})
</script>
