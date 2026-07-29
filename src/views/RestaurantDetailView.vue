<script setup>
/**
 * 식당 상세 페이지 (모바일 앱형 UI)
 * 기능: 조회 / 찜 / 지도 / 결정·재뽑기 / 커스텀 삭제 / 팀 메모
 */
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import RestaurantNotes from '@/components/lunch/RestaurantNotes.vue'
import { useLunchPick } from '@/composables/useLunchPick'
import { usePickHistory } from '@/composables/usePickHistory'
import { useQuickFilters } from '@/composables/useQuickFilters'
import { useWishlist } from '@/composables/useWishlist'
import { restaurantNoteService } from '@/services/restaurantNoteService'
import { restaurantService } from '@/services/restaurantService'
import { openNaverMap } from '@/utils/mapLinks'

const route = useRoute()
const router = useRouter()
const { loadRestaurants, pickRandom, picked, pickMessage } = useLunchPick()
const { addHistory } = usePickHistory()
const { filters } = useQuickFilters()
const { isLiked, toggleLike, removeFromWishlist } = useWishlist()

const restaurant = ref(null)
const isLoading = ref(true)
const notFound = ref(false)
const isDeleting = ref(false)
const isRepicking = ref(false)

const liked = computed(() => (restaurant.value ? isLiked(restaurant.value.id) : false))
const canDelete = computed(() => Boolean(restaurant.value?.isCustom))
const heroTags = computed(() => (restaurant.value?.tags || []).slice(0, 3))
const infoItems = computed(() => {
  if (!restaurant.value) return []
  return [
    { key: 'distance', emoji: '🚶', label: '거리', value: restaurant.value.distance || '-' },
    { key: 'price', emoji: '💰', label: '가격', value: restaurant.value.price || '-' },
    {
      key: 'menu',
      emoji: '🍽️',
      label: '분류',
      value: restaurant.value.category || restaurant.value.menu || '-',
    },
    { key: 'party', emoji: '👥', label: '인원', value: restaurant.value.partySize || '-' },
  ]
})
const menuItems = computed(() => {
  if (!restaurant.value?.menus?.length) return []
  return restaurant.value.menus
})

const addressText = computed(() => {
  if (!restaurant.value) return ''
  return restaurant.value.address || restaurant.value.distance || restaurant.value.name
})

function handleOpenMap() {
  if (!restaurant.value) return
  openNaverMap(restaurant.value)
}

function handleDecide() {
  if (!restaurant.value) return
  picked.value = restaurant.value
  addHistory(restaurant.value)
  router.push({ name: 'result' })
}

async function handleRepick() {
  if (isRepicking.value) return
  isRepicking.value = true
  try {
    await loadRestaurants()
    const result = await pickRandom(filters.value)
    if (result) {
      router.push({ name: 'result' })
    } else {
      router.push({ name: 'home' })
    }
  } catch (err) {
    console.error(err)
    pickMessage.value = '다시 추천하지 못했어요. 잠시 후 다시 시도해 주세요.'
    router.push({ name: 'home' })
  } finally {
    isRepicking.value = false
  }
}

async function loadDetail() {
  isLoading.value = true
  notFound.value = false

  try {
    const id = String(route.params.id)
    restaurant.value = await restaurantService.getById(id)
    if (!restaurant.value) notFound.value = true
  } catch (err) {
    console.error(err)
    notFound.value = true
  } finally {
    isLoading.value = false
  }
}

function goBack() {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push({ name: 'restaurants' })
  }
}

function handleToggleLike() {
  if (!restaurant.value) return
  toggleLike(restaurant.value.id)
}

async function handleDelete() {
  if (!restaurant.value?.isCustom || isDeleting.value) return

  const ok = window.confirm(`“${restaurant.value.name}” 식당을 삭제할까요?`)
  if (!ok) return

  isDeleting.value = true
  try {
    const removed = await restaurantService.removeCustom(restaurant.value.id)
    if (!removed) {
      window.alert('이 식당은 삭제할 수 없어요.')
      return
    }

    removeFromWishlist(restaurant.value.id)
    await restaurantNoteService.clearByRestaurantId(restaurant.value.id)
    await loadRestaurants({ force: true })
    router.replace({ name: 'restaurants' })
  } catch (err) {
    console.error(err)
    window.alert('삭제에 실패했어요. 다시 시도해 주세요.')
  } finally {
    isDeleting.value = false
  }
}

onMounted(loadDetail)
</script>

