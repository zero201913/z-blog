/**
 * =========================================
 * @file        LockModal.vue
 * @author      hongliang
 * @created     2026-05-29 12:00
 * @version     1.0.0
 * @description macOS 风格密码验证弹窗
 *
 * -----------------------------------------
 *  File Purpose:
 *      - 锁定文章点击后弹出密码验证
 *      - macOS 登录风格毛玻璃布局
 *      - 密码错误抖动 + 错误提示
 * -----------------------------------------
 * =========================================
 */
<template>
  <teleport to="body">
    <transition name="lock-modal">
      <div v-if="visible" class="lock-overlay" @click.self="handleCancel">
        <div class="lock-card" :class="{ 'lock-card--shake': shaking }">
          <button class="lock-card__close" @click="handleCancel" aria-label="关闭">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 3L13 13M13 3L3 13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>

          <div class="lock-card__avatar">
            <span class="lock-card__emoji">{{ article.emoji || '🔒' }}</span>
          </div>

          <div class="lock-card__info">
            <h3 class="lock-card__title">{{ article.title }}</h3>
            <p class="lock-card__hint">这篇文章已被锁定，请输入密码查看</p>
          </div>

          <div class="lock-card__field">
            <div class="lock-field">
              <span class="lock-field__icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0110 0v4"/>
                  <circle cx="12" cy="16" r="1"/>
                </svg>
              </span>
              <input
                ref="passwordInput"
                v-model="password"
                type="password"
                class="lock-field__input"
                placeholder="输入密码"
                @keydown.enter="handleConfirm"
                autocomplete="off"
              />
            </div>
          </div>

          <p v-if="errorMsg" class="lock-card__error">{{ errorMsg }}</p>

          <div class="lock-card__actions">
            <button class="lock-btn lock-btn--secondary" @click="handleCancel">取消</button>
            <button class="lock-btn lock-btn--primary" @click="handleConfirm" :disabled="!password">
              解锁
            </button>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
import { ref, nextTick, watch } from 'vue'

const props = defineProps({
  visible: { type: Boolean, default: false },
  article: { type: Object, required: true },
})

const emit = defineEmits(['close', 'unlock'])

const password = ref('')
const passwordInput = ref(null)
const errorMsg = ref('')
const shaking = ref(false)

watch(() => props.visible, async (val) => {
  if (val) {
    password.value = ''
    errorMsg.value = ''
    shaking.value = false
    await nextTick()
    passwordInput.value?.focus()
  }
})

function handleCancel() {
  password.value = ''
  errorMsg.value = ''
  shaking.value = false
  emit('close')
}

function handleConfirm() {
  if (!password.value) return

  if (password.value === props.article.lockPassword) {
    emit('unlock', props.article.id)
    password.value = ''
    errorMsg.value = ''
    shaking.value = false
  } else {
    errorMsg.value = '密码错误，请重试'
    shaking.value = true
    password.value = ''
    setTimeout(() => {
      shaking.value = false
      passwordInput.value?.focus()
    }, 500)
  }
}
</script>

<style scoped>
.lock-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

.lock-modal-enter-active {
  transition: opacity 0.3s ease;
}
.lock-modal-enter-active .lock-card {
  transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.3s ease;
}
.lock-modal-leave-active {
  transition: opacity 0.2s ease;
}
.lock-modal-leave-active .lock-card {
  transition: transform 0.2s ease, opacity 0.2s ease;
}
.lock-modal-enter-from {
  opacity: 0;
}
.lock-modal-enter-from .lock-card {
  transform: scale(0.92) translateY(20px);
  opacity: 0;
}
.lock-modal-leave-to {
  opacity: 0;
}
.lock-modal-leave-to .lock-card {
  transform: scale(0.95);
  opacity: 0;
}

.lock-card {
  position: relative;
  width: 400px;
  max-width: calc(100vw - 40px);
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(40px);
  -webkit-backdrop-filter: blur(40px);
  border-radius: 20px;
  box-shadow:
    0 25px 60px rgba(0, 0, 0, 0.15),
    0 0 0 0.5px rgba(0, 0, 0, 0.08);
  padding: 48px 40px 36px;
  text-align: center;
}

