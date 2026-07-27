<script setup>
import AppButton from '@/components/common/AppButton.vue'

defineProps({
  isPicking: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['pick'])
</script>

<template>
  <section class="pick-action" aria-label="점심 뽑기">
    <AppButton
      variant="primary"
      size="lg"
      block
      :disabled="isPicking"
      class="pick-action__btn"
      @click="$emit('pick')"
    >
      <span class="pick-action__icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12 3v3M12 18v3M3 12h3M18 12h3M5.64 5.64l2.12 2.12M16.24 16.24l2.12 2.12M5.64 18.36l2.12-2.12M16.24 7.76l2.12-2.12"
            stroke="currentColor"
            stroke-width="1.75"
            stroke-linecap="round"
          />
          <circle cx="12" cy="12" r="3.25" stroke="currentColor" stroke-width="1.75" />
        </svg>
      </span>
      {{ isPicking ? '뽑는 중...' : '오늘 점심 뽑기' }}
    </AppButton>
  </section>
</template>

<style scoped>
.pick-action {
  animation: pick-in 0.55s cubic-bezier(0.22, 1, 0.36, 1) 0.12s both;
}

.pick-action__btn {
  min-height: 3.5rem !important;
  border-radius: var(--radius-xl) !important;
  font-size: 1.0625rem !important;
  letter-spacing: -0.02em;
  box-shadow:
    0 1px 2px rgb(255 138 0 / 0.2),
    0 8px 24px rgb(255 138 0 / 0.28) !important;
}

.pick-action__icon {
  display: inline-flex;
  width: 1.25rem;
  height: 1.25rem;
}

.pick-action__icon svg {
  width: 100%;
  height: 100%;
}

@keyframes pick-in {
  from {
    opacity: 0;
    transform: translateY(10px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
</style>
