<script setup>
/**
 * 뽑기 결과 축하 UI (시안)
 *
 * 팀 메모 미리보기를 숨기려면 아래 값을 false 로 바꾸세요.
 * → SHOW_LATEST_NOTE = false
 */
import { computed, ref, watch } from 'vue'
import { restaurantNoteService } from '@/services/restaurantNoteService'
import { openNaverMap } from '@/utils/mapLinks'

/** 최신 팀 메모 미리보기 표시 여부 (나중에 false로 끄면 됨) */
const SHOW_LATEST_NOTE = true

const props = defineProps({
  restaurant: {
    type: Object,
    required: true,
  },
  isPicking: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['again', 'decide', 'close'])

/** CSS 색종이 조각 (이모지 아님) */
const confettiPieces = [
  { color: '#ff8a00', left: 6, delay: 0, duration: 2.8, size: 8, drift: -18, spin: 520 },
  { color: '#ffd166', left: 14, delay: 0.2, duration: 3.1, size: 6, drift: 22, spin: -480 },
  { color: '#ef476f', left: 22, delay: 0.45, duration: 2.6, size: 9, drift: -12, spin: 600 },
  { color: '#06d6a0', left: 30, delay: 0.1, duration: 3.4, size: 7, drift: 28, spin: -420 },
  { color: '#118ab2', left: 38, delay: 0.55, duration: 2.9, size: 8, drift: -24, spin: 540 },
  { color: '#ff8a00', left: 46, delay: 0.3, duration: 3.2, size: 6, drift: 16, spin: -560 },
  { color: '#f4a261', left: 54, delay: 0.05, duration: 2.7, size: 10, drift: -20, spin: 460 },
  { color: '#e76f51', left: 62, delay: 0.4, duration: 3.0, size: 7, drift: 14, spin: -500 },
  { color: '#ffd166', left: 70, delay: 0.15, duration: 3.3, size: 8, drift: -28, spin: 580 },
  { color: '#06d6a0', left: 78, delay: 0.5, duration: 2.8, size: 6, drift: 20, spin: -440 },
  { color: '#118ab2', left: 86, delay: 0.25, duration: 3.1, size: 9, drift: -10, spin: 620 },
  { color: '#ef476f', left: 92, delay: 0.35, duration: 2.9, size: 7, drift: 26, spin: -520 },
  { color: '#ff8a00', left: 10, delay: 0.7, duration: 3.5, size: 5, drift: 12, spin: 400 },
  { color: '#ffd166', left: 50, delay: 0.65, duration: 2.5, size: 8, drift: -16, spin: -640 },
  { color: '#06d6a0', left: 66, delay: 0.8, duration: 3.2, size: 6, drift: 18, spin: 480 },
  { color: '#e76f51', left: 82, delay: 0.6, duration: 2.7, size: 9, drift: -22, spin: -560 },
]

const latestNote = ref(null)

const pills = computed(() => {
  const items = []
  if (props.restaurant.category) {
    items.push({ key: 'category', label: props.restaurant.category, tone: 'warm' })
  }
  if (props.restaurant.distance) {
    items.push({ key: 'distance', label: props.restaurant.distance, tone: 'cool' })
  }
  if (props.restaurant.price) {
    items.push({ key: 'price', label: props.restaurant.price, tone: 'sand' })
  }
  return items
})

const highlightTags = computed(() => (props.restaurant.tags || []).slice(0, 3))

function handleOpenMap() {
  openNaverMap(props.restaurant)
}

async function loadLatestNote() {
  latestNote.value = null
  if (!SHOW_LATEST_NOTE || props.isPicking || !props.restaurant?.id) return

  const notes = await restaurantNoteService.getByRestaurantId(props.restaurant.id)
  latestNote.value = notes[0] ?? null
}

watch(
  () => [props.restaurant?.id, props.isPicking],
  () => {
    loadLatestNote()
  },
  { immediate: true },
)
</script>

<template>
  <div class="result" role="status" aria-live="polite">
    <div class="result__confetti" aria-hidden="true">
      <span
        v-for="(piece, index) in confettiPieces"
        :key="index"
        class="result__piece"
        :style="{
          '--left': `${piece.left}%`,
          '--delay': `${piece.delay}s`,
          '--duration': `${piece.duration}s`,
          '--size': `${piece.size}px`,
          '--drift': `${piece.drift}px`,
          '--spin': `${piece.spin}deg`,
          '--color': piece.color,
        }"
      />
    </div>

    <header class="result__top">
      <button type="button" class="result__back" aria-label="닫기" @click="$emit('close')">
        ←
      </button>
      <h1 class="result__heading">오늘의 점심 추천</h1>
      <span class="result__top-spacer" aria-hidden="true" />
    </header>

    <p v-if="!isPicking" class="result__badge">짜잔!</p>
    <p class="result__label">
      {{ isPicking ? '뽑는 중...' : '오늘의 점심은' }}
    </p>

    <h2 v-if="!isPicking" class="result__name">{{ restaurant.name }}</h2>
    <button
      v-if="!isPicking"
      type="button"
      class="result__map-link"
      @click="handleOpenMap"
    >
      ↗ 네이버 지도
    </button>

    <div class="result__hero" :class="{ 'result__hero--picking': isPicking }">
      <span class="result__emoji" aria-hidden="true">
        {{ isPicking ? '🎲' : restaurant.emoji || '🍽️' }}
      </span>
    </div>

    <template v-if="!isPicking">
      <ul v-if="pills.length" class="result__pills">
        <li
          v-for="pill in pills"
          :key="pill.key"
          class="result__pill"
          :class="`result__pill--${pill.tone}`"
        >
          {{ pill.label }}
        </li>
      </ul>

      <ul v-if="highlightTags.length" class="result__tags">
        <li v-for="tag in highlightTags" :key="tag" class="result__tag">
          {{ tag }}
        </li>
      </ul>

      <!-- 팀 메모 미리보기: SHOW_LATEST_NOTE 로 on/off -->
      <aside v-if="SHOW_LATEST_NOTE && latestNote" class="result__note">
        <p class="result__note-text">
          <span aria-hidden="true">👍</span>
          “{{ latestNote.content }}”
        </p>
        <p class="result__note-author">~ {{ latestNote.authorName }}</p>
      </aside>
    </template>

    <div class="result__actions">
      <button
        type="button"
        class="result__btn result__btn--primary"
        :disabled="isPicking"
        @click="$emit('decide')"
      >
        여기로 결정!
      </button>
      <button
        type="button"
        class="result__btn result__btn--secondary"
        :disabled="isPicking"
        @click="$emit('again')"
      >
        다시 뽑기 🔄
      </button>
    </div>
  </div>
