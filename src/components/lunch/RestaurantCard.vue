<script setup>
defineProps({
  restaurant: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <article class="card">
    <div class="card__top">
      <div class="card__identity">
        <span class="card__badge" aria-hidden="true">{{ restaurant.category?.charAt(0) }}</span>
        <div class="card__meta">
          <h3 class="card__name">{{ restaurant.name }}</h3>
          <p class="card__category">{{ restaurant.category }}</p>
        </div>
      </div>
      <span class="card__distance">{{ restaurant.distance }}</span>
    </div>

    <dl class="card__facts">
      <div v-if="restaurant.price" class="card__fact">
        <dt>가격</dt>
        <dd>{{ restaurant.price }}</dd>
      </div>
      <div v-if="restaurant.menu" class="card__fact">
        <dt>메뉴</dt>
        <dd>{{ restaurant.menu }}</dd>
      </div>
      <div v-if="restaurant.partySize" class="card__fact">
        <dt>인원</dt>
        <dd>{{ restaurant.partySize }}</dd>
      </div>
    </dl>

    <ul v-if="restaurant.tags?.length" class="card__tags">
      <li v-for="tag in restaurant.tags" :key="tag" class="card__tag">
        {{ tag }}
      </li>
    </ul>
  </article>
</template>

<style scoped>
.card {
  padding: var(--space-md) var(--space-lg);
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  animation: card-in 0.5s cubic-bezier(0.22, 1, 0.36, 1) var(--delay, 0.22s) both;
  transition: transform 0.18s ease, box-shadow 0.18s ease;
}

.card:active {
  transform: scale(0.99);
}

.card__top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-md);
}

.card__identity {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-width: 0;
}

.card__badge {
  flex-shrink: 0;
  display: grid;
  place-items: center;
  width: 2.5rem;
  height: 2.5rem;
  font-size: var(--font-size-sm);
  font-weight: 700;
  color: var(--color-brand);
  background: var(--color-brand-soft);
  border-radius: var(--radius-md);
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
