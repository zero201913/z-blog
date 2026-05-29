import { mdData } from './md-data.js'

export const mockData = {
  get categories() { return mdData.categories },
  get tags() { return mdData.tags },
  get articles() { return mdData.articles },

  getFeaturedArticles() {
    return this.articles.filter(a => a.isFeatured)
  },

  getNormalArticles() {
    return this.articles.filter(a => !a.isFeatured)
  },

  getArticleById(id) {
    return this.articles.find(a => a.id === parseInt(id))
  },

  getRelatedArticles(currentId, count = 3) {
    return this.articles.filter(a => a.id !== currentId).slice(0, count)
  },
}
