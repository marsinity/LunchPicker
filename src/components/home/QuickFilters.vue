<script setup>
/**
 * 홈의 "빠른 조건 선택" 요약 카드
 * - 카드를 누르면 조건 설정 화면(/filters)으로 이동합니다.
 * - 실제 옵션 선택은 FiltersView에서 합니다.
 */
import { useRouter } from 'vue-router'
import {
  FILTER_GROUPS,
  getFilterLabel,
  useQuickFilters,
} from '@/composables/useQuickFilters'

defineProps({
  candidateCount: {
    type: Number,
    default: 0,
  },
})

const emit = defineEmits(['reset'])

const router = useRouter()
const { filters, isActive, resetFilters } = useQuickFilters()

function openFilters(key) {
  router.push({
    name: 'filters',
    query: { focus: key },
  })
}

function handleReset() {
  resetFilters()
  emit('reset')
}
</script>

<template>
  <section class="filters" aria-labelledby="filters-title">
    <div class="filters__header">
      <h2 id="filters-title" class="filters__title">빠른 조건 선택</h2>
      <button
        type="button"
        class="filters__reset"
        :disabled="!isActive"
        @click="handleReset"
      >
        초기화
      </button>
    </div>

    <div class="filters__grid">
      <button
        v-for="group in FILTER_GROUPS"
        :key="group.key"
        type="button"
        class="filters__card"
        :class="{ 'filters__card--active': filters[group.key] != null }"
        @click="openFilters(group.key)"
      >
        <span class="filters__name">{{ group.label }}</span>
        <span class="filters__emoji" aria-hidden="true">{{ group.emoji }}</span>
        <span class="filters__value">
          {{ getFilterLabel(group.key, filters[group.key]) }}
        </span>
      </button>
    </div>

    <p class="filters__count" role="status">
      현재 조건에 맞는 식당 <strong>{{ candidateCount }}곳</strong>
    </p>
  </section>
</template>

<style scoped>
.filters {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  animation: filters-in 0.55s cubic-bezier(0.22, 1, 0.36, 1) 0.18s both;
}

.filters__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-md);
  padding: 0 var(--space-xs);
}

.filters__title {
  font-size: var(--font-size-lg);
  font-weight: 700;
  letter-spacing: -0.025em;
}

.filters__reset {
  padding: 0.25rem 0.125rem;
  font-size: var(--font-size-sm);
  font-weight: 600;
  letter-spacing: -0.01em;
  color: var(--color-brand);
  background: transparent;
  border: none;
  transition: opacity 0.15s ease, color 0.15s ease;
}

.filters__reset:hover:not(:disabled) {
  color: var(--color-brand-dark);
}

.filters__reset:disabled {
  color: var(--color-text-muted);
  opacity: 0.55;
  cursor: not-allowed;
}

.filters__grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 8px;
}

.filters__card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  width: 100%;
  min-height: 108px;
  padding: 0.75rem 0.35rem;
  text-align: center;
  background: #ffffff;
  border: 1px solid #efe8e3;
  border-radius: 16px;
  box-shadow: 0 1px 3px rgb(0 0 0 / 0.03);
  transition:
    background-color 0.18s ease,
    border-color 0.18s ease,
    box-shadow 0.18s ease,
    transform 0.12s ease;
}

.filters__card:active {
  transform: scale(0.985);
}

.filters__card--active {
  background: var(--color-brand-soft);
  border-color: rgb(255 138 0 / 0.45);
  box-shadow: 0 1px 4px rgb(255 138 0 / 0.08);
}

.filters__name {
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: var(--color-text-secondary);
}

.filters__card--active .filters__name {
  color: var(--color-brand);
}

.filters__emoji {
  font-size: 1.5rem;
  line-height: 1;
}

.filters__value {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--color-text);
  line-height: 1.25;
  word-break: keep-all;
}

.filters__card--active .filters__value {
  color: var(--color-brand);
}

.filters__count {
  margin: 0;
  padding: 0 var(--space-xs);
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  text-align: center;
}

.filters__count strong {
  color: var(--color-brand);
  font-weight: 700;
}

@keyframes filters-in {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
