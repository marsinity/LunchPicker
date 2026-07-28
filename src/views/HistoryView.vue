<script setup>
/**
 * 히스토리 화면 — 이전에 뽑았던 점심 기록
 */
import { useRouter } from 'vue-router'
import AppButton from '@/components/common/AppButton.vue'
import { usePickHistory } from '@/composables/usePickHistory'

const router = useRouter()
const { history, count, clearHistory, formatPickedAt } = usePickHistory()

function handleClear() {
  if (!count.value) return
  if (window.confirm('뽑기 기록을 모두 지울까요?')) {
    clearHistory()
  }
}

function goPick() {
  router.push({ name: 'home' })
}
</script>

<template>
  <section class="history" aria-labelledby="history-title">
    <header class="history__header">
      <div>
        <h1 id="history-title" class="history__title">히스토리</h1>
        <p class="history__desc">최근에 뽑았던 점심이에요.</p>
      </div>
      <button
        type="button"
        class="history__clear"
        :disabled="!count"
        @click="handleClear"
      >
        전체 삭제
      </button>
    </header>

    <div v-if="!count" class="history__empty">
      <span class="history__empty-emoji" aria-hidden="true">🕘</span>
      <p class="history__empty-title">아직 기록이 없어요</p>
      <p class="history__empty-desc">홈에서 점심을 뽑으면 여기에 쌓여요.</p>
      <AppButton variant="primary" size="md" @click="goPick">
        점심 뽑으러 가기
      </AppButton>
    </div>

    <ul v-else class="history__list">
      <li v-for="item in history" :key="item.id" class="history__item">
        <span class="history__emoji" aria-hidden="true">{{ item.emoji }}</span>
        <div class="history__body">
          <p class="history__name">{{ item.name }}</p>
          <p class="history__meta">
            <span v-if="item.category">{{ item.category }}</span>
            <span v-if="item.category && item.price" aria-hidden="true">·</span>
            <span v-if="item.price">{{ item.price }}</span>
          </p>
          <p class="history__time">{{ formatPickedAt(item.pickedAt) }}</p>
        </div>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.history {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

.history__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-md);
}

.history__title {
  font-size: var(--font-size-xl);
  font-weight: 800;
  letter-spacing: -0.03em;
}

.history__desc {
  margin-top: var(--space-xs);
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
}

.history__clear {
  flex-shrink: 0;
  padding: 0.35rem 0.25rem;
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--color-brand);
  background: transparent;
  border: none;
}

.history__clear:disabled {
  color: var(--color-text-muted);
  opacity: 0.55;
  cursor: not-allowed;
}

.history__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-2xl) var(--space-lg);
  text-align: center;
  background: var(--color-surface);
  border: 1px solid #efe8e3;
  border-radius: 20px;
}

.history__empty-emoji {
  font-size: 2.5rem;
  line-height: 1;
}

.history__empty-title {
  font-size: var(--font-size-lg);
  font-weight: 700;
}

.history__empty-desc {
  margin-bottom: var(--space-sm);
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
}

.history__list {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.history__item {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 0.875rem 1rem;
  background: #ffffff;
  border: 1px solid #efe8e3;
  border-radius: 18px;
  box-shadow: 0 1px 3px rgb(0 0 0 / 0.03);
}

.history__emoji {
  flex-shrink: 0;
  display: grid;
  place-items: center;
  width: 3rem;
  height: 3rem;
  font-size: 1.5rem;
  background: var(--color-brand-soft);
  border-radius: 50%;
}

.history__body {
  min-width: 0;
}

.history__name {
  font-weight: 700;
  letter-spacing: -0.02em;
}

.history__meta,
.history__time {
  margin-top: 0.15rem;
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
}
</style>
