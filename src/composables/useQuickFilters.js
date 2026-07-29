import { computed, ref } from 'vue'
import {
  FILTER_GROUPS,
  FILTER_OPTIONS,
  getPriceTier,
  getRestaurantMenuType,
  MENU_FILTER_MAP,
  parsePartyRange,
  parseWalkMinutes,
  PRIMARY_MENU_TYPES,
} from '@/data/restaurantOptions'

export { FILTER_GROUPS, FILTER_OPTIONS }

/** 홈·조건설정 화면이 같은 값을 보도록 모듈에 한 번만 만듭니다. */
const filters = ref({
  distance: null,
  price: null,
  menu: null,
  party: null,
})

export { parseWalkMinutes, parsePartyRange, getPriceTier }

function matchesDistance(restaurant, filterValue) {
  if (!filterValue) return true

  const minutes = parseWalkMinutes(restaurant.distance)
  if (minutes == null) return true

  if (filterValue === '5') return minutes <= 5
  if (filterValue === '10') return minutes <= 10
  if (filterValue === '15') return minutes >= 15
  return true
}

function matchesPrice(restaurant, filterValue) {
  if (!filterValue) return true
  return getPriceTier(restaurant.price) === filterValue
}

function matchesMenu(restaurant, filterValue) {
  if (!filterValue) return true

  const menuType = getRestaurantMenuType(restaurant)

  if (filterValue === 'other') {
    return !PRIMARY_MENU_TYPES.has(menuType)
  }

  return menuType === MENU_FILTER_MAP[filterValue]
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

export function filterRestaurants(restaurants, filterState) {
  return restaurants.filter(
    (restaurant) =>
      matchesDistance(restaurant, filterState.distance) &&
      matchesPrice(restaurant, filterState.price) &&
      matchesMenu(restaurant, filterState.menu) &&
      matchesParty(restaurant, filterState.party),
  )
}

export function countFilteredRestaurants(restaurants, filterState) {
  return filterRestaurants(restaurants, filterState).length
}

export function hasActiveFilters(filterState) {
  return Object.values(filterState).some((value) => value != null)
}

export function getFilterLabel(key, value) {
  if (value == null) return '전체'
  const option = FILTER_OPTIONS[key]?.find((item) => item.value === value)
  return option?.label ?? '전체'
}

export function useQuickFilters() {
  const isActive = computed(() => hasActiveFilters(filters.value))

  function toggleFilter(key, value) {
    filters.value[key] = filters.value[key] === value ? null : value
  }

  function setFilter(key, value) {
    filters.value[key] = value
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
    isActive,
    toggleFilter,
    setFilter,
    resetFilters,
    hasActiveFilters,
  }
}
