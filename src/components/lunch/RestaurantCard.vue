<script setup>
/**
 * 식당 카드 (시안: 원형 이모지 · 한 줄 메타 · 태그 · 하트)
 * 카드 클릭 → 상세, 하트 클릭 → 찜만 토글
 */
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useWishlist } from '@/composables/useWishlist'

const props = defineProps({
  restaurant: {
    type: Object,
    required: true,
  },
  hideLike: {
    type: Boolean,
    default: false,
  },
})

const router = useRouter()
const { isLiked, toggleLike } = useWishlist()

const liked = computed(() => isLiked(props.restaurant.id))

const metaLine = computed(() => {
  return [props.restaurant.category, props.restaurant.distance, props.restaurant.price]
    .filter(Boolean)
    .join(' · ')
})

function openDetail() {
  router.push({ name: 'restaurant-detail', params: { id: props.restaurant.id } })
}

function onLikeClick(event) {
  event.stopPropagation()
  toggleLike(props.restaurant.id)
}
</script>

<template>
  <article
    class="card"
    :class="{ 'card--liked': liked }"
    role="link"
    tabindex="0"
    @click="openDetail"
    @keydown.enter.prevent="openDetail"
  >
    <div class="card__emoji" aria-hidden="true">
      {{ restaurant.emoji ?? '🍽️' }}
    </div>

    <div class="card__body">
      <h3 class="card__name">{{ restaurant.name }}</h3>
      <p class="card__meta">{{ metaLine }}</p>
      <ul v-if="restaurant.tags?.length" class="card__tags">
        <li v-for="tag in restaurant.tags.slice(0, 2)" :key="tag" class="card__tag">
          {{ tag }}
        </li>
      </ul>
    </div>

    <button
      v-if="!hideLike"
      type="button"
      class="card__like"
      :class="{ 'card__like--on': liked }"
      :aria-label="liked ? '찜 해제' : '찜하기'"
      :aria-pressed="liked"
      @click="onLikeClick"
    >
      {{ liked ? '♥' : '♡' }}
    </button>
  </article>
</template>

<style scoped>
.card {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  width: 100%;
  padding: 1rem;
  background: #ffffff;
  border: 1px solid #efe8e3;
  border-radius: 18px;
  box-shadow: 0 1px 3px rgb(0 0 0 / 0.03);
  animation: card-in 0.45s cubic-bezier(0.22, 1, 0.36, 1) var(--delay, 0s) both;
  transition:
    border-color 0.18s ease,
    box-shadow 0.18s ease,
    transform 0.12s ease;
  cursor: pointer;
}

.card:active {
  transform: scale(0.99);
}

.card--liked {
  border-color: rgb(255 138 0 / 0.28);
}

.card__emoji {
  flex-shrink: 0;
  display: grid;
  place-items: center;
  width: 3.5rem;
  height: 3.5rem;
  font-size: 1.85rem;
  line-height: 1;
  background: var(--color-brand-soft);
  border-radius: 50%;
}

.card__body {
  flex: 1;
  min-width: 0;
  text-align: left;
}

.card__name {
  font-size: var(--font-size-base);
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.3;
  color: var(--color-text);
}

.card__meta {
  margin-top: 0.25rem;
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  letter-spacing: -0.01em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  margin: 0.45rem 0 0;
  padding: 0;
  list-style: none;
}

.card__tag {
  padding: 0.2rem 0.5rem;
  font-size: 0.6875rem;
  font-weight: 600;
  color: #8a847e;
  background: #f3f1ef;
  border-radius: 8px;
}

.card__like {
  flex-shrink: 0;
  align-self: flex-start;
  display: grid;
  place-items: center;
  width: 2.25rem;
  height: 2.25rem;
  margin-top: 0.1rem;
  font-size: 1.2rem;
  line-height: 1;
  color: #c4beb8;
  background: transparent;
  border: none;
  border-radius: var(--radius-full);
  cursor: pointer;
}

.card__like--on {
  color: var(--color-brand);
}

@keyframes card-in {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
