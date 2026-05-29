# MyBlog - 优质文章阅读平台

一个基于 **Vue 3** 构建的现代极简风格文章阅读平台，专注于提供沉浸式的内容浏览体验。

## 技术栈

| 技术 | 说明 |
|------|------|
| [Vue 3](https://vuejs.org/) | 渐进式 JavaScript 框架（Composition API + `<script setup>`） |
| [Vue Router](https://router.vuejs.org/) | 官方路由管理（Hash 模式） |
| [Vite](https://vitejs.dev/) | 下一代前端构建工具 |
| 原生 CSS | 全局样式 + 组件样式 + 响应式布局（无第三方 UI 库） |

## 特性

- **极简设计风格** — 大量留白、清晰排版、克制色彩，突出内容本身
- **暗色模式** — 支持一键切换深色/浅色主题，色相可自定义
- **文章 Markdown 驱动** — 文章内容以 Markdown 文件管理，构建时自动生成数据
- **启动屏动画** — 应用启动时展示品牌 Splash 动画
- **阅读进度条** — 页面顶部显示当前阅读进度
- **图片懒加载** — 图片进入视口时加载，并带有淡入效果
- **骨架屏加载** — 使用骨架屏减少用户等待焦虑
- **返回顶部** — 长页面一键回到顶部
- **响应式布局** — 移动端优先，适配各种屏幕尺寸
- **Emoji 彩蛋** — 点击页面任意位置触发 🐶 狗狗爆炸特效

## 快速开始

```bash
# 1. 安装依赖
npm install

# 2. 启动开发服务器（自动构建文章数据）
npm run dev

# 3. 构建生产版本
npm run build

# 4. 预览生产构建
npm run preview
```

## 项目结构

```
fav-recommend/
├── index.html                 # HTML 入口
├── package.json               # 项目配置
├── vite.config.js             # Vite 构建配置
├── .gitignore                 # Git 忽略规则
│
├── md/                        # 📝 Markdown 文章源文件
│   ├── categories.md          # 分类定义
│   ├── tags.md                # 标签定义
│   ├── UI设计/
│   ├── 产品设计/
│   ├── 前端开发/
│   └── 生活/
│
├── scripts/
│   └── build-md-data.js       # 文章数据构建脚本
│
└── src/                       # 📁 应用源代码
    ├── main.js                # 应用入口
    ├── App.vue                # 根组件
    │
    ├── components/            # 公共组件
    │   ├── AppHeader.vue      # 顶部导航栏
    │   ├── AppFooter.vue      # 页脚
    │   ├── ArticleCard.vue    # 文章卡片
    │   ├── HeroSection.vue    # 首屏推荐区
    │   ├── Sidebar.vue        # 侧边栏
    │   ├── BackToTop.vue      # 返回顶部按钮
    │   ├── SplashScreen.vue   # 启动屏
    │   └── BaseButton.vue     # 基础按钮（全局注册）
    │
    ├── pages/                 # 页面组件
    │   ├── HomePage.vue       # 首页 / 列表页
    │   └── ArticlePage.vue    # 文章详情页
    │
    ├── router/
    │   └── index.js           # 路由配置
    │
    ├── store/
    │   └── index.js           # 全局响应式状态（主题/暗色模式）
    │
    ├── composables/
    │   └── useDogExplosion.js # 狗狗爆炸特效逻辑
    │
    ├── data/
    │   └── index.js           # 静态数据（分类/标签）
    │
    └── styles/                # CSS 样式
        ├── global.css         # 全局样式与设计令牌（CSS 自定义属性）
        ├── components.css     # 组件样式（骨架屏/进度条/标签等）
        ├── layout.css         # 布局样式
        └── responsive.css    # 响应式适配
```

## 可用命令

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动开发服务器（自动构建文章数据） |
| `npm run build` | 构建生产版本 |
| `npm run preview` | 预览生产构建 |
| `npm run build:md` | 仅执行文章数据构建 |

## 文章管理

文章以 Markdown 文件形式存放在 `md/` 目录下，按分类划分子目录。每篇文章包含 YAML 风格的元数据头：

```markdown
# 文章标题

> 文章摘要/引言

- **作者：** 作者名
- **简介：** 作者简介
- **日期：** YYYY-MM-DD
- **阅读时间：** X分钟
- **浏览量：** 数字
- **推荐：** 是/否
- **emoji:** 表情符号
---

文章正文...
```

运行 `npm run build:md` 或 `npm run dev` 时，[build-md-data.js](scripts/build-md-data.js) 脚本会自动扫描 `md/` 目录，解析所有 Markdown 文件并生成 `src/data/md-data.js` 数据文件。

> `src/data/md-data.js` 为自动生成文件（已在 `.gitignore` 中忽略），请勿手动编辑。

## 主题定制

应用通过 CSS 自定义属性（Design Tokens）实现主题化，核心变量：

- `--hue`：主色调色相值（0-360），可通过 `store.setHue()` 动态修改
- 暗色模式：通过 `body.dark-mode` 类切换，所有颜色变量自动适配

## 协议

MIT License