<template>
  <section class="detail" aria-labelledby="detail-title">
    <header class="detail__appbar">
      <button type="button" class="detail__icon-btn" aria-label="뒤로" @click="goBack">←</button>
      <h1 id="detail-title" class="detail__appbar-title">식당 상세</h1>
      <button
        v-if="restaurant"
        type="button"
        class="detail__icon-btn"
        :class="{ 'detail__icon-btn--liked': liked }"
        :aria-label="liked ? '찜 해제' : '찜하기'"
        :aria-pressed="liked"
        @click="handleToggleLike"
      >
        {{ liked ? '♥' : '♡' }}
      </button>
      <span v-else class="detail__icon-spacer" aria-hidden="true" />
    </header>

    <p v-if="isLoading" class="detail__status">불러오는 중...</p>

    <div v-else-if="notFound" class="detail__empty">
      <p class="detail__empty-title">식당을 찾을 수 없어요</p>
      <button type="button" class="detail__btn detail__btn--tertiary" @click="router.push({ name: 'restaurants' })">
        목록으로
      </button>
    </div>

    <template v-else-if="restaurant">
      <div class="detail__hero">
        <span class="detail__emoji" aria-hidden="true">{{ restaurant.emoji || '🍽️' }}</span>
        <h2 class="detail__name">{{ restaurant.name }}</h2>
        <p class="detail__category">{{ restaurant.category }}</p>
        <ul v-if="heroTags.length" class="detail__pills">
          <li v-for="tag in heroTags" :key="tag" class="detail__pill">{{ tag }}</li>
        </ul>
      </div>

      <section class="detail__card detail__summary" aria-label="핵심 정보">
        <div v-for="item in infoItems" :key="item.key" class="detail__summary-item">
          <p class="detail__summary-label">
            <span aria-hidden="true">{{ item.emoji }}</span>
            {{ item.label }}
          </p>
          <p class="detail__summary-value">{{ item.value }}</p>
        </div>
      </section>

      <section class="detail__card detail__location" aria-label="주소">
        <div class="detail__location-text">
          <p class="detail__location-label">
            <span aria-hidden="true">📍</span>
            주소
          </p>
          <p class="detail__location-value">{{ addressText }}</p>
        </div>
        <button type="button" class="detail__map-btn" @click="handleOpenMap">
          <span class="detail__map-btn-icon" aria-hidden="true">🗺️</span>
          지도
        </button>
      </section>

      <section v-if="menuItems.length" class="detail__card detail__menus" aria-labelledby="menus-title">
        <h2 id="menus-title" class="detail__section-title">
          <span aria-hidden="true">📋</span>
          대표 메뉴
        </h2>
        <p class="detail__menu-text">{{ menuItems.join(', ') }}</p>
      </section>

      <div class="detail__actions">
        <button type="button" class="detail__btn detail__btn--primary" @click="handleDecide">
          오늘 여기로 결정!
        </button>

        <button
          type="button"
          class="detail__btn detail__btn--tertiary"
          :disabled="isRepicking"
          @click="handleRepick"
        >
          {{ isRepicking ? '뽑는 중...' : '다른 식당 다시 뽑기' }}
        </button>
      </div>

      <RestaurantNotes :restaurant-id="restaurant.id" />

      <div v-if="canDelete" class="detail__manage">
        <button
          type="button"
          class="detail__edit"
          @click="router.push({ name: 'restaurant-edit', params: { id: restaurant.id } })"
        >
          수정
        </button>
        <span class="detail__manage-sep" aria-hidden="true">|</span>
        <button
          type="button"
          class="detail__delete"
          :disabled="isDeleting"
          @click="handleDelete"
        >
          {{ isDeleting ? '삭제 중...' : '삭제' }}
        </button>
      </div>
    </template>
  </section>
</template>

<style scoped>
.detail {
  display: flex;
  flex-direction: column;
  gap: 1.125rem;
  padding-bottom: 0.5rem;
}

.detail__appbar {
  display: grid;
  grid-template-columns: 2.5rem 1fr 2.5rem;
  align-items: center;
  min-height: 2.75rem;
}

.detail__icon-btn {
  width: 2.5rem;
  height: 2.5rem;
  font-size: 1.1rem;
  color: var(--color-text);
  background: transparent;
  border: none;
  border-radius: 9999px;
}

.detail__icon-btn--liked {
  color: #ff7a00;
}

.detail__icon-spacer {
  width: 2.5rem;
  height: 2.5rem;
}

