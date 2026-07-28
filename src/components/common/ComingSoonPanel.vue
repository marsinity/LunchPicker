<script setup>
/**
 * 아직 기능이 없는 화면용 공통 안내 카드
 * 새 기능을 만들 때 이 컴포넌트 대신 실제 UI를 채우면 됩니다.
 */
defineProps({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  emoji: {
    type: String,
    default: '🚧',
  },
  editHint: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <section class="coming-soon" aria-labelledby="coming-soon-title">
    <span class="coming-soon__emoji" aria-hidden="true">{{ emoji }}</span>
    <h1 id="coming-soon-title" class="coming-soon__title">{{ title }}</h1>
    <p class="coming-soon__desc">{{ description }}</p>
    <p v-if="editHint" class="coming-soon__hint">
      수정 위치: <code>{{ editHint }}</code>
    </p>
  </section>
</template>

<style scoped>
.coming-soon {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-2xl) var(--space-lg);
  text-align: center;
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
}

.coming-soon__emoji {
  font-size: 2.5rem;
  line-height: 1;
}

.coming-soon__title {
  font-size: var(--font-size-xl);
  font-weight: 700;
  letter-spacing: -0.025em;
}

.coming-soon__desc {
  max-width: 16rem;
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  line-height: 1.5;
}

.coming-soon__hint {
  margin-top: var(--space-sm);
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
}

.coming-soon__hint code {
  padding: 0.125rem 0.375rem;
  font-size: inherit;
  background: var(--color-surface-muted);
  border-radius: var(--radius-sm);
}
</style>
