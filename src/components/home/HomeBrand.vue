<script setup>
/**
 * 홈 Hero Card (시안: 좌 텍스트 · 우 이모지 · 하단 뽑기 버튼)
 * 뽑기 동작은 부모(HomeView)의 @pick 으로 연결됩니다.
 */
import {
  getHomeHeroSubtitle,
  getHomeHeroTitle,
  getLocationNearLabel,
} from '@/data/officeLocation'

defineProps({
  isPicking: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['pick'])

const locationLabel = getLocationNearLabel()
const title = getHomeHeroTitle()
const subtitle = getHomeHeroSubtitle()
</script>

<template>
  <section class="hero" aria-labelledby="hero-title">
    <div class="hero__top">
      <div class="hero__text">
        <p class="hero__location">
          <span class="hero__location-icon" aria-hidden="true">📍</span>
          {{ locationLabel }}
        </p>
        <h1 id="hero-title" class="hero__title">{{ title }}</h1>
        <p class="hero__desc">{{ subtitle }}</p>
      </div>

      <span class="hero__emoji" aria-hidden="true">🍜</span>
    </div>

    <button
      type="button"
      class="hero__btn"
      :disabled="isPicking"
      @click="$emit('pick')"
    >
      {{ isPicking ? '뽑는 중...' : '오늘 점심 뽑기 🎲' }}
    </button>
  </section>
</template>

<style scoped>
.hero {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  width: 100%;
  padding: 1.5rem 1.5rem 1.375rem;
  color: var(--color-text-inverse);
  background: linear-gradient(135deg, #ff9a1f, #ff7a00);
  border-radius: 24px;
  box-shadow:
    0 4px 6px rgb(255 122 0 / 0.12),
    0 12px 28px rgb(255 122 0 / 0.28);
  animation: hero-in 0.55s cubic-bezier(0.22, 1, 0.36, 1) both;
}

.hero__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}

.hero__text {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  text-align: left;
}

.hero__location {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  width: fit-content;
  padding: 0.2rem 0.55rem 0.2rem 0.4rem;
  font-size: var(--font-size-xs);
  font-weight: 600;
  letter-spacing: -0.01em;
  color: rgb(255 255 255 / 0.95);
  background: rgb(255 255 255 / 0.16);
  border-radius: var(--radius-full);
}

.hero__location-icon {
  font-size: 0.75rem;
  line-height: 1;
}

.hero__title {
  font-size: clamp(1.625rem, 6vw, 2rem);
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 1.2;
}

.hero__desc {
  max-width: 12.5rem;
  font-size: var(--font-size-sm);
  line-height: 1.45;
  letter-spacing: -0.01em;
  color: rgb(255 255 255 / 0.92);
  white-space: pre-line;
}

.hero__emoji {
  flex-shrink: 0;
  display: grid;
  place-items: center;
  width: 5.5rem;
  height: 5.5rem;
  font-size: 4rem;
  line-height: 1;
  filter: drop-shadow(0 8px 16px rgb(0 0 0 / 0.15));
  animation: emoji-float 3s ease-in-out infinite;
}

.hero__btn {
  width: 100%;
  min-height: 3.125rem;
  padding: 0 1.5rem;
  font-size: 1.0625rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--color-brand);
  background: #ffffff;
  border: none;
  border-radius: 9999px;
  box-shadow: 0 2px 10px rgb(0 0 0 / 0.08);
  transition:
    background-color 0.18s ease,
    color 0.18s ease,
    transform 0.12s ease,
    box-shadow 0.18s ease;
}

.hero__btn:hover:not(:disabled) {
  color: var(--color-brand-dark);
  background: #fff8f0;
  box-shadow: 0 4px 16px rgb(0 0 0 / 0.12);
  transform: translateY(-1px);
}

.hero__btn:active:not(:disabled) {
  transform: scale(0.98);
}

.hero__btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

@keyframes hero-in {
  from {
    opacity: 0;
    transform: translateY(10px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes emoji-float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
  }
}

@media (min-width: 28rem) {
  .hero {
    padding: 1.75rem 1.75rem 1.5rem;
    gap: 1.375rem;
  }

  .hero__desc {
    max-width: 14rem;
    font-size: var(--font-size-base);
  }

  .hero__emoji {
    width: 6.5rem;
    height: 6.5rem;
    font-size: 4.75rem;
  }
}
</style>
