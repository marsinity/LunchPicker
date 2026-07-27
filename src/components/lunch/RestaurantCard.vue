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
    <div class="card__header">
      <h3 class="card__name">{{ restaurant.name }}</h3>
      <span class="card__category">{{ restaurant.category }}</span>
    </div>
    <p class="card__distance">{{ restaurant.distance }}</p>
    <ul v-if="restaurant.tags?.length" class="card__tags">
      <li v-for="tag in restaurant.tags" :key="tag" class="card__tag">
        {{ tag }}
      </li>
    </ul>
  </article>
</template>

<style scoped>
.card {
  padding: var(--space-md);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
}

.card__header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--space-sm);
  margin-bottom: var(--space-xs);
}

.card__name {
  font-size: var(--font-size-lg);
  font-weight: 700;
}

.card__category {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
}

.card__distance {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
}

.card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-xs);
  margin: var(--space-sm) 0 0;
  padding: 0;
  list-style: none;
}

.card__tag {
  padding: 0.125rem var(--space-sm);
  font-size: var(--font-size-xs);
  color: var(--color-brand);
  background: var(--color-brand-soft);
  border-radius: var(--radius-sm);
}
</style>
