<script setup>
/**
 * 조건 설정 화면 (시안)
 * - 홈의 빠른 조건 카드를 누르면 이 페이지로 옵니다.
 * - 선택한 값은 홈과 공유됩니다. (useQuickFilters)
 */
import { computed, nextTick, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  FILTER_GROUPS,
  FILTER_OPTIONS,
  useQuickFilters,
} from '@/composables/useQuickFilters'

const route = useRoute()
const router = useRouter()
const { filters, isActive, setFilter, resetFilters } = useQuickFilters()

const sectionRefs = ref({})

const focusKey = computed(() => {
  const key = route.query.focus
  return typeof key === 'string' ? key : null
})

function setSectionRef(key, el) {
  if (el) sectionRefs.value[key] = el
}

function selectOption(key, value) {
  setFilter(key, value)
}

function handleReset() {
  resetFilters()
}

function goBack() {
  router.push({ name: 'home' })
}

onMounted(async () => {
  await nextTick()
  const key = focusKey.value
  if (key && sectionRefs.value[key]) {
    sectionRefs.value[key].scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
})
</script>

<template>
  <div class="filters-page">
    <header class="filters-page__header">
      <button type="button" class="filters-page__back" aria-label="홈으로" @click="goBack">
        ←
      </button>
      <h1 class="filters-page__title">조건 설정</h1>
      <button
        type="button"
        class="filters-page__reset"
        :disabled="!isActive"
        @click="handleReset"
      >
        초기화
      </button>
    </header>

    <p class="filters-page__desc">원하는 조건을 고르면 홈 뽑기에 바로 적용돼요.</p>

    <div class="filters-page__body">
      <section
        v-for="group in FILTER_GROUPS"
        :key="group.key"
        :ref="(el) => setSectionRef(group.key, el)"
        class="filters-page__section"
        :class="{ 'filters-page__section--focus': focusKey === group.key }"
      >
        <h2 class="filters-page__section-title">
          <span aria-hidden="true">{{ group.emoji }}</span>
          {{ group.label }}
        </h2>

        <div class="filters-page__options" role="group" :aria-label="group.label">
          <button
            type="button"
            class="filters-page__chip"
            :class="{ 'filters-page__chip--active': filters[group.key] == null }"
            :aria-pressed="filters[group.key] == null"
            @click="selectOption(group.key, null)"
          >
            전체
          </button>

          <button
            v-for="option in FILTER_OPTIONS[group.key]"
            :key="option.value"
            type="button"
            class="filters-page__chip"
            :class="{ 'filters-page__chip--active': filters[group.key] === option.value }"
            :aria-pressed="filters[group.key] === option.value"
            @click="selectOption(group.key, option.value)"
          >
            {{ option.label }}
          </button>
        </div>
      </section>
    </div>

    <button type="button" class="filters-page__done" @click="goBack">
      적용하고 홈으로
    </button>
  </div>
</template>

<style scoped>
.filters-page {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
  padding-bottom: var(--space-md);
}

.filters-page__header {
  display: grid;
  grid-template-columns: 2.5rem 1fr auto;
  align-items: center;
  gap: var(--space-sm);
}

.filters-page__back {
  width: 2.5rem;
  height: 2.5rem;
  font-size: 1.125rem;
  color: var(--color-text);
  background: var(--color-surface);
  border: 1px solid #efe8e3;
  border-radius: var(--radius-full);
}

.filters-page__title {
  font-size: var(--font-size-xl);
  font-weight: 800;
  letter-spacing: -0.03em;
  text-align: center;
}

.filters-page__reset {
  padding: 0.375rem 0.25rem;
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--color-brand);
  background: transparent;
  border: none;
}

.filters-page__reset:disabled {
  color: var(--color-text-muted);
  opacity: 0.55;
  cursor: not-allowed;
}

.filters-page__desc {
  margin-top: calc(var(--space-sm) * -1);
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  text-align: center;
}

.filters-page__body {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

.filters-page__section {
  padding: var(--space-lg);
  background: var(--color-surface);
  border: 1px solid #efe8e3;
  border-radius: 20px;
  box-shadow: 0 1px 3px rgb(0 0 0 / 0.03);
  scroll-margin-top: var(--space-md);
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.filters-page__section--focus {
  border-color: rgb(255 138 0 / 0.45);
  box-shadow: 0 0 0 3px rgb(255 138 0 / 0.12);
}

.filters-page__section-title {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin-bottom: var(--space-md);
  font-size: var(--font-size-base);
  font-weight: 700;
  letter-spacing: -0.02em;
}

.filters-page__options {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.filters-page__chip {
  min-height: 2.25rem;
  padding: 0 0.95rem;
  font-size: var(--font-size-sm);
  font-weight: 600;
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

.filters-page__chip:active {
  transform: scale(0.97);
}

.filters-page__chip--active {
  color: #fff;
  background: var(--color-brand);
  border-color: var(--color-brand);
}

.filters-page__done {
  width: 100%;
  min-height: 3.25rem;
  margin-top: var(--space-sm);
  font-size: 1.0625rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: #fff;
  background: var(--color-brand);
  border: none;
  border-radius: var(--radius-full);
  box-shadow: 0 8px 20px rgb(255 138 0 / 0.28);
}

.filters-page__done:active {
  transform: scale(0.98);
}
</style>
