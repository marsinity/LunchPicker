<script setup>
/**
 * 설정 화면 — 알림 토글, 데이터 초기
 */
import { onMounted, ref } from 'vue'
import AppButton from '@/components/common/AppButton.vue'
import { usePickHistory } from '@/composables/usePickHistory'
import { useWishlist } from '@/composables/useWishlist'
import { useLunchPick } from '@/composables/useLunchPick'
import { restaurantService } from '@/services/restaurantService'

const NOTIFY_KEY = 'lunchpicker-notify'

const { count: historyCount, clearHistory } = usePickHistory()
const { count: wishlistCount, clearWishlist } = useWishlist()
const { loadRestaurants } = useLunchPick()

const notifyEnabled = ref(false)
const customCount = ref(0)
const message = ref('')

async function refreshCustomCount() {
  customCount.value = await restaurantService.getCustomCount()
}

function showMessage(text) {
  message.value = text
  window.setTimeout(() => {
    if (message.value === text) message.value = ''
  }, 2000)
}

function toggleNotify() {
  notifyEnabled.value = !notifyEnabled.value
  localStorage.setItem(NOTIFY_KEY, notifyEnabled.value ? '1' : '0')
  showMessage(notifyEnabled.value ? '알림을 켜 두었어요. (미리보기)' : '알림을 껐어요.')
}

function handleClearWishlist() {
  if (!wishlistCount.value) return
  if (window.confirm('찜한 식당을 모두 지울까요?')) {
    clearWishlist()
    showMessage('찜 목록을 비웠어요.')
  }
}

function handleClearHistory() {
  if (!historyCount.value) return
  if (window.confirm('뽑기 기록을 모두 지울까요?')) {
    clearHistory()
    showMessage('히스토리를 비웠어요.')
  }
}

async function handleClearCustom() {
  if (!customCount.value) return
  if (window.confirm('직접 등록한 식당을 모두 지울까요?')) {
    await restaurantService.clearCustom()
    await loadRestaurants({ force: true })
    await refreshCustomCount()
    showMessage('등록한 식당을 비웠어요.')
  }
}

onMounted(async () => {
  notifyEnabled.value = localStorage.getItem(NOTIFY_KEY) === '1'
  await refreshCustomCount()
})
</script>

<template>
  <section class="settings" aria-labelledby="settings-title">
    <header class="settings__header">
      <h1 id="settings-title" class="settings__title">설정</h1>
      <p class="settings__desc">앱 데이터와 알림을 관리해요.</p>
    </header>

    <p v-if="message" class="settings__toast" role="status">{{ message }}</p>

    <section class="settings__card" aria-labelledby="settings-notify">
      <div class="settings__row">
        <div>
          <h2 id="settings-notify" class="settings__row-title">점심 알림</h2>
          <p class="settings__row-desc">나중에 실제 알림 연동 예정이에요.</p>
        </div>
        <button
          type="button"
          class="settings__switch"
          :class="{ 'settings__switch--on': notifyEnabled }"
          :aria-pressed="notifyEnabled"
          @click="toggleNotify"
        >
          <span class="settings__switch-knob" />
          <span class="sr-only">{{ notifyEnabled ? '알림 켜짐' : '알림 꺼짐' }}</span>
        </button>
      </div>
    </section>

    <section class="settings__card" aria-labelledby="settings-data">
      <h2 id="settings-data" class="settings__section-title">데이터 관리</h2>

      <div class="settings__actions">
        <div class="settings__action">
          <div>
            <p class="settings__action-title">찜 목록 비우기</p>
            <p class="settings__action-desc">현재 {{ wishlistCount }}개</p>
          </div>
          <AppButton variant="secondary" size="sm" :disabled="!wishlistCount" @click="handleClearWishlist">
            삭제
          </AppButton>
        </div>

        <div class="settings__action">
          <div>
            <p class="settings__action-title">히스토리 비우기</p>
            <p class="settings__action-desc">현재 {{ historyCount }}개</p>
          </div>
          <AppButton variant="secondary" size="sm" :disabled="!historyCount" @click="handleClearHistory">
            삭제
          </AppButton>
        </div>

        <div class="settings__action">
          <div>
            <p class="settings__action-title">직접 등록 식당 삭제</p>
            <p class="settings__action-desc">현재 {{ customCount }}개</p>
          </div>
          <AppButton variant="secondary" size="sm" :disabled="!customCount" @click="handleClearCustom">
            삭제
          </AppButton>
        </div>
      </div>
    </section>

    <section class="settings__card settings__card--about">
      <p class="settings__about-label">LunchPicker</p>
      <p class="settings__about-desc">회사 점심, 함께 고르기</p>
    </section>
  </section>
</template>

<style scoped>
.settings {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.settings__title {
  font-size: var(--font-size-xl);
  font-weight: 800;
  letter-spacing: -0.03em;
}

.settings__desc {
  margin-top: var(--space-xs);
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
}

.settings__toast {
  padding: 0.75rem 1rem;
  text-align: center;
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--color-brand);
  background: var(--color-brand-soft);
  border-radius: 12px;
}

.settings__card {
  padding: var(--space-lg);
  background: #ffffff;
  border: 1px solid #efe8e3;
  border-radius: 20px;
  box-shadow: 0 1px 3px rgb(0 0 0 / 0.03);
}

.settings__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-md);
}

.settings__row-title,
.settings__section-title,
.settings__action-title {
  font-size: var(--font-size-base);
  font-weight: 700;
  letter-spacing: -0.02em;
}

.settings__section-title {
  margin-bottom: var(--space-md);
}

.settings__row-desc,
.settings__action-desc,
.settings__about-desc {
  margin-top: 0.2rem;
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
}

.settings__switch {
  position: relative;
  width: 3.25rem;
  height: 1.9rem;
  flex-shrink: 0;
  background: #e5e5ea;
  border: none;
  border-radius: 9999px;
  transition: background-color 0.2s ease;
}

.settings__switch--on {
  background: var(--color-brand);
}

.settings__switch-knob {
  position: absolute;
  top: 0.2rem;
  left: 0.2rem;
  width: 1.5rem;
  height: 1.5rem;
  background: #fff;
  border-radius: 50%;
  box-shadow: 0 1px 3px rgb(0 0 0 / 0.15);
  transition: transform 0.2s ease;
}

.settings__switch--on .settings__switch-knob {
  transform: translateX(1.35rem);
}

.settings__actions {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.settings__action {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-md);
}

.settings__card--about {
  text-align: center;
}

.settings__about-label {
  font-weight: 700;
  color: var(--color-brand);
}
</style>
