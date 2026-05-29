<template>
  <button
    :class="['btn', `btn--${variant}`, `btn--${size}`]"
    :disabled="disabled"
    @click="$emit('click', $event)"
  >
    <slot />
  </button>
</template>

<script setup>
defineProps({
  variant: {
    type: String,
    default: 'solid',
    validator: (v) => ['solid', 'outline', 'ghost', 'link'].includes(v),
  },
  size: {
    type: String,
    default: 'md',
    validator: (v) => ['sm', 'md', 'lg'].includes(v),
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['click'])
</script>
