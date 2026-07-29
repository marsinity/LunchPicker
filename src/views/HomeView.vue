<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import HomeBrand from '@/components/home/HomeBrand.vue'
import QuickFilters from '@/components/home/QuickFilters.vue'
import RecentRestaurants from '@/components/home/RecentRestaurants.vue'
import { useLunchPick } from '@/composables/useLunchPick'
import { countFilteredRestaurants, useQuickFilters } from '@/composables/useQuickFilters'
import { restaurantService } from '@/services/restaurantService'

const router = useRouter()

const {
  restaurants,
  isLoading,
  isPicking,
  error,
  pickMessage,
  loadRestaurants,
  pickRandom,
  resetPick,
} = useLunchPick()

const { filters } = useQuickFilters()

const recentRestaurants = ref([])
const isRecentLoading = ref(false)
const recentError = ref('')

const candidateCount = computed(() =>
  countFilteredRestaurants(restaurants.value, filters.value),
)

async function loadRecent() {
  isRecentLoading.value = true
  recentError.value = ''

  try {
    recentRestaurants.value = await restaurantService.getRecent(4)
  } catch (err) {
    console.error(err)
    recentError.value = '최근 식당을 불러오지 못했어요.'
  } finally {
    isRecentLoading.value = false
  }
}

async function handlePick() {
  const result = await pickRandom(filters.value)
  if (result) {
    router.push({ name: 'result' })
  }
}

function handleResetFilters() {
  resetPick()
}

onMounted(() => {
  loadRestaurants()
  loadRecent()
})
</script>

<template>
  <div class="home">
    <HomeBrand :is-picking="isPicking || isLoading" @pick="handlePick" />

    <p v-if="error" class="home__status home__status--error" role="alert">
      {{ error }}
    </p>

    <template v-else>
      <p v-if="pickMessage" class="home__status home__status--notice" role="status">
        {{ pickMessage }}
      </p>

      <QuickFilters :candidate-count="candidateCount" @reset="handleResetFilters" />

      <p v-if="recentError" class="home__status home__status--error" role="alert">
        {{ recentError }}
      </p>

      <RecentRestaurants
        :restaurants="recentRestaurants"
        :is-loading="isRecentLoading"
      />
    </template>
  </div>
</template>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  gap: var(--space-xl);
}

.home__status {
  text-align: center;
  color: var(--color-text-muted);
  font-size: var(--font-size-sm);
}

.home__status--error {
  color: #ff3b30;
}

.home__status--notice {
  padding: var(--space-md) var(--space-lg);
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
}
</style>
