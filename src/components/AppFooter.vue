/**
 * =========================================
 * @file        AppFooter.vue
 * @author      hongliang
 * @created     2026-05-29 12:00
 * @version     1.0.0
 * @description 全局页脚，展示分类、标签和本站信息
 *
 * -----------------------------------------
 *  File Purpose:
 *      - 动态展示文章分类链接
 *      - 热门标签快捷入口
 *      - 版权及站点信息
 * -----------------------------------------
 * =========================================
 */
<template>
  <footer class="footer">
    <div class="footer__inner">
      <div class="footer__brand">
        <a href="#" class="footer__logo" @click.prevent="goHome">MyBlog</a>
        <p>一个专注于优质内容阅读的平台，汇聚各领域优秀作者，为你提供有价值的文章。</p>
        <div class="footer__tagline">
          <span v-for="t in tags" :key="t" class="footer__tag" @click="goAll">{{ t }}</span>
        </div>
      </div>

      <div class="footer__links">
        <h4>文章分类</h4>
        <ul>
          <li v-for="cat in categories" :key="cat.id">
            <a href="#" @click.prevent="goAll"># {{ cat.name }}</a>
          </li>
        </ul>
      </div>

      <div class="footer__links">
        <h4>快捷导航</h4>
        <ul>
          <li><a href="#" @click.prevent="goHome">首页</a></li>
          <li><a href="#" @click.prevent="goAll">全部文章</a></li>
        </ul>
      </div>

      <div class="footer__links">
        <h4>关于本站</h4>
        <ul>
          <li><span class="footer__stat">文章总数：{{ totalArticles }} 篇</span></li>
          <li><span class="footer__stat">分类：{{ categories.length }} 个</span></li>
        </ul>
      </div>
    </div>

    <div class="footer__bottom">
      <p>&copy; 2026 MyBlog &mdash; Built with Vue 3 + Vite</p>
    </div>
  </footer>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { mockData } from '../data/index.js'

const router = useRouter()

const categories = mockData.categories
const tags = mockData.tags
const totalArticles = mockData.articles.length

function goHome() {
  router.push('/')
}

function goAll() {
  router.push('/all')
}
</script>

<style scoped>
.footer__logo {
  font-family: var(--font-serif);
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-neutral-100);
  margin-bottom: var(--space-2);
  display: block;
}

.footer__tagline {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin-top: var(--space-3);
}

.footer__tag {
  display: inline-block;
  font-size: var(--font-size-xs);
  color: var(--color-neutral-400);
  background: rgba(255, 255, 255, 0.06);
  padding: 4px 10px;
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.footer__tag:hover {
  color: var(--color-primary);
  background: rgba(26, 86, 219, 0.15);
}

.footer__stat {
  font-size: var(--font-size-sm);
  color: var(--color-neutral-400);
}

@media (max-width: 768px) {
  .footer__tagline {
    gap: var(--space-1);
  }

  .footer__tag {
    font-size: 10px;
    padding: 3px 8px;
  }
}
</style>
