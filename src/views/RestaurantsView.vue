<script setup>
/**
 * 맛집 목록 화면 (시안)
 * - 검색 + 카테고리 칩 + 정렬 + 개수
 * - 카드 클릭 시 상세, 하트로 찜
 */
import { computed, onMounted, ref } from 'vue'
import RestaurantCard from '@/components/lunch/RestaurantCard.vue'
import { parseWalkMinutes } from '@/composables/useQuickFilters'
import { useLunchPick } from '@/composables/useLunchPick'
import { useWishlist } from '@/composables/useWishlist'

const CATEGORIES = [
  { value: 'all', label: '전체' },
  { value: '한식', label: '한식' },
  { value: '일식', label: '일식' },
  { value: '중식', label: '중식' },
  { value: '양식', label: '양식' },
  { value: '아시아', label: '아시아' },
  { value: '카페', label: '카페' },
]

const SORT_OPTIONS = [
  { value: 'distance', label: '거리순' },
  { value: 'name', label: '이름순' },
  { value: 'recent', label: '최신순' },
]

const { restaurants, isLoading, error, loadRestaurants } = useLunchPick()
const { isLiked } = useWishlist()

const query = ref('')
const category = ref('all')
const sortBy = ref('distance')
const showLikedOnly = ref(false)
const sortOpen = ref(false)

const sortLabel = computed(
  () => SORT_OPTIONS.find((item) => item.value === sortBy.value)?.label ?? '거리순',
)

function matchesCategory(restaurant, selected) {
  if (selected === 'all') return true

  const menu = restaurant.menu || ''
  const cat = restaurant.category || ''

  if (selected === '카페') {
    return menu.includes('카페') || cat.includes('카페')
  }

  return menu === selected || cat.includes(selected)
}

const filteredRestaurants = computed(() => {
  const keyword = query.value.trim().toLowerCase()

  let list = restaurants.value.filter((restaurant) => {
    if (showLikedOnly.value && !isLiked(restaurant.id)) return false
    if (!matchesCategory(restaurant, category.value)) return false
    if (!keyword) return true

    const haystack = [restaurant.name, restaurant.category, restaurant.menu, restaurant.tags?.join(' ')]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()

    return haystack.includes(keyword)
  })

  list = [...list].sort((a, b) => {
    if (sortBy.value === 'name') {
      return a.name.localeCompare(b.name, 'ko')
    }
    if (sortBy.value === 'recent') {
      return new Date(b.createdAt) - new Date(a.createdAt)
    }

    const aMin = parseWalkMinutes(a.distance) ?? 999
    const bMin = parseWalkMinutes(b.distance) ?? 999
    return aMin - bMin
  })

  return list
})

const totalCount = computed(() => filteredRestaurants.value.length)

function selectSort(value) {
  sortBy.value = value
  sortOpen.value = false
}

onMounted(() => {
  loadRestaurants({ force: true })
})
</script>

<template>
  <section class="restaurants" aria-labelledby="restaurants-title">
    <header class="restaurants__header">
      <h1 id="restaurants-title" class="restaurants__title">맛집 목록</h1>
    </header>

    <div class="restaurants__toolbar">
      <label class="restaurants__search">
        <span class="sr-only">식당 검색</span>
        <span class="restaurants__search-icon" aria-hidden="true">🔍</span>
        <input
          v-model="query"
          type="search"
          class="restaurants__input"
          placeholder="식당명, 메뉴 검색"
          autocomplete="off"
        />
      </label>

      <button
        type="button"
        class="restaurants__funnel"
        :class="{ 'restaurants__funnel--on': showLikedOnly }"
        :aria-pressed="showLikedOnly"
        :aria-label="showLikedOnly ? '찜한 맛집만 보는 중' : '찜한 맛집만 보기'"
        @click="showLikedOnly = !showLikedOnly"
      >
        {{ showLikedOnly ? '♥' : '☰' }}
      </button>
    </div>

    <div class="restaurants__chips" role="tablist" aria-label="카테고리">
      <button
        v-for="item in CATEGORIES"
        :key="item.value"
        type="button"
        class="restaurants__chip"
        :class="{ 'restaurants__chip--on': category === item.value }"
        role="tab"
        :aria-selected="category === item.value"
        @click="category = item.value"
      >
        {{ item.label }}
      </button>
    </div>

    <div class="restaurants__meta">
      <div class="restaurants__sort">
        <button
          type="button"
          class="restaurants__sort-btn"
          :aria-expanded="sortOpen"
          @click="sortOpen = !sortOpen"
        >
          {{ sortLabel }}
          <span aria-hidden="true">▾</span>
        </button>

        <ul v-if="sortOpen" class="restaurants__sort-menu" role="listbox">
          <li v-for="item in SORT_OPTIONS" :key="item.value">
            <button
              type="button"
              class="restaurants__sort-option"
              :class="{ 'restaurants__sort-option--on': sortBy === item.value }"
              role="option"
              :aria-selected="sortBy === item.value"
              @click="selectSort(item.value)"
            >
              {{ item.label }}
            </button>
          </li>
        </ul>
      </div>

      <p class="restaurants__count">
        {{ showLikedOnly ? '찜' : '전체' }} {{ totalCount }}개
      </p>
    </div>

    <p v-if="isLoading" class="restaurants__status">불러오는 중...</p>
    <p v-else-if="error" class="restaurants__status restaurants__status--error" role="alert">
      {{ error }}
    </p>
    <p v-else-if="!filteredRestaurants.length" class="restaurants__status">
      조건에 맞는 맛집이 없어요.
    </p>

    <ul v-else class="restaurants__list">
      <li v-for="(restaurant, index) in filteredRestaurants" :key="restaurant.id">
        <RestaurantCard
          :restaurant="restaurant"
          :style="{ '--delay': `${Math.min(index, 8) * 0.04}s` }"
        />
      </li>
    </ul>
  </section>
