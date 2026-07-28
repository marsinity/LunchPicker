<script setup>
/**
 * 뽑기 결과 풀스크린 페이지
 * 홈에서 점심을 뽑으면 이 화면으로 이동합니다.
 */
import { onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import PickResult from '@/components/lunch/PickResult.vue'
import { useLunchPick } from '@/composables/useLunchPick'
import { useQuickFilters } from '@/composables/useQuickFilters'

const router = useRouter()
const { picked, isPicking, loadRestaurants, pickRandom, resetPick } = useLunchPick()
const { filters } = useQuickFilters()

async function handleAgain() {
  await loadRestaurants()
  await pickRandom(filters.value)
}

function goHome() {
  router.push({ name: 'home' })
}

function handleDecide() {
  if (!picked.value) return
  router.push({ name: 'restaurant-detail', params: { id: picked.value.id } })
}

function handleClose() {
  resetPick()
  goHome()
}

onMounted(async () => {
  await loadRestaurants()
  if (!picked.value) {
    router.replace({ name: 'home' })
  }
})

watch(picked, (value) => {
  if (!value && !isPicking.value) {
    router.replace({ name: 'home' })
  }
})
</script>

<template>
  <div class="result-page">
    <PickResult
      v-if="picked"
      :restaurant="picked"
      :is-picking="isPicking"
      @again="handleAgain"
      @decide="handleDecide"
      @close="handleClose"
    />
  </div>
</template>

<style scoped>
.result-page {
  min-height: 100dvh;
  background:
    radial-gradient(ellipse 90% 60% at 50% 0%, rgb(255 154 31 / 0.35), transparent 60%),
    linear-gradient(180deg, #ffe8cc 0%, #fff4e6 42%, #fffaf5 100%);
}
</style>
