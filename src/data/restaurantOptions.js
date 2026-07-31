/**
 * 식당 등록·필터·목록에서 공통으로 쓰는 옵션과 파싱 유틸
 */

export const REGISTRATION_CATEGORIES = [
  { value: '한식', emoji: '🍚', label: '한식' },
  { value: '일식', emoji: '🍣', label: '일식' },
  { value: '중식', emoji: '🥟', label: '중식' },
  { value: '양식', emoji: '🍝', label: '양식' },
  { value: '아시아', emoji: '🍤', label: '아시아' },
  { value: '분식', emoji: '🍥', label: '분식' },
  { value: '카페', emoji: '☕', label: '카페' },
]

export const LIST_CATEGORY_OPTIONS = [
  { value: 'all', label: '전체' },
  ...REGISTRATION_CATEGORIES.map(({ value, label }) => ({ value, label })),
]

export const DISTANCE_OPTIONS = [
  { value: '도보 5분', label: '5분' },
  { value: '도보 10분', label: '10분' },
  { value: '도보 15분', label: '15분' },
  { value: '도보 20분', label: '20분 이상' },
]

export const PRICE_OPTIONS = [
  { value: '5천원 이하', label: '5천원 이하' },
  { value: '1만원 이하', label: '1만원 이하' },
  { value: '1~1.5만원', label: '1~1.5만원' },
  { value: '1.5만원 이상', label: '1.5만원 이상' },
]

export const PARTY_OPTIONS = [
  { value: '1인', label: '1인' },
  { value: '1~2인', label: '1~2인' },
  { value: '1~4인', label: '1~4인' },
  { value: '5인 이상', label: '5인 이상' },
]

export const SORT_OPTIONS = [
  { value: 'distance', label: '거리순' },
  { value: 'name', label: '이름순' },
  { value: 'recent', label: '최신순' },
]

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
}

export const FILTER_GROUPS = [
  { key: 'distance', label: '거리', emoji: '🚶' },
  { key: 'menu', label: '메뉴', emoji: '🍱' },
  { key: 'price', label: '가격', emoji: '💰' },
  { key: 'party', label: '인원', emoji: '👥' },
]

export const PRIMARY_MENU_TYPES = new Set(['한식', '일식', '중식', '양식', '아시아'])

export const MENU_FILTER_MAP = {
  korean: '한식',
  japanese: '일식',
  chinese: '중식',
  western: '양식',
  asian: '아시아',
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

export function getRestaurantMenuType(restaurant) {
  return restaurant.menu || restaurant.category || ''
}

export function getPriceTier(price) {
  if (!price) return null
  if (price.includes('1.5만원 이상') || (price.includes('1.5만') && price.includes('이상'))) {
    return 'over15'
  }
  if (price.includes('1~1.5') || price.includes('1.5만원 이하')) {
    return '10to15'
  }
  if (price.includes('5천') || price.includes('1만')) {
    return 'under10'
  }
  return null
}

export function matchesListCategory(restaurant, selected) {
  if (selected === 'all') return true

  const menuType = getRestaurantMenuType(restaurant)
  const category = restaurant.category || ''

  if (selected === '카페') {
    return menuType.includes('카페') || category.includes('카페')
  }

  return menuType === selected || category === selected
}