body.dark-mode .lock-card {
  background: rgba(30, 30, 45, 0.85);
  box-shadow:
    0 25px 60px rgba(0, 0, 0, 0.4),
    0 0 0 0.5px rgba(255, 255, 255, 0.06);
}

.lock-card--shake {
  animation: lock-shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97);
}

@keyframes lock-shake {
  0%, 100% { transform: translateX(0); }
  10% { transform: translateX(-8px); }
  20% { transform: translateX(8px); }
  30% { transform: translateX(-6px); }
  40% { transform: translateX(6px); }
  50% { transform: translateX(-4px); }
  60% { transform: translateX(4px); }
  70% { transform: translateX(-2px); }
  80% { transform: translateX(2px); }
  90% { transform: translateX(-1px); }
}

.lock-card__close {
  position: absolute;
  top: 14px;
  right: 14px;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.06);
  color: var(--color-text-muted);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.lock-card__close:hover {
  background: rgba(0, 0, 0, 0.12);
  color: var(--color-text-primary);
}

body.dark-mode .lock-card__close {
  background: rgba(255, 255, 255, 0.08);
  color: var(--color-text-muted);
}

body.dark-mode .lock-card__close:hover {
  background: rgba(255, 255, 255, 0.15);
  color: var(--color-text-primary);
}

.lock-card__avatar {
  width: 72px;
  height: 72px;
  margin: 0 auto 20px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--color-neutral-100) 0%, var(--color-neutral-200) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
}

body.dark-mode .lock-card__avatar {
  background: linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.1) 100%);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
}

.lock-card__emoji {
  font-size: 36px;
  line-height: 1;
}

.lock-card__info {
  margin-bottom: 24px;
}

.lock-card__title {
  font-family: var(--font-serif);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin: 0 0 6px;
  line-height: var(--line-height-tight);
}

.lock-card__hint {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  margin: 0;
}

.lock-card__field {
  margin-bottom: 8px;
}

.lock-field {
  display: flex;
  align-items: center;
  border: 1.5px solid var(--color-border);
  border-radius: 12px;
  padding: 0 14px;
  background: rgba(0, 0, 0, 0.03);
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
}

body.dark-mode .lock-field {
  background: rgba(255, 255, 255, 0.04);
}

.lock-field:focus-within {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-light);
}

.lock-field__icon {
  flex-shrink: 0;
  color: var(--color-text-muted);
  display: flex;
}

.lock-field__input {
  flex: 1;
  border: none;
  outline: none;
  padding: 14px 10px;
  font-size: var(--font-size-base);
  color: var(--color-text-primary);
  background: transparent;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Mono', monospace;
  letter-spacing: 2px;
}

.lock-field__input::placeholder {
  color: var(--color-text-muted);
  letter-spacing: 0;
}

.lock-card__error {
  font-size: var(--font-size-xs);
  color: var(--color-error);
  margin: 6px 0 0;
  min-height: 18px;
  animation: lock-error-in 0.2s ease;
}

@keyframes lock-error-in {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.lock-card__actions {
  display: flex;
  gap: var(--space-3);
  margin-top: 20px;
}

.lock-btn {
  flex: 1;
  height: 44px;
  border: none;
  border-radius: 10px;
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.lock-btn--secondary {
  background: rgba(0, 0, 0, 0.06);
  color: var(--color-text-secondary);
}

.lock-btn--secondary:hover {
  background: rgba(0, 0, 0, 0.1);
}

body.dark-mode .lock-btn--secondary {
  background: rgba(255, 255, 255, 0.08);
  color: var(--color-text-secondary);
}

body.dark-mode .lock-btn--secondary:hover {
  background: rgba(255, 255, 255, 0.14);
}

.lock-btn--primary {
  background: var(--color-primary);
  color: var(--color-text-on-primary);
}

.lock-btn--primary:hover {
  background: var(--color-primary-hover);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(26, 86, 219, 0.3);
}

.lock-btn--primary:active {
  transform: translateY(0);
}

.lock-btn--primary:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}
</style>
