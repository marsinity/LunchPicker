<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <header class="header">
    <div class="header__inner">
      <RouterLink to="/" class="header__brand">
        <span class="header__logo" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="24" height="24" rx="7" fill="currentColor" />
            <path
              d="M8 8.5c0-.552.448-1 1-1h1.2c.552 0 1 .448 1 1V17a1 1 0 1 1-2 0v-5.2H9A1 1 0 0 1 8 10.8V8.5Z"
              fill="#fff"
            />
            <path
              d="M13.2 7.5a1 1 0 0 1 1-1H15.5a1 1 0 0 1 1 1v3.8c.773 0 1.4.627 1.4 1.4V17a1 1 0 1 1-2 0v-3.3h-.9V17a1 1 0 1 1-2 0V7.5Z"
              fill="#fff"
            />
          </svg>
        </span>
        <span class="header__title">LunchPicker</span>
      </RouterLink>

      <nav class="header__nav" aria-label="주요 메뉴">
        <RouterLink to="/" class="header__link" active-class="header__link--active">
          홈
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
  background: rgb(245 245 247 / 0.78);
  backdrop-filter: saturate(180%) blur(16px);
  -webkit-backdrop-filter: saturate(180%) blur(16px);
  border-bottom: 1px solid var(--color-separator);
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
  gap: 0.625rem;
  font-weight: 600;
  font-size: var(--font-size-base);
  letter-spacing: -0.02em;
}

.header__logo {
  display: block;
  width: 1.625rem;
  height: 1.625rem;
  color: var(--color-brand);
}

.header__logo svg {
  width: 100%;
  height: 100%;
  display: block;
}

.header__nav {
  display: flex;
  gap: 0.25rem;
}

.header__link {
  padding: 0.375rem 0.75rem;
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--color-text-muted);
  border-radius: var(--radius-full);
  transition: color 0.15s ease, background-color 0.15s ease;
}

.header__link:hover {
  color: var(--color-text);
  background: rgb(0 0 0 / 0.04);
}

.header__link--active {
  color: var(--color-brand);
  background: var(--color-brand-soft);
}
</style>
