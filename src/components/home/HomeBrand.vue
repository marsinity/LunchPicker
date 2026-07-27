<script setup>
defineProps({
  title: {
    type: String,
    default: '오늘 뭐 먹지?',
  },
  subtitle: {
    type: String,
    default: '고민은 줄이고, 점심은 맛있게',
  },
})
</script>

<template>
  <header class="brand">
    <div class="brand__logo" aria-hidden="true">
      <svg class="brand__mark" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="40" height="40" rx="12" fill="currentColor" />
        <path
          d="M13 14.5c0-.828.672-1.5 1.5-1.5h2c.828 0 1.5.672 1.5 1.5V28a1.5 1.5 0 0 1-3 0v-8.5H14.5A1.5 1.5 0 0 1 13 18v-3.5Z"
          fill="#fff"
        />
        <path
          d="M22 13a1.5 1.5 0 0 1 1.5-1.5H26a1.5 1.5 0 0 1 1.5 1.5v6.25c1.243 0 2.25 1.007 2.25 2.25V28a1.5 1.5 0 0 1-3 0v-5.5h-1.5V28a1.5 1.5 0 0 1-3 0V13Z"
          fill="#fff"
        />
      </svg>
    </div>
    <div class="brand__text">
      <p class="brand__name">LunchPicker</p>
      <h1 class="brand__title">{{ title }}</h1>
      <p class="brand__subtitle">{{ subtitle }}</p>
    </div>
  </header>
</template>

<style scoped>
.brand {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-lg);
  text-align: center;
  padding: var(--space-sm) 0 var(--space-md);
}

.brand__logo {
  color: var(--color-brand);
  animation: brand-in 0.55s cubic-bezier(0.22, 1, 0.36, 1) both;
}

.brand__mark {
  width: 3.5rem;
  height: 3.5rem;
  display: block;
  filter: drop-shadow(0 6px 16px rgb(255 138 0 / 0.28));
}

.brand__text {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
  animation: brand-in 0.55s cubic-bezier(0.22, 1, 0.36, 1) 0.08s both;
}

.brand__name {
  font-size: var(--font-size-sm);
  font-weight: 600;
  letter-spacing: 0.04em;
  color: var(--color-brand);
}

.brand__title {
  font-size: var(--font-size-3xl);
  font-weight: 700;
  letter-spacing: -0.035em;
  line-height: 1.15;
  color: var(--color-text);
}

.brand__subtitle {
  margin-top: var(--space-xs);
  font-size: var(--font-size-base);
  color: var(--color-text-muted);
  letter-spacing: -0.01em;
}

@keyframes brand-in {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (min-width: 48rem) {
  .brand__title {
    font-size: 2.5rem;
  }

  .brand__mark {
    width: 4rem;
    height: 4rem;
  }
}
</style>
