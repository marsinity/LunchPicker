<script setup>
import { onMounted } from 'vue'
import LunchPicker from '@/components/lunch/LunchPicker.vue'
import { useLunchPick } from '@/composables/useLunchPick'

const { picked, isLoading, isPicking, error, loadRestaurants, pickRandom, resetPick } =
  useLunchPick()

onMounted(() => {
  loadRestaurants()
})
</script>

<template>
  <div class="home">
    <p v-if="isLoading" class="home__status">식당 목록 불러오는 중...</p>
    <p v-else-if="error" class="home__status home__status--error" role="alert">
      {{ error }}
    </p>

    <LunchPicker
      v-else
      :picked="picked"
      :is-picking="isPicking"
      @pick="pickRandom"
      @reset="resetPick"
    />
  </div>
</template>

<style scoped>
.home__status {
  text-align: center;
  color: var(--color-text-muted);
}

.home__status--error {
  color: #b42318;
}
</style>
