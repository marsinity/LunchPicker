<script setup>
/**
 * 앱 공통 레이아웃
 * - 위: 페이지 내용
 * - 아래: 하단 탭 (시안)
 * - 뽑기 결과 화면(meta.hideNav)에서는 하단 탭을 숨깁니다.
 */
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppBottomNav from '@/components/layout/AppBottomNav.vue'

const route = useRoute()
const showNav = computed(() => !route.meta.hideNav)
const isBleed = computed(() => Boolean(route.meta.bleed))
</script>

<template>
  <div class="layout" :class="{ 'layout--bleed': isBleed }">
    <main class="layout__main" :class="{ 'layout__main--bleed': isBleed }">
      <slot />
    </main>
    <AppBottomNav v-if="showNav" />
  </div>
</template>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
}

.layout__main {
  flex: 1;
  width: 100%;
  max-width: var(--max-width);
  margin: 0 auto;
  padding: var(--space-lg) var(--space-md) var(--space-xl);
  padding-bottom: calc(var(--space-xl) + 0.5rem);
}

.layout__main--bleed {
  max-width: none;
  padding: 0;
}

.layout--bleed {
  background: transparent;
}
</style>