</template>

<style scoped>
.result {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  min-height: calc(100dvh - 1rem);
  padding: var(--space-lg) var(--space-md) var(--space-xl);
  text-align: center;
  overflow: hidden;
}

.result__confetti {
  pointer-events: none;
  position: absolute;
  inset: 0;
  overflow: hidden;
  z-index: 0;
}

.result__piece {
  position: absolute;
  top: -12px;
  left: var(--left);
  width: var(--size);
  height: calc(var(--size) * 1.35);
  background: var(--color);
  border-radius: 2px;
  opacity: 0.9;
  animation: confetti-fall var(--duration) linear infinite;
  animation-delay: var(--delay);
  box-shadow: 0 0 0 1px rgb(255 255 255 / 0.15);
}

@keyframes confetti-fall {
  0% {
    transform: translate3d(0, -8vh, 0) rotate(0deg);
    opacity: 0;
  }
  8% {
    opacity: 0.95;
  }
  100% {
    transform: translate3d(var(--drift), 110vh, 0) rotate(var(--spin));
    opacity: 0.35;
  }
}

.result__top {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: 2.5rem 1fr 2.5rem;
  align-items: center;
  width: 100%;
  max-width: 24rem;
  margin-bottom: 0.5rem;
}

.result__back {
  width: 2.5rem;
  height: 2.5rem;
  font-size: 1.125rem;
  color: var(--color-text);
  background: rgb(255 255 255 / 0.75);
  border: none;
  border-radius: var(--radius-full);
}

.result__top-spacer {
  width: 2.5rem;
  height: 2.5rem;
}