</template>

<style scoped>
.restaurants {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.restaurants__title {
  font-size: 1.5rem;
  font-weight: 800;
  letter-spacing: -0.03em;
}

.restaurants__toolbar {
  display: flex;
  gap: 0.5rem;
}

.restaurants__search {
  display: flex;
  flex: 1;
  align-items: center;
  gap: 0.4rem;
  min-width: 0;
  padding: 0 0.875rem;
  background: #ffffff;
  border: 1px solid #ebe4de;
  border-radius: 14px;
}

.restaurants__search-icon {
  font-size: 0.875rem;
  line-height: 1;
  opacity: 0.7;
}

.restaurants__input {
  width: 100%;
  min-height: 2.75rem;
  border: none;
  background: transparent;
  font: inherit;
  font-size: var(--font-size-sm);
  letter-spacing: -0.01em;
  color: var(--color-text);
  outline: none;
}

.restaurants__input::placeholder {
  color: #b0aaa4;
}

.restaurants__funnel {
  flex-shrink: 0;
  width: 2.75rem;
  height: 2.75rem;
  font-size: 1rem;
  color: var(--color-text-secondary);
  background: #ffffff;
  border: 1px solid #ebe4de;
  border-radius: 14px;
}

.restaurants__funnel--on {
  color: var(--color-brand);
  background: var(--color-brand-soft);
  border-color: rgb(255 138 0 / 0.4);
}

.restaurants__chips {
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  padding-bottom: 0.125rem;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;
}

.restaurants__chips::-webkit-scrollbar {
  display: none;
}

.restaurants__chip {
  flex-shrink: 0;
  min-height: 2.125rem;
  padding: 0 0.95rem;
  font-size: var(--font-size-sm);
  font-weight: 600;
  letter-spacing: -0.01em;
  color: var(--color-text);
  background: #ffffff;
  border: 1.5px solid #e7e0da;
  border-radius: var(--radius-full);
  transition:
    color 0.15s ease,
    border-color 0.15s ease,
    background-color 0.15s ease;
}

.restaurants__chip--on {
  color: var(--color-brand);
  background: #fff;
  border-color: var(--color-brand);
}

.restaurants__meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-md);
  margin-top: -0.15rem;
}

.restaurants__sort {
  position: relative;
}

.restaurants__sort-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.2rem 0;
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--color-text);
  background: transparent;
  border: none;
}

.restaurants__sort-menu {
  position: absolute;
  top: calc(100% + 0.35rem);
  left: 0;
  z-index: 5;
  min-width: 7.5rem;
  margin: 0;
  padding: 0.35rem;
  list-style: none;
  background: #fff;
  border: 1px solid #efe8e3;
  border-radius: 12px;
  box-shadow: var(--shadow-md);
}

.restaurants__sort-option {
  width: 100%;
  padding: 0.55rem 0.7rem;
  text-align: left;
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--color-text);
  background: transparent;
  border: none;
  border-radius: 8px;
}

.restaurants__sort-option--on {
  color: var(--color-brand);
  background: var(--color-brand-soft);
  font-weight: 700;
}

.restaurants__count {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
}

.restaurants__list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.restaurants__status {
  padding: var(--space-xl) var(--space-md);
  text-align: center;
  color: var(--color-text-muted);
  font-size: var(--font-size-sm);
}

.restaurants__status--error {
  color: #ff3b30;
}
</style>
