import { ref } from 'vue'
import { filterRestaurants } from '@/composables/useQuickFilters'
import { restaurantService } from '@/services/restaurantService'

const NO_MATCH_MESSAGE = '조건에 맞는 식당이 없어요. 조건을 조금 줄여보세요.'

function selectRandomRestaurant(restaurants, excludeId = null) {
  if (!restaurants.length) return null
  if (restaurants.length === 1) return restaurants[0]

  const pool = excludeId
    ? restaurants.filter((restaurant) => restaurant.id !== excludeId)
    : restaurants

  const index = Math.floor(Math.random() * pool.length)
  return pool[index]
}

export function useLunchPick() {
  const restaurants = ref([])
  const picked = ref(null)
  const isLoading = ref(false)
  const isPicking = ref(false)
  const error = ref(null)
  const pickMessage = ref(null)

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

  function pickRandom(filters = {}) {
    if (!restaurants.value.length || isPicking.value) return

    const previousId = picked.value?.id ?? null

    isPicking.value = true
    picked.value = null
    pickMessage.value = null

    // 짧은 딜레이로 추천 느낌 연출
    window.setTimeout(() => {
      const filtered = filterRestaurants(restaurants.value, filters)

      if (!filtered.length) {
        pickMessage.value = NO_MATCH_MESSAGE
        isPicking.value = false
        return
      }

      picked.value = selectRandomRestaurant(filtered, previousId)
      isPicking.value = false
    }, 400)
  }

  function resetPick() {
    picked.value = null
    pickMessage.value = null
  }

  return {
    restaurants,
    picked,
    isLoading,
    isPicking,
    error,
    pickMessage,
    loadRestaurants,
    pickRandom,
    resetPick,
  }
}
