<script setup>
defineProps({
  restaurant: {
    type: Object,
    required: true,
  },
  compact: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <article class="card">
    <div class="card__media" aria-hidden="true">
      <span class="card__emoji">{{ restaurant.emoji ?? '🍽️' }}</span>
    </div>

    <div class="card__body">
      <div class="card__top">
        <div class="card__meta">
          <h3 class="card__name">{{ restaurant.name }}</h3>
          <p class="card__category">{{ restaurant.category }}</p>
        </div>
        <span class="card__distance">{{ restaurant.distance }}</span>
      </div>

      <dl class="card__facts">
        <div v-if="restaurant.price" class="card__fact">
          <dt>가격</dt>
          <dd>{{ restaurant.price }}</dd>
        </div>
        <div v-if="!compact && restaurant.menu" class="card__fact">
          <dt>메뉴</dt>
          <dd>{{ restaurant.menu }}</dd>
        </div>
        <div v-if="!compact && restaurant.partySize" class="card__fact">
          <dt>인원</dt>
          <dd>{{ restaurant.partySize }}</dd>
        </div>
      </dl>

      <ul v-if="!compact && restaurant.tags?.length" class="card__tags">
        <li v-for="tag in restaurant.tags" :key="tag" class="card__tag">
          {{ tag }}
        </li>
      </ul>
    </div>
  </article>
</template>

<style scoped>
.card {
  overflow: hidden;
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  animation: card-in 0.5s cubic-bezier(0.22, 1, 0.36, 1) var(--delay, 0.22s) both;
  transition: transform 0.18s ease, box-shadow 0.18s ease;
}

.card:active {
  transform: scale(0.99);
}

.card__media {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 5.5rem;
  background: linear-gradient(180deg, var(--color-brand-soft) 0%, var(--color-surface-muted) 100%);
}

.card__emoji {
  font-size: 2.75rem;
  line-height: 1;
  user-select: none;
}

.card__body {
  padding: var(--space-md) var(--space-lg);
}

.card__top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-md);
}

.card__meta {
  min-width: 0;
}

.card__name {
  font-size: var(--font-size-base);
  font-weight: 600;
  letter-spacing: -0.02em;
  line-height: 1.3;
}

.card__category {
  margin-top: 0.125rem;
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
}

.card__distance {
  flex-shrink: 0;
  margin-top: 0.2rem;
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--color-text-secondary);
}

.card__facts {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem 0.75rem;
  margin: var(--space-md) 0 0;
}

.card__fact {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: var(--font-size-xs);
}

.card__fact dt {
  color: var(--color-text-muted);
}

.card__fact dd {
  margin: 0;
  font-weight: 500;
  color: var(--color-text-secondary);
}

.card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
  margin: var(--space-sm) 0 0;
  padding: 0;
  list-style: none;
}

.card__tag {
  padding: 0.2rem 0.55rem;
  font-size: var(--font-size-xs);
  font-weight: 500;
  color: var(--color-text-secondary);
  background: var(--color-surface-muted);
  border-radius: var(--radius-full);
}

@keyframes card-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
