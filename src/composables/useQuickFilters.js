import { ref } from 'vue'

export const FILTER_OPTIONS = {
  distance: [
    { value: '5', label: '5분' },
    { value: '10', label: '10분' },
    { value: '15', label: '15분+' },
  ],
  price: [
    { value: 'under10', label: '~1만' },
    { value: '10to15', label: '1~1.5만' },
    { value: 'over15', label: '1.5만+' },
  ],
  menu: [
    { value: 'korean', label: '한식' },
    { value: 'japanese', label: '일식' },
    { value: 'chinese', label: '중식' },
    { value: 'western', label: '양식' },
    { value: 'other', label: '기타' },
  ],
  party: [
    { value: '1', label: '1인' },
    { value: '2', label: '2인' },
    { value: '3-4', label: '3~4인' },
    { value: '5+', label: '5인+' },
  ],
}

const MENU_TYPES = new Set(['한식', '일식', '중식', '양식'])

const MENU_FILTER_MAP = {
  korean: '한식',
  japanese: '일식',
  chinese: '중식',
  western: '양식',
}

export function parseWalkMinutes(distance) {
  const match = distance?.match(/(\d+)/)
  return match ? Number(match[1]) : null
}

export function parsePartyRange(partySize) {
  const match = partySize?.match(/(\d+)(?:~(\d+))?/)
  if (!match) return null

  const min = Number(match[1])
  const max = match[2] ? Number(match[2]) : min
  return { min, max }
}

export function getPriceTier(price) {
  if (!price) return null
  if (price.includes('1~1.5')) return '10to15'
  if (price.includes('1.5만') && !price.includes('1~1.5')) return 'over15'
  if (price.includes('1만')) return 'under10'
  return null
}

function matchesDistance(restaurant, filterValue) {
  if (!filterValue) return true

  const minutes = parseWalkMinutes(restaurant.distance)
  if (minutes == null) return true

  if (filterValue === '5') return minutes <= 5
  if (filterValue === '10') return minutes <= 10
  return true
}

function matchesPrice(restaurant, filterValue) {
  if (!filterValue) return true
  return getPriceTier(restaurant.price) === filterValue
}

function matchesMenu(restaurant, filterValue) {
  if (!filterValue) return true

  if (filterValue === 'other') {
    return !MENU_TYPES.has(restaurant.menu)
  }

  return restaurant.menu === MENU_FILTER_MAP[filterValue]
}

function matchesParty(restaurant, filterValue) {
  if (!filterValue) return true

  const range = parsePartyRange(restaurant.partySize)
  if (!range) return true

  if (filterValue === '1') return range.min <= 1 && range.max >= 1
  if (filterValue === '2') return range.min <= 2 && range.max >= 2
  if (filterValue === '3-4') return range.min <= 4 && range.max >= 3
  if (filterValue === '5+') return range.max >= 5

  return true
}

export function filterRestaurants(restaurants, filters) {
  return restaurants.filter(
    (restaurant) =>
      matchesDistance(restaurant, filters.distance) &&
      matchesPrice(restaurant, filters.price) &&
      matchesMenu(restaurant, filters.menu) &&
      matchesParty(restaurant, filters.party),
  )
}

export function hasActiveFilters(filters) {
  return Object.values(filters).some((value) => value != null)
}

export function useQuickFilters() {
  const filters = ref({
    distance: null,
    price: null,
    menu: null,
    party: null,
  })

  function toggleFilter(key, value) {
    filters.value[key] = filters.value[key] === value ? null : value
  }

  function resetFilters() {
    filters.value = {
      distance: null,
      price: null,
      menu: null,
      party: null,
    }
  }

  return {
    filters,
    toggleFilter,
    resetFilters,
    hasActiveFilters,
  }
}
