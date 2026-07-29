import { computed, ref, watch } from 'vue'
import { readJson, writeJson } from '@/utils/storage'

const STORAGE_KEY = 'lunchpicker-wishlist'

function readStoredIds() {
  const parsed = readJson(STORAGE_KEY, [])
  return Array.isArray(parsed) ? parsed : []
}

/** 찜한 식당 id 목록 (홈·목록 화면에서 공유) */
const wishlistIds = ref(readStoredIds())

watch(
  wishlistIds,
  (ids) => {
    try {
      writeJson(STORAGE_KEY, ids)
    } catch (err) {
      console.error(err)
    }
  },
  { deep: true },
)

/**
 * 식당 찜(하트) 상태
 * 초보자용: id만 저장하고, 화면에서는 하트 on/off만 보면 됩니다.
 */
export function useWishlist() {
  const count = computed(() => wishlistIds.value.length)

  function isLiked(id) {
    return wishlistIds.value.includes(id)
  }

  function toggleLike(id) {
    if (!id) return

    if (wishlistIds.value.includes(id)) {
      wishlistIds.value = wishlistIds.value.filter((item) => item !== id)
    } else {
      wishlistIds.value = [...wishlistIds.value, id]
    }
  }

  function clearWishlist() {
    wishlistIds.value = []
  }

  function removeFromWishlist(id) {
    wishlistIds.value = wishlistIds.value.filter((item) => item !== id)
  }

  return {
    wishlistIds,
    count,
    isLiked,
    toggleLike,
    clearWishlist,
    removeFromWishlist,
  }
}
