<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <header class="header">
    <div class="header__inner">
      <RouterLink to="/" class="header__brand">
        <span class="header__logo" aria-hidden="true">L</span>
        <span class="header__title">LunchPicker</span>
      </RouterLink>

      <nav class="header__nav" aria-label="주요 메뉴">
        <RouterLink to="/" class="header__link" active-class="header__link--active">
          추천
        </RouterLink>
        <RouterLink
          to="/restaurants"
          class="header__link"
          active-class="header__link--active"
        >
          식당
        </RouterLink>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.header {
  position: sticky;
  top: 0;
  z-index: 10;
  height: var(--header-height);
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
}

.header__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: var(--max-width);
  height: 100%;
  margin: 0 auto;
  padding: 0 var(--space-md);
}

.header__brand {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  font-weight: 700;
  font-size: var(--font-size-lg);
}

.header__logo {
  display: grid;
  place-items: center;
  width: 1.75rem;
  height: 1.75rem;
  font-size: var(--font-size-sm);
  font-weight: 800;
  color: var(--color-text-inverse);
  background: var(--color-brand);
  border-radius: var(--radius-sm);
  line-height: 1;
}

.header__nav {
  display: flex;
  gap: var(--space-sm);
}

.header__link {
  padding: var(--space-xs) var(--space-sm);
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--color-text-muted);
  border-radius: var(--radius-sm);
  transition: color 0.15s ease, background-color 0.15s ease;
}

.header__link:hover {
  color: var(--color-text);
  background: var(--color-surface-muted);
}

.header__link--active {
  color: var(--color-brand);
  background: var(--color-brand-soft);
}
</style>
