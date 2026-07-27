import { ref } from 'vue'
import { restaurantService } from '@/services/restaurantService'

export function useLunchPick() {
  const restaurants = ref([])
  const picked = ref(null)
  const isLoading = ref(false)
  const isPicking = ref(false)
  const error = ref(null)

  async function loadRestaurants() {
    isLoading.value = true
    error.value = null

    try {
      restaurants.value = await restaurantService.getAll()
    } catch (err) {
      error.value = '식당 목록을 불러오지 못했습니다.'
      console.error(err)
    } finally {
      isLoading.value = false
    }
  }

  function pickRandom() {
    if (!restaurants.value.length) return

    isPicking.value = true
    picked.value = null

    // 짧은 딜레이로 추천 느낌 연출
    window.setTimeout(() => {
      const index = Math.floor(Math.random() * restaurants.value.length)
      picked.value = restaurants.value[index]
      isPicking.value = false
    }, 400)
  }

  function resetPick() {
    picked.value = null
  }

  return {
    restaurants,
    picked,
    isLoading,
    isPicking,
    error,
    loadRestaurants,
    pickRandom,
    resetPick,
  }
}
