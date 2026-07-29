import { mockRestaurants } from '@/data/mockRestaurants'
import { readJson, writeJson } from '@/utils/storage'

const CUSTOM_KEY = 'lunchpicker-custom-restaurants'

function readCustomRestaurants() {
  const parsed = readJson(CUSTOM_KEY, [])
  return Array.isArray(parsed) ? parsed : []
}

function writeCustomRestaurants(list) {
  writeJson(CUSTOM_KEY, list)
}

function getMergedRestaurants() {
  return [...mockRestaurants, ...readCustomRestaurants()]
}

/**
 * 식당 데이터 서비스
 * - mock + 사용자가 등록한 식당(localStorage)
 * - 추후 Supabase로 교체 예정
 */
export const restaurantService = {
  async getAll() {
    return getMergedRestaurants()
  },

  async getById(id) {
    return getMergedRestaurants().find((restaurant) => restaurant.id === id) ?? null
  },

  async getRecent(limit = 4) {
    return getMergedRestaurants()
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, limit)
  },

  async create(payload) {
    const custom = readCustomRestaurants()
    const restaurant = {
      id: `custom-${Date.now()}`,
      name: payload.name.trim(),
      emoji: payload.emoji || '🍽️',
      category: payload.category.trim() || '기타',
      address: payload.address?.trim() || '',
      distance: payload.distance.trim(),
      price: payload.price.trim(),
      menu: payload.menu.trim() || payload.category.trim() || '기타',
      menus: Array.isArray(payload.menus)
        ? payload.menus.filter((item) => item?.trim()).map((item) => item.trim())
        : [],
      partySize: payload.partySize.trim(),
      tags: Array.isArray(payload.tags)
        ? payload.tags.filter((item) => item?.trim()).map((item) => item.trim()).slice(0, 3)
        : [],
      createdAt: new Date().toISOString(),
      isCustom: true,
    }

    custom.push(restaurant)
    writeCustomRestaurants(custom)
    return restaurant
  },

  /** 직접 등록한 식당만 수정 가능 */
  async updateCustom(id, payload) {
    const custom = readCustomRestaurants()
    const index = custom.findIndex((restaurant) => restaurant.id === id)
    if (index < 0) return null

    const previous = custom[index]
    const updated = {
      ...previous,
      name: payload.name.trim(),
      emoji: payload.emoji || previous.emoji || '🍽️',
      category: payload.category.trim() || previous.category || '기타',
      address: payload.address != null ? payload.address.trim() : previous.address || '',
      distance: payload.distance.trim(),
      price: payload.price.trim(),
      menu: payload.menu.trim() || payload.category.trim() || previous.menu || '기타',
      menus: Array.isArray(payload.menus)
        ? payload.menus.filter((item) => item?.trim()).map((item) => item.trim())
        : previous.menus || [],
      partySize: payload.partySize.trim(),
      tags: Array.isArray(payload.tags)
        ? payload.tags.filter((item) => item?.trim()).map((item) => item.trim()).slice(0, 3)
        : previous.tags || [],
      updatedAt: new Date().toISOString(),
      isCustom: true,
    }

    custom[index] = updated
    writeCustomRestaurants(custom)
    return updated
  },

  async clearCustom() {
    writeCustomRestaurants([])
  },

  async getCustomIds() {
    return readCustomRestaurants().map((restaurant) => restaurant.id)
  },

  /** 직접 등록한 식당만 삭제 가능 (mock 기본 데이터는 삭제 불가) */
  async removeCustom(id) {
    const custom = readCustomRestaurants()
    const next = custom.filter((restaurant) => restaurant.id !== id)

    if (next.length === custom.length) {
      return false
    }

    writeCustomRestaurants(next)
    return true
  },

  async getCustomCount() {
    return readCustomRestaurants().length
  },
}
