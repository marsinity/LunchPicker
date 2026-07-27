import { mockRestaurants } from '@/data/mockRestaurants'

/**
 * 식당 데이터 서비스
 * 추후 Supabase 클라이언트로 교체할 예정입니다.
 */
export const restaurantService = {
  async getAll() {
    return [...mockRestaurants]
  },

  async getById(id) {
    return mockRestaurants.find((restaurant) => restaurant.id === id) ?? null
  },
}
