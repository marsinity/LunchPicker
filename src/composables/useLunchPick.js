import { ref } from 'vue'
import { filterRestaurants } from '@/composables/useQuickFilters'
import { usePickHistory } from '@/composables/usePickHistory'
import { restaurantService } from '@/services/restaurantService'

const NO_MATCH_MESSAGE = '조건에 맞는 식당이 없어요. 조건을 조금 줄여보세요.'

/** 홈·결과·식당목록이 같은 상태를 쓰도록 모듈에 한 번만 만듭니다. */
const restaurants = ref([])
const picked = ref(null)
const isLoading = ref(false)
const isPicking = ref(false)
const error = ref(null)
const pickMessage = ref(null)

function selectRandomRestaurant(list, excludeId = null) {
  if (!list.length) return null
  if (list.length === 1) return list[0]

  const pool = excludeId ? list.filter((restaurant) => restaurant.id !== excludeId) : list
  const index = Math.floor(Math.random() * pool.length)
  return pool[index]
}

export function useLunchPick() {
  const { addHistory } = usePickHistory()

  async function loadRestaurants(options = {}) {
    const force = Boolean(options.force)
    if (restaurants.value.length && !force) return

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

  /**
   * 랜덤 추천
   * @returns {Promise<object|null>} 뽑힌 식당, 조건 불일치면 null
   */
  function pickRandom(filters = {}) {
    if (!restaurants.value.length || isPicking.value) {
      return Promise.resolve(null)
    }

    const previousId = picked.value?.id ?? null

    isPicking.value = true
    pickMessage.value = null

    return new Promise((resolve) => {
      window.setTimeout(() => {
        const filtered = filterRestaurants(restaurants.value, filters)

        if (!filtered.length) {
          pickMessage.value = NO_MATCH_MESSAGE
          isPicking.value = false
          resolve(null)
          return
        }

        picked.value = selectRandomRestaurant(filtered, previousId)
        if (picked.value) {
          addHistory(picked.value)
        }
        isPicking.value = false
        resolve(picked.value)
      }, 450)
    })
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
