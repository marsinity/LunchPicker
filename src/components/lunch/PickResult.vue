<script setup>
import RestaurantCard from '@/components/lunch/RestaurantCard.vue'

defineProps({
  restaurant: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <div class="result" role="status" aria-live="polite">
    <p class="result__label">오늘의 추천</p>
    <RestaurantCard :restaurant="restaurant" />
  </div>
</template>

<style scoped>
.result {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.result__label {
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--color-brand);
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
</style>
