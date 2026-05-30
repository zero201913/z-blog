---
name: ui-component-design
description: 根据设计需求开发标准化的前端网页UI组件（如按钮、卡片、输入框等），包含HTML结构、CSS样式及交互逻辑
version: 1.0
author: frontend-architect
trigger_keywords:
 - 开发组件
 - 编写按钮
 - 制作卡片
 - UI样式设计
---
## 使用场景
- 快速生成符合项目规范的独立UI组件
- 统一网站的视觉风格与交互体验（如悬停效果、点击反馈）
- 建立可复用的前端组件库
## 核心设计规范
1. **目录与命名**：采用大驼峰(PascalCase)命名组件文件夹与文件（如 `Button/`, `UserProfile.vue`）；基础展示类组件建议添加前缀（如 `BaseButton`）。
2. **样式隔离**：必须使用 CSS Modules (`*.module.css`)、Vue的 `<style scoped>` 或 BEM 命名规范，避免全局样式污染。
3. **交互状态**：每个交互组件必须包含 `hover` (悬停)、`active` (点击/激活) 和 `disabled` (禁用) 的状态样式。
4. **结构与职责**：保持单一职责，将组件的逻辑（JS/TS）、模板（HTML/Vue）与样式（CSS）合理拆分。
## 操作步骤
1. **确定组件类型与变体**：识别用户需求是基础组件（如按钮、输入框）还是业务组件（如商品卡片），并确认需要的视觉变体（如实心填充、线框描边、幽灵按钮等）。
2. **构建HTML/Template结构**：编写语义化的标签结构，预留必要的插槽(Slots)或属性(Props)以支持内容自定义。
3. **编写模块化样式(CSS)**：
   - 定义基础样式（背景、边框、圆角、字体）。
   - 添加过渡动画 `transition: all 0.3s ease` 保证交互顺滑。
   - 补充各状态的视觉反馈（参考：线框按钮在悬停时反色填充）。
4. **封装与导出**：如果是React/Vue项目，确保正确导出组件接口；必要时编写配套的测试用例或文档说明。
## 示例参考（线框按钮）
用户请求：“帮我写一个线框风格的‘了解更多’按钮。”
输出代码应包含：
```html
<style>
    .btn-outline {
        background-color: transparent;   /* 背景透明 */
        color: #333;                     /* 文字颜色 */
        border: 2px solid #333;          /* 实线边框 */
        padding: 10px 20px;
        font-size: 16px;
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.3s ease;       /* 增加平滑过渡 */
    }
    .btn-outline:hover {
        background-color: #333;          /* 悬停时背景变黑 */
        color: white;                    /* 文字变白 */
    }
</style>
<button class="btn-outline">了解更多</button>
```

## 1. 核心理念与目标
- **视觉一致性**：所有组件在颜色、间距、字体、圆角等方面使用统一的设计令牌（Design Tokens）。
- **交互完整性**：每个可交互元素必须覆盖 `default`、`hover`、`active`、`focus`、`disabled` 等全部状态，并提供流畅过渡动画。
- **样式隔离性**：杜绝全局污染，强制使用 CSS Modules、Scoped CSS 或严格 BEM 命名。
- **响应式与可访问性**：移动优先，符合 WCAG 2.1 AA 级标准，支持键盘导航与屏幕阅读器。
- **原子化与组合性**：组件职责单一，通过组合实现复杂界面，而非整体覆盖样式。

## 2. 设计令牌（Design Tokens）体系
所有视觉属性必须通过 CSS 自定义属性（或预处理器变量）定义，集中管理于主题文件，禁止硬编码数值。基础令牌分为以下几类：

### 2.1 颜色系统
```css
:root {
  /* 品牌色 */
  --color-primary: #2563eb;
  --color-primary-hover: #1d4ed8;
  --color-primary-active: #1e40af;
  --color-primary-disabled: #93c5fd;

  /* 中性色 */
  --color-neutral-50: #fafafa;
  --color-neutral-100: #f5f5f5;
  --color-neutral-200: #e5e5e5;
  --color-neutral-500: #737373;
  --color-neutral-900: #171717;

  /* 功能色 */
  --color-success: #16a34a;
  --color-warning: #d97706;
  --color-error: #dc2626;
  --color-info: #0891b2;

  /* 文本颜色 */
  --color-text-primary: var(--color-neutral-900);
  --color-text-secondary: var(--color-neutral-500);
  --color-text-on-primary: #ffffff;
  --color-text-disabled: var(--color-neutral-400);

  /* 边框与背景 */
  --color-border: var(--color-neutral-200);
  --color-bg-base: #ffffff;
  --color-bg-subtle: var(--color-neutral-50);
}
```

