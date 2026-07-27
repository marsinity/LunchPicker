<script setup>
import { FILTER_OPTIONS } from '@/composables/useQuickFilters'

defineProps({
  modelValue: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['toggle'])

const groups = [
  { key: 'distance', label: '거리' },
  { key: 'price', label: '가격' },
  { key: 'menu', label: '메뉴' },
  { key: 'party', label: '인원' },
]

function onSelect(key, value) {
  emit('toggle', key, value)
}
</script>

<template>
  <section class="filters" aria-labelledby="filters-title">
    <div class="filters__header">
      <h2 id="filters-title" class="filters__title">빠른 조건 선택</h2>
      <p class="filters__desc">원하는 조건을 골라 점심을 좁혀 보세요</p>
    </div>

    <div class="filters__groups">
      <div v-for="group in groups" :key="group.key" class="filters__group">
        <p class="filters__label" :id="`filter-${group.key}`">{{ group.label }}</p>
        <div
          class="filters__chips"
          role="group"
          :aria-labelledby="`filter-${group.key}`"
        >
          <button
            v-for="option in FILTER_OPTIONS[group.key]"
            :key="option.value"
            type="button"
            class="filters__chip"
            :class="{ 'filters__chip--active': modelValue[group.key] === option.value }"
            :aria-pressed="modelValue[group.key] === option.value"
            @click="onSelect(group.key, option.value)"
          >
            {{ option.label }}
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.filters {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
  padding: var(--space-lg);
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  animation: filters-in 0.55s cubic-bezier(0.22, 1, 0.36, 1) 0.18s both;
}

.filters__header {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.filters__title {
  font-size: var(--font-size-lg);
  font-weight: 700;
  letter-spacing: -0.025em;
}

.filters__desc {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
}

.filters__groups {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.filters__group {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.filters__label {
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--color-text-secondary);
  letter-spacing: -0.01em;
}

.filters__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
}

.filters__chip {
  min-height: 2rem;
  padding: 0 0.875rem;
  font-size: var(--font-size-sm);
  font-weight: 500;
  letter-spacing: -0.01em;
  color: var(--color-text);
  background: var(--color-surface-muted);
  border: 1px solid transparent;
  border-radius: var(--radius-full);
  transition:
    background-color 0.18s ease,
    color 0.18s ease,
    border-color 0.18s ease,
    transform 0.12s ease;
}

.filters__chip:active {
  transform: scale(0.97);
}

.filters__chip--active {
  color: var(--color-brand);
  background: var(--color-brand-soft);
  border-color: rgb(255 138 0 / 0.22);
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
