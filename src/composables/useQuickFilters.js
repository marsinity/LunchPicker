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
  }
}
