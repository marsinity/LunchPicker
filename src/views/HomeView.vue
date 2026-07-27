<script setup>
import { onMounted, ref } from 'vue'
import HomeBrand from '@/components/home/HomeBrand.vue'
import PickAction from '@/components/home/PickAction.vue'
import QuickFilters from '@/components/home/QuickFilters.vue'
import RecentRestaurants from '@/components/home/RecentRestaurants.vue'
import PickResult from '@/components/lunch/PickResult.vue'
import AppButton from '@/components/common/AppButton.vue'
import { useLunchPick } from '@/composables/useLunchPick'
import { useQuickFilters } from '@/composables/useQuickFilters'
import { restaurantService } from '@/services/restaurantService'

const {
  picked,
  isLoading,
  isPicking,
  error,
  pickMessage,
  loadRestaurants,
  pickRandom,
  resetPick,
} = useLunchPick()

const { filters, toggleFilter, resetFilters } = useQuickFilters()

const recentRestaurants = ref([])
const isRecentLoading = ref(false)

async function loadRecent() {
  isRecentLoading.value = true
  try {
    recentRestaurants.value = await restaurantService.getRecent(4)
  } catch (err) {
    console.error(err)
  } finally {
    isRecentLoading.value = false
  }
}

function handlePick() {
  pickRandom(filters.value)
}

function handleToggleFilter(key, value) {
  toggleFilter(key, value)
  resetPick()
}

function handleResetFilters() {
  resetFilters()
  resetPick()
}

onMounted(() => {
  loadRestaurants()
  loadRecent()
})
</script>

<template>
  <div class="home">
    <HomeBrand />

    <p v-if="error" class="home__status home__status--error" role="alert">
      {{ error }}
    </p>

    <template v-else>
      <PickResult v-if="picked" :restaurant="picked" class="home__result" />

      <p v-else-if="pickMessage" class="home__status home__status--notice" role="status">
        {{ pickMessage }}
      </p>

      <PickAction :is-picking="isPicking || isLoading" @pick="handlePick" />

      <div v-if="picked" class="home__reset">
        <AppButton variant="ghost" size="sm" @click="resetPick">
          결과 닫기
        </AppButton>
      </div>

      <QuickFilters
        :model-value="filters"
        @toggle="handleToggleFilter"
        @reset="handleResetFilters"
      />

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

.home__result {
  animation: result-in 0.4s cubic-bezier(0.22, 1, 0.36, 1) both;
}

.home__reset {
  display: flex;
  justify-content: center;
  margin-top: calc(var(--space-md) * -1);
}

@keyframes result-in {
  from {
    opacity: 0;
    transform: translateY(8px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
</style>