暗色模式通过属性选择器或媒体查询覆盖：
```css
[data-theme="dark"],
@media (prefers-color-scheme: dark) {
  :root {
    --color-bg-base: #0f172a;
    --color-text-primary: #f1f5f9;
    --color-border: #334155;
    /* 其余变量相应调整 */
  }
}
```

### 2.2 间距与尺寸
使用基于 4px 的倍数体系，确保视觉节奏一致。
```css
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-6: 24px;
--space-8: 32px;
--space-12: 48px;
--space-16: 64px;

/* 组件级尺寸 */
--component-height-sm: 32px;
--component-height-md: 40px;
--component-height-lg: 48px;
--component-radius: 6px;
--component-radius-sm: 4px;
--component-radius-lg: 12px;
```

### 2.3 排版
```css
--font-family-base: 'Inter', system-ui, -apple-system, sans-serif;
--font-size-xs: 0.75rem;   /* 12px */
--font-size-sm: 0.875rem;  /* 14px */
--font-size-base: 1rem;    /* 16px */
--font-size-lg: 1.125rem;
--font-size-xl: 1.25rem;
--line-height-tight: 1.25;
--line-height-normal: 1.5;
--font-weight-normal: 400;
--font-weight-medium: 500;
--font-weight-bold: 700;
```

### 2.4 阴影与动效
```css
--shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
--shadow-md: 0 4px 6px -1px rgba(0,0,0,0.1);
--shadow-lg: 0 10px 15px -3px rgba(0,0,0,0.1);
--transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
--transition-base: 250ms ease;
--transition-slow: 350ms ease;
```

## 3. 组件分类与变体定义
所有组件按照功能分为基础组件（原子级）和业务组件（复合级）。每个组件在设计时必须明确其变体（Variant）、尺寸（Size）、状态（State）。

### 3.1 按钮 (Button)
**变体**：
- `solid`（实心填充主色）
- `outline`（线框描边，背景透明）
- `ghost`（仅文字，悬停时出现浅背景）
- `link`（文字按钮，无内边距边框）
- `danger` / `success` 等语义变体（可组合）

**尺寸**：`sm`、`md`、`lg`

**必需状态**：
- `:hover`（提高亮度或反转背景）
- `:active`（按下效果，通常加深背景或缩放）
- `:focus-visible`（轮廓 ring，仅键盘聚焦时可见）
- `:disabled`（降低不透明度至 0.5，取消指针事件，不显示交互状态）

**结构示例（Vue Scoped）**：
```html
<template>
  <button
    :class="['btn', `btn--${variant}`, `btn--${size}`]"
    :disabled="disabled"
    @click="handleClick"
  >
    <span v-if="$slots.startIcon" class="btn__icon btn__icon--start">
      <slot name="startIcon" />
    </span>
    <slot />
    <span v-if="$slots.endIcon" class="btn__icon btn__icon--end">
      <slot name="endIcon" />
    </span>
  </button>
</template>

<script setup>
defineProps({
  variant: { type: String, default: 'solid', validator: v => ['solid','outline','ghost','link'].includes(v) },
  size: { type: String, default: 'md' },
  disabled: Boolean
});
defineEmits(['click']);
</script>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  font-family: var(--font-family-base);
  font-weight: var(--font-weight-medium);
  border: 2px solid transparent;
  border-radius: var(--component-radius);
  cursor: pointer;
  transition: background-color var(--transition-fast), color var(--transition-fast), border-color var(--transition-fast), box-shadow var(--transition-fast), transform var(--transition-fast);
  user-select: none;
  text-decoration: none;
  line-height: 1;
}

/* 尺寸 */
.btn--sm { padding: var(--space-1) var(--space-3); font-size: var(--font-size-sm); height: var(--component-height-sm); }
.btn--md { padding: var(--space-2) var(--space-4); font-size: var(--font-size-base); height: var(--component-height-md); }
.btn--lg { padding: var(--space-3) var(--space-6); font-size: var(--font-size-lg); height: var(--component-height-lg); }

/* Solid 变体 */
.btn--solid {
  background-color: var(--color-primary);
  color: var(--color-text-on-primary);
  border-color: var(--color-primary);
}
.btn--solid:hover {
  background-color: var(--color-primary-hover);
  border-color: var(--color-primary-hover);
}
.btn--solid:active {
  background-color: var(--color-primary-active);
  border-color: var(--color-primary-active);
  transform: scale(0.98);
}
.btn--solid:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
  box-shadow: 0 0 0 4px rgba(37,99,235,0.3);
}

/* Outline 变体 */
.btn--outline {
  background-color: transparent;
  color: var(--color-primary);
  border-color: var(--color-primary);
}
.btn--outline:hover {
  background-color: var(--color-primary);
  color: var(--color-text-on-primary);
}
.btn--outline:active {
  background-color: var(--color-primary-active);
  border-color: var(--color-primary-active);
  color: white;
}

/* Ghost 变体 */
.btn--ghost {
  background-color: transparent;
  color: var(--color-primary);
  border-color: transparent;
}
.btn--ghost:hover {
  background-color: rgba(37,99,235,0.1);
}
.btn--ghost:active {
  background-color: rgba(37,99,235,0.2);
}

/* 禁用状态统一处理 */
.btn:disabled,
.btn[aria-disabled="true"] {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
  box-shadow: none;
  transform: none;
}
</style>
```