.result__heading {
  font-size: var(--font-size-base);
  font-weight: 700;
  letter-spacing: -0.02em;
}

.result__badge {
  position: relative;
  z-index: 1;
  display: inline-flex;
  padding: 0.3rem 0.75rem;
  font-size: var(--font-size-sm);
  font-weight: 700;
  color: #fff;
  background: var(--color-brand);
  border-radius: var(--radius-full);
}

.result__label {
  position: relative;
  z-index: 1;
  font-size: var(--font-size-base);
  font-weight: 600;
  color: var(--color-text-secondary);
  letter-spacing: -0.01em;
}

.result__name {
  position: relative;
  z-index: 1;
  max-width: 16rem;
  font-size: clamp(1.75rem, 7vw, 2.25rem);
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 1.2;
  color: var(--color-text);
}

.result__map-link {
  position: relative;
  z-index: 1;
  margin-top: -0.25rem;
  padding: 0.2rem 0.35rem;
  font: inherit;
  font-size: 0.875rem;
  font-weight: 600;
  color: #ff7a00;
  background: transparent;
  border: none;
  text-decoration: underline;
  text-underline-offset: 0.18em;
}

.result__hero {
  position: relative;
  z-index: 1;
  display: grid;
  place-items: center;
  width: 9rem;
  height: 9rem;
  margin: 0.25rem 0;
  background: rgb(255 255 255 / 0.6);
  border-radius: 50%;
  box-shadow: 0 12px 32px rgb(255 138 0 / 0.18);
  animation: pop 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
}

.result__hero--picking {
  animation: pulse 0.7s ease-in-out infinite;
}

.result__emoji {
  font-size: 4.5rem;
  line-height: 1;
  filter: drop-shadow(0 8px 16px rgb(0 0 0 / 0.1));
}

.result__pills {
  position: relative;
  z-index: 1;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.4rem;
  margin: 0.25rem 0 0;
  padding: 0;
  list-style: none;
}

.result__pill {
  padding: 0.4rem 0.85rem;
  font-size: var(--font-size-sm);
  font-weight: 600;
  letter-spacing: -0.01em;
  border-radius: 9999px;
}

.result__pill--warm {
  color: #9a5b16;
  background: #f3e2cb;
}

.result__pill--cool {
  color: #5f6670;
  background: #e8eaed;
}

.result__pill--sand {
  color: #8a6a3d;
  background: #efe4d2;
}

.result__tags {
  position: relative;
  z-index: 1;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.35rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.result__tag {
  padding: 0.25rem 0.55rem;
  font-size: var(--font-size-xs);
  font-weight: 600;
  color: var(--color-text-secondary);
  background: rgb(255 255 255 / 0.7);
  border-radius: 8px;
}

.result__note {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 20rem;
  margin-top: 0.35rem;
  padding: 0.9rem 1rem;
  text-align: left;
  background: rgb(255 255 255 / 0.72);
  border: 1px solid rgb(255 255 255 / 0.9);
  border-radius: 16px;
  box-shadow: 0 4px 16px rgb(255 138 0 / 0.08);
}

.result__note-text {
  font-size: var(--font-size-sm);
  line-height: 1.45;
  color: var(--color-text);
  word-break: break-word;
}

.result__note-author {
  margin-top: 0.45rem;
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
  text-align: right;
}

.result__actions {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  width: 100%;
  max-width: 20rem;
  margin-top: var(--space-md);
}

.result__btn {
  width: 100%;
  min-height: 3.125rem;
  font-size: 1.0625rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  border: none;
  border-radius: var(--radius-full);
  transition: transform 0.12s ease, opacity 0.15s ease, background-color 0.18s ease;
}

.result__btn:active:not(:disabled) {
  transform: scale(0.98);
}

.result__btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.result__btn--primary {
  color: #fff;
  background: var(--color-brand);
  box-shadow: 0 8px 20px rgb(255 138 0 / 0.28);
}

.result__btn--secondary {
  color: var(--color-text);
  background: rgb(255 255 255 / 0.85);
  border: 1px solid #efe8e3;
}

@keyframes pop {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}
</style>