.detail__appbar-title {
  font-size: 1rem;
  font-weight: 700;
  text-align: center;
  letter-spacing: -0.02em;
}

.detail__status,
.detail__empty {
  padding: 3rem 1rem;
  text-align: center;
  color: var(--color-text-muted);
}

.detail__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.detail__empty-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--color-text);
}

.detail__hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35rem;
  padding: 24px;
  text-align: center;
  background: #fbf7f2;
  border: 1px solid #efe8e3;
  border-radius: 24px;
}

.detail__emoji {
  font-size: 56px;
  line-height: 1;
}

.detail__name {
  margin-top: 0.25rem;
  font-size: 1.5rem;
  font-weight: 800;
  letter-spacing: -0.035em;
  line-height: 1.25;
  color: #1d1d1f;
}

.detail__category {
  font-size: 0.8125rem;
  color: #8a847e;
}

.detail__pills {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.35rem;
  margin: 0.45rem 0 0;
  padding: 0;
  list-style: none;
}

.detail__pill {
  padding: 0.25rem 0.6rem;
  font-size: 0.6875rem;
  font-weight: 600;
  color: #8a6a3d;
  background: #fff;
  border: 1px solid #efe8e3;
  border-radius: 9999px;
}

.detail__card {
  padding: 1rem 1.1rem;
  background: #ffffff;
  border: 1px solid #efe8e3;
  border-radius: 20px;
  box-shadow: 0 1px 2px rgb(0 0 0 / 0.03);
}

.detail__summary {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0;
}

.detail__summary-item {
  padding: 0.7rem 0.55rem;
}

.detail__summary-item:nth-child(odd) {
  border-right: 1px solid #f0ebe6;
}

.detail__summary-item:nth-child(-n + 2) {
  border-bottom: 1px solid #f0ebe6;
}

.detail__summary-label {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.75rem;
  color: #8a847e;
}

.detail__summary-value {
  margin-top: 0.3rem;
  font-size: 0.9375rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: #1d1d1f;
}

.detail__location {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 1rem 1.55rem;
}

.detail__menus {
    padding: 1rem 1.55rem;
}

.detail__location-text {
  min-width: 0;
  flex: 1;
}

.detail__location-label,
.detail__section-title {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  margin: 0;
  font-size: 0.75rem;
  font-weight: 400;
  color: #8a847e;
}

.detail__section-title {
  margin-bottom: 0.3rem;
}

.detail__location-value,
.detail__menu-text {
  margin-top: 0.3rem;
  font-size: 0.9375rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: #1d1d1f;
  line-height: 1.35;
  word-break: keep-all;
}

.detail__map-btn {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  min-height: 2.25rem;
  padding: 0.4rem 0.85rem;
  font: inherit;
  font-size: 0.8125rem;
  font-weight: 700;
  color: #ff7a00;
  background: #fff;
  border: 1.5px solid #ff7a00;
  border-radius: 9999px;
  white-space: nowrap;
}

.detail__map-btn:active {
  transform: scale(0.97);
}

.detail__map-btn-icon {
  font-size: 0.85rem;
  line-height: 1;
}

.detail__actions {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 0.65rem;
}

.detail__btn {
  width: 100%;
  min-height: 3.125rem;
  padding: 0 1rem;
  font: inherit;
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  border-radius: 16px;
  border: none;
  transition: transform 0.12s ease, opacity 0.15s ease;
}

.detail__btn:active:not(:disabled) {
  transform: scale(0.98);
}

.detail__btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.detail__btn--primary {
  color: #fff;
  background: #ff7a00;
  box-shadow: 0 6px 16px rgb(255 122 0 / 0.22);
}

.detail__btn--tertiary {
  color: #6e6e73;
  background: #f5f2ef;
  font-weight: 600;
}

.detail__manage {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 0.65rem;
  padding-top: 0.15rem;
}

.detail__manage-sep {
  color: #d0c9c3;
  font-size: 0.8125rem;
  font-weight: 400;
  line-height: 1;
  user-select: none;
}

.detail__edit,
.detail__delete {
  padding: 0.35rem 0.15rem;
  font: inherit;
  font-size: 0.8125rem;
  font-weight: 600;
  background: transparent;
  border: none;
  text-decoration: underline;
  text-underline-offset: 0.15em;
}

.detail__edit {
  color: #ff7a00;
}

.detail__delete {
  color: #b0aaa4;
}

.detail__delete:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}
</style>
