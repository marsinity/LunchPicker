<script setup>
import AppButton from '@/components/common/AppButton.vue'
import PickResult from '@/components/lunch/PickResult.vue'

defineProps({
  isPicking: {
    type: Boolean,
    default: false,
  },
  picked: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['pick', 'reset'])
</script>

<template>
  <section class="picker" aria-labelledby="picker-title">
    <div class="picker__intro">
      <h1 id="picker-title" class="picker__title">오늘 점심 뭐 먹지?</h1>
      <p class="picker__desc">버튼을 누르면 근처 식당 중 하나를 추천해 드려요.</p>
    </div>

    <PickResult
      v-if="picked"
      :restaurant="picked"
      class="picker__result"
    />

    <div v-else class="picker__placeholder" :class="{ 'picker__placeholder--active': isPicking }">
      <span class="picker__icon" aria-hidden="true" />
      <p>{{ isPicking ? '추천 중...' : '아직 추천 전이에요' }}</p>
    </div>

    <div class="picker__actions">
      <AppButton
        v-if="!picked"
        variant="primary"
        size="lg"
        block
        :disabled="isPicking"
        @click="emit('pick')"
      >
        {{ isPicking ? '추천 중...' : '점심 추천받기' }}
      </AppButton>

      <template v-else>
        <AppButton variant="primary" size="lg" block @click="emit('pick')">
          다시 추천받기
        </AppButton>
        <AppButton variant="ghost" size="md" block @click="emit('reset')">
          초기화
        </AppButton>
      </template>
    </div>
  </section>
</template>

<style scoped>
.picker {
  display: flex;
  flex-direction: column;
  gap: var(--space-xl);
}

.picker__intro {
  text-align: center;
}

.picker__title {
  font-size: var(--font-size-2xl);
  font-weight: 800;
  line-height: 1.2;
  letter-spacing: -0.02em;
}

.picker__desc {
  margin-top: var(--space-sm);
  color: var(--color-text-muted);
}

.picker__placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
  min-height: 10rem;
  padding: var(--space-xl);
  text-align: center;
  color: var(--color-text-muted);
  background: var(--color-surface);
  border: 2px dashed var(--color-border);
  border-radius: var(--radius-lg);
  transition: border-color 0.2s ease, background-color 0.2s ease;
}

.picker__placeholder--active {
  border-color: var(--color-brand);
  background: var(--color-brand-soft);
}

.picker__icon {
  width: 3rem;
  height: 3rem;
  border: 3px solid var(--color-border);
  border-radius: var(--radius-sm);
  background:
    linear-gradient(var(--color-border) 0 0) center/100% 2px no-repeat,
    linear-gradient(var(--color-border) 0 0) center/2px 100% no-repeat;
}

.picker__placeholder--active .picker__icon {
  border-color: var(--color-brand);
  animation: pulse 0.6s ease-in-out infinite;
}

.picker__actions {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.8;
  }
}

@media (min-width: 48rem) {
  .picker__title {
    font-size: 2.5rem;
  }
}
</style>
