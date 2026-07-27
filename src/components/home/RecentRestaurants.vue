<script setup>
import RestaurantCard from '@/components/lunch/RestaurantCard.vue'

defineProps({
  restaurants: {
    type: Array,
    default: () => [],
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <section class="recent" aria-labelledby="recent-title">
    <div class="recent__header">
      <h2 id="recent-title" class="recent__title">최근 등록된 식당</h2>
      <p class="recent__desc">새로 추가된 근처 맛집이에요</p>
    </div>

    <p v-if="isLoading" class="recent__status">불러오는 중...</p>

    <ul v-else class="recent__list">
      <li v-for="(restaurant, index) in restaurants" :key="restaurant.id">
        <RestaurantCard :restaurant="restaurant" :style="{ '--delay': `${0.22 + index * 0.05}s` }" />
      </li>
    </ul>
  </section>
</template>

<style scoped>
.recent {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.recent__header {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
  padding: 0 var(--space-xs);
}

.recent__title {
  font-size: var(--font-size-lg);
  font-weight: 700;
  letter-spacing: -0.025em;
}

.recent__desc {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
}

.recent__list {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  margin: 0;
  padding: 0;
  list-style: none;
}

.recent__status {
  padding: var(--space-xl);
  text-align: center;
  color: var(--color-text-muted);
  font-size: var(--font-size-sm);
}
</style>
