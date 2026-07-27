<script setup>
import { onMounted } from 'vue'
import RestaurantCard from '@/components/lunch/RestaurantCard.vue'
import { useLunchPick } from '@/composables/useLunchPick'

const { restaurants, isLoading, error, loadRestaurants } = useLunchPick()

onMounted(() => {
  loadRestaurants()
})
</script>

<template>
  <section class="restaurants" aria-labelledby="restaurants-title">
    <header class="restaurants__header">
      <h1 id="restaurants-title" class="restaurants__title">근처 식당</h1>
      <p class="restaurants__desc">추천에 사용되는 식당 목록이에요.</p>
    </header>

    <p v-if="isLoading" class="restaurants__status">불러오는 중...</p>
    <p v-else-if="error" class="restaurants__status restaurants__status--error" role="alert">
      {{ error }}
    </p>

    <ul v-else class="restaurants__list">
      <li v-for="restaurant in restaurants" :key="restaurant.id">
        <RestaurantCard :restaurant="restaurant" />
      </li>
    </ul>
  </section>
</template>

<style scoped>
.restaurants__header {
  margin-bottom: var(--space-lg);
}

.restaurants__title {
  font-size: var(--font-size-xl);
  font-weight: 800;
}

.restaurants__desc {
  margin-top: var(--space-xs);
  color: var(--color-text-muted);
}

.restaurants__list {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  margin: 0;
  padding: 0;
  list-style: none;
}

.restaurants__status {
  text-align: center;
  color: var(--color-text-muted);
}

.restaurants__status--error {
  color: #b42318;
}
</style>
