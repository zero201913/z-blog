#!/usr/bin/env node
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const MD_DIR = path.resolve(ROOT, 'md')
const OUTPUT_FILE = path.resolve(ROOT, 'src/data/md-data.js')

function mdToHtml(markdown) {
  const rawLines = markdown.split('\n')
  const lines = []
  let inCodeBlock = false
  let codeBlockContent = []
  let codeBlockLang = ''

  for (const line of rawLines) {
    if (line.trim().startsWith('```')) {
      if (inCodeBlock) {
        codeBlockContent.push(line)
        lines.push({ type: 'codeBlock', content: codeBlockContent.join('\n'), lang: codeBlockLang })
        codeBlockContent = []
        inCodeBlock = false
      } else {
        inCodeBlock = true
        codeBlockLang = line.trim().slice(3).trim()
        codeBlockContent = [line]
      }
      continue
    }
    if (inCodeBlock) {
      codeBlockContent.push(line)
      continue
    }
    lines.push({ type: 'line', content: line })
  }

  if (inCodeBlock && codeBlockContent.length > 0) {
    lines.push({ type: 'codeBlock', content: codeBlockContent.join('\n'), lang: codeBlockLang })
  }

  const htmlParts = []
  let inList = false
  let listTag = null

  function closeList() {
    if (inList) {
      htmlParts.push(`</${listTag}>`)
      inList = false
      listTag = null
    }
  }

  for (const item of lines) {
    if (item.type === 'codeBlock') {
      closeList()
      const contentLines = item.content.split('\n')
      const codeLines = contentLines.slice(1, -1)
      const code = codeLines.join('\n')
      htmlParts.push(`<pre><code>${escapeHtml(code)}</code></pre>`)
      continue
    }

    const line = item.content

    if (line.trim() === '') {
      closeList()
      continue
    }

    if (line.trim() === '---') {
      closeList()
      continue
    }

    const h3Match = line.match(/^###\s+(.+)/)
    if (h3Match) {
      closeList()
      htmlParts.push(`<h3>${inlineMdToHtml(h3Match[1].trim())}</h3>`)
      continue
    }

    const h2Match = line.match(/^##\s+(.+)/)
    if (h2Match) {
      closeList()
      htmlParts.push(`<h2>${inlineMdToHtml(h2Match[1].trim())}</h2>`)
      continue
    }

    const h1Match = line.match(/^#\s+(.+)/)
    if (h1Match) {
      closeList()
      htmlParts.push(`<h1>${inlineMdToHtml(h1Match[1].trim())}</h1>`)
      continue
    }

    const quoteMatch = line.match(/^>\s+(.*)/)
    if (quoteMatch) {
      closeList()
      htmlParts.push(`<blockquote>${inlineMdToHtml(quoteMatch[1].trim())}</blockquote>`)
      continue
    }

    const liMatch = line.match(/^-\s+(.+)/)
    if (liMatch) {
      if (!inList) {
        inList = true
        listTag = 'ul'
        htmlParts.push('<ul>')
      }
      htmlParts.push(`<li>${inlineMdToHtml(liMatch[1].trim())}</li>`)
      continue
    }

    closeList()
    htmlParts.push(`<p>${inlineMdToHtml(line.trim())}</p>`)
  }

  closeList()
  return htmlParts.join('\n')
}

function inlineMdToHtml(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
}

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function collectArticleFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...collectArticleFiles(fullPath))
    } else if (entry.name.startsWith('article-') && entry.name.endsWith('.md')) {
      files.push(fullPath)
    }
  }

  return files.sort()
}

function parseArticleMd(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8')
  const lines = content.split('\n')

  const article = {}
  let inBody = false
  const bodyLines = []

  for (const line of lines) {
    if (!inBody && line.trim() === '---') {
      inBody = true
      continue
    }

    if (!inBody) {
      const titleMatch = line.match(/^#\s+(.+)/)
      if (titleMatch) { article.title = titleMatch[1].trim(); continue }

      const excerptMatch = line.match(/^>\s+(.+)/)
      if (excerptMatch) { article.excerpt = excerptMatch[1].trim(); continue }

      const metaMatch = line.match(/^-\s+\*\*(.+?)[：:]\*\*\s*(.*)/)
      if (metaMatch) {
        const key = metaMatch[1].trim()
        const value = metaMatch[2].trim()
        switch (key) {
          case '分类': article.category = value; break
          case '作者': article.authorName = value; break
          case '简介': article.authorBio = value; break
          case '日期': article.date = value; break
          case '阅读时间': article.readTime = value; break
          case '浏览量': article.views = parseInt(value.replace(/,/g, ''), 10); break
          case '推荐': article.isFeatured = value === '是'; break
          case 'emoji': article.emoji = value; break
          case '标签': article.tags = value.split(/[,，]\s*/).map(t => t.trim()).filter(Boolean); break
        }
        continue
      }
    } else {
      bodyLines.push(line)
    }
  }

  const basename = path.basename(filePath, '.md')
  const idMatch = basename.match(/article-(\d+)/)
  article.id = idMatch ? parseInt(idMatch[1], 10) : 0

  const rawMd = bodyLines.join('\n').trim()
  article.content = mdToHtml(rawMd)

  if (!article.emoji) {
    article.emoji = '📄'
  }

  if (!article.tags) {
    article.tags = []
  }

  const parentDir = path.basename(path.dirname(filePath))
  if (!article.category) {
    article.category = parentDir
  }

  article.author = { name: article.authorName || '', bio: article.authorBio || '' }
  delete article.authorName
  delete article.authorBio

  return article
}

function build() {
  console.log('Building md-data from md/ files...')

  const articleFiles = collectArticleFiles(MD_DIR)
  const articles = articleFiles.map(f => parseArticleMd(f))

  const categorySet = new Set()
  const tagSet = new Set()
  for (const a of articles) {
    if (a.category) categorySet.add(a.category)
    if (a.tags) a.tags.forEach(t => tagSet.add(t))
  }

  const categories = Array.from(categorySet).map((name, i) => ({
    id: i + 1,
    name,
    slug: name.toLowerCase().replace(/\s+/g, '-'),
  }))

  const tags = Array.from(tagSet).sort()

  const data = { categories, tags, articles }

  const output = `// Auto-generated from md/ files. Do not edit manually.
// Run: npm run build:md

export const mdData = ${JSON.stringify(data, null, 2)}
`

  const outDir = path.dirname(OUTPUT_FILE)
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true })
  }

  fs.writeFileSync(OUTPUT_FILE, output, 'utf-8')
  console.log(`\u2713 Generated ${path.relative(ROOT, OUTPUT_FILE)}`)
  console.log(`  - ${categories.length} categories`)
  console.log(`  - ${tags.length} tags`)
  console.log(`  - ${articles.length} articles`)
  for (const a of articles) {
    console.log(`    [${a.id}] ${a.emoji} ${a.title} (${a.category})`)
  }
}

build()