### 3.2 输入框 (Input)
组件必须涵盖文本输入、数字输入、文本域、选择框等。状态除基础交互外，还需包含 `readonly`、`error`、`success`。

**交互状态详细处理**：
- 基础边框色 `--color-border`，聚焦时变为 `--color-primary`，同时外发光 `box-shadow: 0 0 0 3px rgba(37,99,235,0.2)`
- 错误状态边框变红，文字提示红色，显示错误图标
- 禁用状态降低对比度，背景置灰
- 前置/后置图标插槽
- 清除按钮与密码显隐切换

**CSS Modules 示例（React）**：
```css
.inputWrapper {
  display: flex;
  align-items: center;
  border: 1px solid var(--color-border);
  border-radius: var(--component-radius);
  background: var(--color-bg-base);
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
}
.inputWrapper:focus-within {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(37,99,235,0.15);
}
.inputWrapper[data-has-error="true"] {
  border-color: var(--color-error);
}
.inputWrapper[data-has-error="true"]:focus-within {
  box-shadow: 0 0 0 3px rgba(220,38,38,0.2);
}
.input {
  border: none;
  outline: none;
  flex: 1;
  padding: var(--space-2) var(--space-3);
  font-size: var(--font-size-base);
  color: var(--color-text-primary);
  background: transparent;
}
.input:disabled {
  background-color: var(--color-bg-subtle);
  color: var(--color-text-disabled);
  cursor: not-allowed;
}
.input::placeholder {
  color: var(--color-text-secondary);
}
```

### 3.3 卡片 (Card)
卡片作为容器，需支持不同内边距、阴影层级，以及可点击卡片的交互反馈。变体包括：
- `elevated`（带阴影）
- `outlined`（纯边框）
- `flat`（无边框无阴影，仅背景区分）
- 可悬停浮起（`hoverable`）

点击卡片整体可作为操作区域，此时必须具有焦点样式与 `cursor: pointer`，按下时阴影减小并略微缩放。

**BEM 命名结构**：
```css
.card {
  background: var(--color-bg-base);
  border-radius: var(--component-radius-lg);
  padding: var(--space-6);
  transition: box-shadow var(--transition-base), transform var(--transition-base);
}
.card--elevated { box-shadow: var(--shadow-md); }
.card--outlined { border: 1px solid var(--color-border); }
.card--flat { background: var(--color-bg-subtle); }
.card--clickable { cursor: pointer; }
.card--clickable:hover { box-shadow: var(--shadow-lg); transform: translateY(-2px); }
.card--clickable:active { box-shadow: var(--shadow-sm); transform: translateY(0); }
.card--clickable:focus-visible { outline: 2px solid var(--color-primary); outline-offset: 2px; }

.card__header, .card__content, .card__footer {
  /* 内部布局留给组合使用，但基础边距预留 */
}
.card__header { margin-bottom: var(--space-4); }
.card__footer { margin-top: var(--space-4); display: flex; justify-content: flex-end; gap: var(--space-2); }
```

### 3.4 模态对话框 (Modal)
状态需包含打开/关闭动画、背景遮罩点击、ESC 关闭、焦点锁定。样式重点：
- 遮罩层淡入，内容区从透明且上移 20px 到完全显示。
- 关闭时反向动画。
- 响应式：移动端全屏或距离边缘更小。

```css
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  opacity: 0;
  visibility: hidden;
  transition: opacity var(--transition-base), visibility var(--transition-base);
}
.modal-overlay--open {
  opacity: 1;
  visibility: visible;
}
.modal-content {
  background: var(--color-bg-base);
  border-radius: var(--component-radius-lg);
  padding: var(--space-8);
  max-width: 500px;
  width: calc(100% - var(--space-8)*2);
  transform: translateY(20px);
  opacity: 0;
  transition: transform var(--transition-base), opacity var(--transition-base);
}
.modal-overlay--open .modal-content {
  transform: translateY(0);
  opacity: 1;
}
```

