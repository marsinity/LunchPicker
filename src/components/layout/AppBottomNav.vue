<script setup>
/**
 * 하단 탭 네비게이션 (시안 기준)
 * 메뉴를 바꾸려면 아래 `tabs` 배열만 수정하면 됩니다.
 */
import { RouterLink } from 'vue-router'

const tabs = [
  { to: '/', label: '홈', icon: '🏠', exact: true },
  { to: '/restaurants', label: '맛집 목록', icon: '📋', exact: false },
  { to: '/add', label: '등록', icon: '+', exact: false, primary: true },
  { to: '/history', label: '히스토리', icon: '🕘', exact: false },
  { to: '/settings', label: '설정', icon: '⚙️', exact: false },
]
</script>

<template>
  <nav class="bottom-nav" aria-label="하단 메뉴">
    <RouterLink
      v-for="tab in tabs"
      :key="tab.to"
      v-slot="{ href, navigate, isActive, isExactActive }"
      :to="tab.to"
      custom
    >
      <a
        :href="href"
        class="bottom-nav__item"
        :class="{
          'bottom-nav__item--active': tab.exact ? isExactActive : isActive,
          'bottom-nav__item--primary': tab.primary,
        }"
        :aria-label="tab.label"
        :aria-current="(tab.exact ? isExactActive : isActive) ? 'page' : undefined"
        @click="navigate"
      >
        <span
          class="bottom-nav__icon"
          :class="{ 'bottom-nav__icon--primary': tab.primary }"
          aria-hidden="true"
        >
          {{ tab.icon }}
        </span>
        <span v-if="!tab.primary" class="bottom-nav__label">{{ tab.label }}</span>
      </a>
    </RouterLink>
  </nav>
</template>

<style scoped>
.bottom-nav {
  position: sticky;
  bottom: 0;
  z-index: 20;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  align-items: center;
  height: var(--nav-height);
  padding: 0 var(--space-sm);
  padding-bottom: env(safe-area-inset-bottom, 0);
  background: rgb(255 255 255 / 0.92);
  backdrop-filter: saturate(180%) blur(16px);
  -webkit-backdrop-filter: saturate(180%) blur(16px);
  border-top: 1px solid var(--color-separator);
}

.bottom-nav__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.15rem;
  min-height: 3rem;
  color: var(--color-text-muted);
  text-decoration: none;
  transition: color 0.15s ease;
}

.bottom-nav__item--active:not(.bottom-nav__item--primary) {
  color: var(--color-brand);
}

.bottom-nav__item--primary {
  position: relative;
  top: -0.75rem;
}

.bottom-nav__icon {
  font-size: 1.25rem;
  line-height: 1;
}

.bottom-nav__icon--primary {
  display: grid;
  place-items: center;
  width: 3.25rem;
  height: 3.25rem;
  font-size: 1.75rem;
  font-weight: 500;
  color: #fff;
  background: var(--color-brand);
  border-radius: var(--radius-full);
  box-shadow: 0 6px 16px rgb(255 138 0 / 0.35);
}

.bottom-nav__label {
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: -0.02em;
}
</style>
