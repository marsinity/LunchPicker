<script setup>
defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'ghost'].includes(value),
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value),
  },
  block: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <button
    class="btn"
    :class="[`btn--${variant}`, `btn--${size}`, { 'btn--block': block }]"
    :disabled="disabled"
    type="button"
  >
    <slot />
  </button>
</template>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
  border: none;
  border-radius: var(--radius-md);
  font-weight: 600;
  transition:
    background-color 0.15s ease,
    color 0.15s ease,
    transform 0.1s ease,
    box-shadow 0.15s ease;
}

.btn:active:not(:disabled) {
  transform: scale(0.98);
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn--block {
  width: 100%;
}

.btn--sm {
  min-height: 2.25rem;
  padding: 0 var(--space-md);
  font-size: var(--font-size-sm);
}

.btn--md {
  min-height: 2.75rem;
  padding: 0 var(--space-lg);
  font-size: var(--font-size-base);
}

.btn--lg {
  min-height: 3.25rem;
  padding: 0 var(--space-xl);
  font-size: var(--font-size-lg);
}

.btn--primary {
  color: var(--color-text-inverse);
  background: var(--color-brand);
  box-shadow: var(--shadow-sm);
}

.btn--primary:hover:not(:disabled) {
  background: var(--color-brand-dark);
}

.btn--secondary {
  color: var(--color-text);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
}

.btn--secondary:hover:not(:disabled) {
  background: var(--color-surface-muted);
}

.btn--ghost {
  color: var(--color-text-muted);
  background: transparent;
}

.btn--ghost:hover:not(:disabled) {
  color: var(--color-text);
  background: var(--color-surface-muted);
}
</style>
