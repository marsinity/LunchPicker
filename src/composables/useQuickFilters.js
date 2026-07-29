import { computed, ref } from 'vue'
import { TAG_OPTIONS } from '@/data/restaurantTags'

/**
 * 빠른 조건 / 조건 설정 화면에서 같이 쓰는 필터 옵션입니다.
 * value 값을 바꾸면 뽑기 필터 로직도 같이 확인해야 합니다.
 */
export const FILTER_OPTIONS = {
  distance: [
    { value: '5', label: '5분 이내' },
    { value: '10', label: '10분 이내' },
    { value: '15', label: '15분+' },
  ],
  price: [
    { value: 'under10', label: '1만원 이하' },
    { value: '10to15', label: '1~1.5만원' },
    { value: 'over15', label: '1.5만원+' },
  ],
  menu: [
    { value: 'korean', label: '한식' },
    { value: 'japanese', label: '일식' },
    { value: 'chinese', label: '중식' },
    { value: 'western', label: '양식' },
    { value: 'asian', label: '아시아' },
    { value: 'other', label: '기타' },
  ],
  party: [
    { value: '1', label: '1인' },
    { value: '2', label: '2인' },
    { value: '3-4', label: '3~4인' },
    { value: '5+', label: '5인+' },
  ],
  tags: TAG_OPTIONS.map((label) => ({ value: label, label })),
}

/** 홈 카드 / 조건 설정 화면 공통 그룹 정보 */
export const FILTER_GROUPS = [
  { key: 'distance', label: '거리', emoji: '🚶' },
  { key: 'menu', label: '메뉴', emoji: '🍱' },
  { key: 'price', label: '가격', emoji: '💰' },
  { key: 'party', label: '인원', emoji: '👥' },
]

const MENU_TYPES = new Set(['한식', '일식', '중식', '양식', '아시아'])

const MENU_FILTER_MAP = {
  korean: '한식',
  japanese: '일식',
  chinese: '중식',
  western: '양식',
  asian: '아시아',
}

/** 홈·조건설정 화면이 같은 값을 보도록 모듈에 한 번만 만듭니다. */
const filters = ref({
  distance: null,
  price: null,
  menu: null,
  party: null,
  tags: [],
})

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
  if (price.includes('1.5만원 이상') || (price.includes('1.5만') && price.includes('이상'))) {
    return 'over15'
  }
  if (price.includes('1.5만원 이하') || price.includes('1~1.5')) return '10to15'
  if (price.includes('5천') || price.includes('1만')) return 'under10'
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

function matchesTags(restaurant, filterTags) {
  if (!filterTags?.length) return true

  const restaurantTags = restaurant.tags || []
  return filterTags.some((tag) => restaurantTags.includes(tag))
}

export function filterRestaurants(restaurants, filterState) {
  return restaurants.filter(
    (restaurant) =>
      matchesDistance(restaurant, filterState.distance) &&
      matchesPrice(restaurant, filterState.price) &&
      matchesMenu(restaurant, filterState.menu) &&
      matchesParty(restaurant, filterState.party) &&
      matchesTags(restaurant, filterState.tags),
  )
}

export function hasActiveFilters(filterState) {
  return (
    filterState.distance != null ||
    filterState.price != null ||
    filterState.menu != null ||
    filterState.party != null ||
    (filterState.tags?.length ?? 0) > 0
  )
}

export function getFilterLabel(key, value) {
  if (key === 'tags') {
    const tags = Array.isArray(value) ? value : []
    if (!tags.length) return '전체'
    if (tags.length === 1) return tags[0]
    return `${tags.length}개 선택`
  }

  if (value == null) return '전체'
  const option = FILTER_OPTIONS[key]?.find((item) => item.value === value)
  return option?.label ?? '전체'
}

export function useQuickFilters() {
  const isActive = computed(() => hasActiveFilters(filters.value))

  function toggleFilter(key, value) {
    filters.value[key] = filters.value[key] === value ? null : value
  }

  /** 조건 설정에서 "전체" 선택 시 value = null */
  function setFilter(key, value) {
    filters.value[key] = value
  }

  function resetFilters() {
    filters.value = {
      distance: null,
      price: null,
      menu: null,
      party: null,
      tags: [],
    }
  }

  function toggleFilterTag(tag) {
    const current = filters.value.tags
    const index = current.indexOf(tag)

    if (index >= 0) {
      filters.value.tags = current.filter((item) => item !== tag)
      return
    }

    if (current.length >= 3) return
    filters.value.tags = [...current, tag]
  }

  return {
    filters,
    isActive,
    toggleFilter,
    setFilter,
    resetFilters,
    toggleFilterTag,
    hasActiveFilters,
  }
}
