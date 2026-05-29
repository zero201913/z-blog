<template>
  <div
    :class="['splash', { 'splash--closing': closing }]"
  >
    <div class="splash__curtain splash__curtain--left" />
    <div class="splash__curtain splash__curtain--right" />
    <div
      :class="['splash__circle', { 'splash__circle--done': closing }]"
    >
      <span class="splash__emoji">🐶</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const emit = defineEmits(['done'])
const closing = ref(false)

onMounted(() => {
  setTimeout(() => {
    closing.value = true
  }, 1200)

  setTimeout(() => {
    emit('done')
  }, 1200 + 700)
})
</script>

<style scoped>
.splash {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.splash__curtain {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 50%;
  background: hsl(var(--hue), 70%, 85%);
  transition: width 0.7s cubic-bezier(0.65, 0, 0.35, 1);
  z-index: 1;
}

.splash__curtain--left {
  left: 0;
}

.splash__curtain--right {
  right: 0;
}

.splash--closing .splash__curtain--left {
  width: 0;
}

.splash--closing .splash__curtain--right {
  width: 0;
}

.splash__circle {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: hsl(var(--hue), 70%, 85%);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  animation: splashRotate 0.8s ease-in-out forwards;
  transition: opacity 0.4s ease, transform 0.4s ease;
}

.splash__circle--done {
  opacity: 0;
  transform: scale(0.5);
}

.splash__emoji {
  font-size: 56px;
  line-height: 1;
  animation: emojiBounce 0.8s ease-in-out forwards;
}

@keyframes splashRotate {
  0% {
    transform: rotate(0deg) scale(1);
  }
  100% {
    transform: rotate(360deg) scale(1);
  }
}

@keyframes emojiBounce {
  0% {
    transform: scale(0.3) rotate(0deg);
    opacity: 0;
  }
  50% {
    transform: scale(1.15) rotate(180deg);
    opacity: 1;
  }
  100% {
    transform: scale(1) rotate(360deg);
    opacity: 1;
  }
}
</style>
