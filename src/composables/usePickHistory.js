import { computed, ref, watch } from 'vue'

const STORAGE_KEY = 'lunchpicker-pick-history'
const MAX_ITEMS = 30

function readHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

/** 뽑기 기록 (최신순) */
const history = ref(readHistory())

watch(
  history,
  (items) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch (err) {
      console.error(err)
    }
  },
  { deep: true },
)

function formatPickedAt(iso) {
  try {
    return new Intl.DateTimeFormat('ko-KR', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(iso))
  } catch {
    return iso
  }
}

/**
 * 점심 뽑기 히스토리
 * pickRandom 성공 시 addHistory를 호출하면 됩니다.
 */
export function usePickHistory() {
  const count = computed(() => history.value.length)

  function addHistory(restaurant) {
    if (!restaurant?.id) return

    const entry = {
      id: `pick-${Date.now()}`,
      restaurantId: restaurant.id,
      name: restaurant.name,
      emoji: restaurant.emoji || '🍽️',
      category: restaurant.category || '',
      price: restaurant.price || '',
      pickedAt: new Date().toISOString(),
    }

    history.value = [entry, ...history.value].slice(0, MAX_ITEMS)
  }

  function clearHistory() {
    history.value = []
  }

  return {
    history,
    count,
    addHistory,
    clearHistory,
    formatPickedAt,
  }
}
