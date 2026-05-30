import { createRouter, createWebHashHistory } from 'vue-router'
import HomePage from '../pages/HomePage.vue'
import ArticlePage from '../pages/ArticlePage.vue'
import AllArticlesPage from '../pages/AllArticlesPage.vue'

const routes = [
  { path: '/', component: HomePage },
  { path: '/article/:id', component: ArticlePage },
  { path: '/all', component: AllArticlesPage },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