### 3.5 导航与菜单 (Navigation)
包括顶部导航栏、侧边栏、面包屑、标签页、下拉菜单。每种需处理当前激活项的下划线或背景高亮，过渡平滑。对于下拉菜单，要处理展开/收起动画（max-height 或 scale 变换），点击外部关闭。

## 4. 状态与交互进阶规范
### 4.1 键盘可访问性
- 所有交互元素必须可聚焦（tabindex 或默认可聚焦标签）。
- 使用 `:focus-visible` 替代 `:focus` 避免鼠标点击后残留轮廓。
- 下拉、模态、选项卡等复合组件必须实现 ARIA 属性（`role`、`aria-expanded`、`aria-selected` 等）并管理焦点陷阱。

### 4.2 动画与性能
- 仅对 `transform` 和 `opacity` 使用动画，避免 reflow/repaint（当需要动画高度时使用 FLIP 技术或 `grid` 折叠）。
- 使用 `prefers-reduced-motion` 媒体查询关闭不必要的动画：
```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### 4.3 加载与骨架屏状态
组件应支持 `loading` 状态，通过骨架屏或脉冲动画提升体验，避免布局跳动。

## 5. 响应式与容器查询
告别仅依赖媒体查询，使用容器查询实现组件级响应：
```css
.card-container {
  container-type: inline-size;
}
@container (min-width: 400px) {
  .card {
    display: flex;
    flex-direction: row;
  }
}
```
同时，所有组件采用 `max-width: 100%` 防止溢出，利用 `clamp()` 动态调整字号和内边距。

## 6. 样式隔离与命名规范实施
### 6.1 CSS Modules（React/Angular）
文件名：`ComponentName.module.css`，类名在 JS 中导入为对象，确保唯一性。

### 6.2 Scoped CSS（Vue/Svelte）
利用框架的 scoped 属性，额外使用 `:deep()` 选择器处理子组件样式需谨慎，尽可能通过 props 传递样式令牌。

### 6.3 BEM 命名（通用）
当无法使用模块化时，严格遵循 `Block__Element--Modifier`，如 `.search-bar__input--error`。所有类名均加项目唯一前缀（如 `acme-`）避免冲突。

## 7. 常见组件完整示例补充

### 7.1 开关 (Toggle)
```css
.toggle {
  width: 44px;
  height: 24px;
  border-radius: 12px;
  background: var(--color-neutral-200);
  position: relative;
  transition: background-color var(--transition-fast);
  cursor: pointer;
}
.toggle[aria-checked="true"] {
  background: var(--color-primary);
}
.toggle::after {
  content: '';
  position: absolute;
  width: 20px; height: 20px;
  border-radius: 50%;
  background: white;
  top: 2px; left: 2px;
  transition: transform var(--transition-fast);
  box-shadow: var(--shadow-sm);
}
.toggle[aria-checked="true"]::after {
  transform: translateX(20px);
}
.toggle:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}
.toggle[disabled] {
  opacity: 0.4;
  cursor: not-allowed;
}
```

### 7.2 标签/徽章 (Badge)
变体：实心、线框、圆点。状态：无交互或可关闭。可关闭时需有悬停关闭按钮样式。

### 7.3 表格
包含排序箭头、选中行高亮、斑马纹、固定表头、横向滚动。交互：行悬停背景色变化、点击行可触发。

## 8. 测试与文档自动化
每个组件必须配备：
- **Storybook 故事**：覆盖所有变体、尺寸、状态、边界（长文本、RTL 语言）。
- **单元测试**：验证组件渲染、事件发射、props 更改。
- **快照测试**：确保样式结构稳定。
- **可访问性测试**：使用 axe-core 或 Lighthouse 检查。

## 9. 总结清单
开发任何 UI 组件前，请对照以下条目：
1. 是否使用了设计令牌变量？无硬编码颜色/尺寸？
2. 是否覆盖了 default、hover、active、focus-visible、disabled、loading、error 状态？
3. 样式是否完全隔离（CSS Modules/Scoped/BEM）？
4. 是否支持暗色模式？（通过变量继承）
5. 是否移动端优先且无横向溢出？
6. 过渡动画是否限于 transform/opacity？并尊重 prefers-reduced-motion？
7. 组件是否具备语义化 HTML 与 ARIA 属性？
8. 是否定义了清晰的 Props/插槽接口并导出？

遵循本规范，开发者可快速构建出风格统一、交互完整、可维护性极强的前端组件库，适用于任何规模的项目。