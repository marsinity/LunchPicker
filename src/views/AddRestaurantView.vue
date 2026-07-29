<script setup>
/**
 * 맛집 등록 화면 (시안: 버튼/이모지 선택)
 */
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppButton from '@/components/common/AppButton.vue'
import AppTextField from '@/components/common/AppTextField.vue'
import { useLunchPick } from '@/composables/useLunchPick'
import {
  DISTANCE_OPTIONS,
  PARTY_OPTIONS,
  PRICE_OPTIONS,
  REGISTRATION_CATEGORIES,
} from '@/data/restaurantOptions'
import { MAX_RESTAURANT_TAGS, TAG_OPTIONS } from '@/data/restaurantTags'
import { restaurantService } from '@/services/restaurantService'

const route = useRoute()
const router = useRouter()
const { loadRestaurants } = useLunchPick()

const isEditMode = computed(() => route.name === 'restaurant-edit')
const editId = computed(() => (isEditMode.value ? String(route.params.id) : null))

const CATEGORIES = REGISTRATION_CATEGORIES

const DISHES = [
  { value: '김치찌개', emoji: '🍲', category: '한식' },
  { value: '된장찌개', emoji: '🍚', category: '한식' },
  { value: '순두부찌개', emoji: '🍚', category: '한식' },
  { value: '비빔밥', emoji: '🥗', category: '한식' },
  { value: '우동', emoji: '🍜', category: '한식' },
  { value: '돈까스', emoji: '🍛', category: '한식' },
  { value: '라면', emoji: '🍜', category: '한식' },
  { value: '덮밥', emoji: '🍚', category: '한식' },
  { value: '두루치기', emoji: '🐷', category: '한식' },
  { value: '삼계탕', emoji: '🐔', category: '한식' },
  { value: '칼국수', emoji: '🍜', category: '한식' },

  { value: '라멘', emoji: '🍥', category: '일식' },
  { value: '초밥', emoji: '🍣', category: '일식' },
  { value: '회', emoji: '🍣', category: '일식' },

  { value: '파스타', emoji: '🍝', category: '양식' },
  { value: '리조또', emoji: '🍝', category: '양식' },
  { value: '스테이크', emoji: '🥩', category: '양식' },
  { value: '샐러드', emoji: '🥬', category: '양식' },
  { value: '햄버거', emoji: '🍔', category: '양식' },

  { value: '쌀국수', emoji: '🍜', category: '아시아' },
  { value: '똠얌꿍', emoji: '🍜', category: '아시아' },
  { value: '팟타이', emoji: '🍜', category: '아시아' },

  { value: '짜장면', emoji: '🥡', category: '중식' },
  { value: '짬뽕', emoji: '🥡', category: '중식' },
  { value: '볶음밥', emoji: '🍳', category: '중식' },
  { value: '마라탕', emoji: '🌶️', category: '중식' },
  { value: '마라샹궈', emoji: '🍲', category: '중식' },

  { value: '떡볶이', emoji: '🌶️', category: '분식' },
  { value: '김밥', emoji: '🍙', category: '분식' },
  { value: '잔치국수', emoji: '🍜', category: '분식' },

  { value: '아메리카노', emoji: '☕', category: '카페' },
  { value: '라떼', emoji: '🥛', category: '카페' },
  { value: '베이커리', emoji: '🥐', category: '카페' },
  { value: '디저트', emoji: '🍰', category: '카페' },
]

const SIGNATURE_MENU_MAX = 40

const form = reactive({
  name: '',
  address: '',
  category: '한식',
  signatureMenu: '',
  selectedTags: [],
  emoji: '🍚',
  distance: null,
  price: null,
  partySize: null,
})

const fieldErrors = reactive({
  category: '',
  name: '',
  distance: '',
  price: '',
  partySize: '',
})

const isSubmitting = ref(false)
const isLoadingEdit = ref(route.name === 'restaurant-edit')
const formError = ref('')
const formSuccess = ref('')
const pageTitle = computed(() => (isEditMode.value ? '맛집 수정' : '맛집 등록'))
const submitLabel = computed(() => {
  if (isSubmitting.value) return isEditMode.value ? '저장 중...' : '등록 중...'
  return isEditMode.value ? '저장하기' : '등록하기'
})
const canSubmit = computed(
  () =>
    Boolean(
      form.category &&
        form.name.trim() &&
        form.distance &&
        form.price &&
        form.partySize,
    ),
)

const quickDishes = computed(() =>
  DISHES.filter((item) => item.category === form.category),
)

function categoryEmoji(category) {
  return CATEGORIES.find((item) => item.value === category)?.emoji || '🍽️'
}

function parseSignatureMenus(text) {
  return text
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 5)
}

function clearFieldErrors() {
  fieldErrors.category = ''
  fieldErrors.name = ''
  fieldErrors.distance = ''
  fieldErrors.price = ''
  fieldErrors.partySize = ''
}

function selectDistance(value) {
  form.distance = value
  fieldErrors.distance = ''
}

function selectPrice(value) {
  form.price = value
  fieldErrors.price = ''
}

function selectPartySize(value) {
  form.partySize = value
  fieldErrors.partySize = ''
}

function fillForm(restaurant) {
  form.name = restaurant.name || ''
  form.address = restaurant.address || ''
  form.category = restaurant.category || '한식'
  form.signatureMenu = Array.isArray(restaurant.menus) ? restaurant.menus.join(', ') : ''
  form.selectedTags = (restaurant.tags || []).filter((tag) => TAG_OPTIONS.includes(tag)).slice(0, MAX_RESTAURANT_TAGS)
  form.emoji = restaurant.emoji || categoryEmoji(form.category)
  form.distance = restaurant.distance || null
  form.price = restaurant.price || null
  form.partySize = restaurant.partySize || null
  clearFieldErrors()
}

function toggleTag(tag) {
  const index = form.selectedTags.indexOf(tag)
  if (index >= 0) {
    form.selectedTags.splice(index, 1)
    return
  }
  if (form.selectedTags.length >= MAX_RESTAURANT_TAGS) return
  form.selectedTags.push(tag)
}

function selectCategory(item) {
  form.category = item.value
  form.emoji = item.emoji
  fieldErrors.category = ''
}

function applyQuickDish(item) {
  form.signatureMenu = item.value
  form.emoji = item.emoji
}

function goBack() {
  if (window.history.length > 1) {
    router.back()
  } else if (isEditMode.value && editId.value) {
    router.push({ name: 'restaurant-detail', params: { id: editId.value } })
  } else {
    router.push({ name: 'home' })
  }
}

async function loadForEdit() {
  if (!isEditMode.value || !editId.value) return

  isLoadingEdit.value = true
  formError.value = ''
  clearFieldErrors()

  try {
    const restaurant = await restaurantService.getById(editId.value)
    if (!restaurant?.isCustom) {
      formError.value = '직접 등록한 식당만 수정할 수 있어요.'
      window.setTimeout(() => {
        router.replace({ name: 'restaurants' })
      }, 800)
      return
    }
    fillForm(restaurant)
  } catch (err) {
    console.error(err)
    formError.value = '식당 정보를 불러오지 못했어요.'
  } finally {
    isLoadingEdit.value = false
  }
}

function validateRequired() {
  clearFieldErrors()
  let ok = true

  if (!form.category) {
    fieldErrors.category = '분류를 선택해주세요.'
    ok = false
  }
  if (!form.name.trim()) {
    fieldErrors.name = '식당 이름을 입력해주세요.'
    ok = false
  }
  if (!form.distance) {
    fieldErrors.distance = '도보 시간을 선택해주세요.'
    ok = false
  }
  if (!form.price) {
    fieldErrors.price = '평균 가격을 선택해주세요.'
    ok = false
  }
  if (!form.partySize) {
    fieldErrors.partySize = '적합 인원을 선택해주세요.'
    ok = false
  }
  return ok
}

async function handleSubmit() {
  formError.value = ''
  formSuccess.value = ''

  if (!validateRequired()) return

  const menus = parseSignatureMenus(form.signatureMenu)
  if (form.signatureMenu.trim().length > SIGNATURE_MENU_MAX) {
    formError.value = `대표 메뉴는 ${SIGNATURE_MENU_MAX}자까지 입력할 수 있어요.`
    return
  }

  isSubmitting.value = true
  try {
    const payload = {
      name: form.name,
      address: form.address,
      emoji: form.emoji || categoryEmoji(form.category),
      category: form.category,
      distance: form.distance,
      price: form.price,
      menu: form.category,
      menus,
      partySize: form.partySize,
      tags: [...form.selectedTags],
    }

    if (isEditMode.value) {
      const updated = await restaurantService.updateCustom(editId.value, payload)
      if (!updated) {
        formError.value = '이 식당은 수정할 수 없어요.'
        return
      }
      await loadRestaurants({ force: true })
      formSuccess.value = '수정되었어요!'
      window.setTimeout(() => {
        router.replace({ name: 'restaurant-detail', params: { id: editId.value } })
      }, 400)
      return
    }

    await restaurantService.create(payload)
    await loadRestaurants({ force: true })
    formSuccess.value = '맛집이 등록되었어요!'
    form.name = ''
    form.address = ''
    form.signatureMenu = ''
    form.selectedTags = []
    form.emoji = categoryEmoji(form.category)
    form.distance = null
    form.price = null
    form.partySize = null
    clearFieldErrors()

    window.setTimeout(() => {
      router.push({ name: 'restaurants' })
    }, 500)
  } catch (err) {
    console.error(err)
    formError.value = isEditMode.value
      ? '수정에 실패했어요. 다시 시도해 주세요.'
      : '등록에 실패했어요. 다시 시도해 주세요.'
  } finally {
    isSubmitting.value = false
  }
}

onMounted(loadForEdit)
</script>

<template>
  <section class="add" aria-labelledby="add-title">
    <header class="add__top">
      <button type="button" class="add__back" aria-label="뒤로" @click="goBack">←</button>
      <h1 id="add-title" class="add__title">{{ pageTitle }}</h1>
      <span class="add__top-spacer" aria-hidden="true" />
    </header>

    <p v-if="isLoadingEdit" class="add__message">불러오는 중...</p>

    <form v-else class="add__form" @submit.prevent="handleSubmit">
      <fieldset class="add__fieldset" :class="{ 'add__fieldset--error': fieldErrors.category }">
        <legend class="add__legend">
          분류 <span class="add__required" aria-hidden="true">*</span>
        </legend>
        <div
          class="add__grid add__grid--category"
          :class="{ 'add__grid--error': fieldErrors.category }"
          role="group"
          aria-label="분류"
        >
          <button
            v-for="item in CATEGORIES"
            :key="item.value"
            type="button"
            class="add__card"
            :class="{ 'add__card--on': form.category === item.value }"
            :aria-pressed="form.category === item.value"
            @click="selectCategory(item)"
          >
            <span class="add__card-emoji" aria-hidden="true">{{ item.emoji }}</span>
            <span class="add__card-label">{{ item.label }}</span>
          </button>
        </div>
        <p v-if="fieldErrors.category" class="add__field-error" role="alert">
          {{ fieldErrors.category }}
        </p>
      </fieldset>

      <AppTextField
        id="name-input"
        v-model="form.name"
        label="식당 이름"
        required
        placeholder="예) 논현 칼국수"
        :error="fieldErrors.name"
        @input="fieldErrors.name = ''"
      />

      <AppTextField
        id="address-input"
        v-model="form.address"
        label="주소"
        placeholder="예) 서울 강남구 테헤란로 123"
        :maxlength="80"
      />

      <div class="add__field">
        <AppTextField
          id="signature-menu-input"
          v-model="form.signatureMenu"
          label="대표 메뉴"
          placeholder="예) 칼국수, 만두, 보쌈"
          :maxlength="SIGNATURE_MENU_MAX"
        />
        <template v-if="quickDishes.length">
          <p class="add__sublegend">빠른 선택</p>
          <div class="add__pills" role="group" aria-label="빠른 선택">
            <button
              v-for="item in quickDishes"
              :key="item.value"
              type="button"
              class="add__pill"
              :class="{ 'add__pill--on': form.signatureMenu === item.value }"
              :aria-pressed="form.signatureMenu === item.value"
              @click="applyQuickDish(item)"
            >
              {{ item.emoji }} {{ item.value }}
            </button>
          </div>
        </template>
      </div>

      <fieldset class="add__fieldset" :class="{ 'add__fieldset--error': fieldErrors.distance }">
        <legend class="add__legend">
          도보 시간 <span class="add__required" aria-hidden="true">*</span>
        </legend>
        <div
          class="add__pills"
          :class="{ 'add__pills--error': fieldErrors.distance }"
          role="group"
          aria-label="도보 시간"
        >
          <button
            v-for="item in DISTANCE_OPTIONS"
            :key="item.value"
            type="button"
            class="add__pill"
            :class="{ 'add__pill--on': form.distance === item.value }"
            :aria-pressed="form.distance === item.value"
            @click="selectDistance(item.value)"
          >
            {{ item.label }}
          </button>
        </div>
        <p v-if="fieldErrors.distance" class="add__field-error" role="alert">
          {{ fieldErrors.distance }}
        </p>
      </fieldset>

      <fieldset class="add__fieldset" :class="{ 'add__fieldset--error': fieldErrors.price }">
        <legend class="add__legend">
          평균 가격 (1인) <span class="add__required" aria-hidden="true">*</span>
        </legend>
        <div
          class="add__pills"
          :class="{ 'add__pills--error': fieldErrors.price }"
          role="group"
          aria-label="평균 가격"
        >
          <button
            v-for="item in PRICE_OPTIONS"
            :key="item.value"
            type="button"
            class="add__pill"
            :class="{ 'add__pill--on': form.price === item.value }"
            :aria-pressed="form.price === item.value"
            @click="selectPrice(item.value)"
          >
            {{ item.label }}
          </button>
        </div>
        <p v-if="fieldErrors.price" class="add__field-error" role="alert">
          {{ fieldErrors.price }}
        </p>
      </fieldset>

      <fieldset class="add__fieldset" :class="{ 'add__fieldset--error': fieldErrors.partySize }">
        <legend class="add__legend">
          적합 인원 <span class="add__required" aria-hidden="true">*</span>
        </legend>
        <div
          class="add__pills"
          :class="{ 'add__pills--error': fieldErrors.partySize }"
          role="group"
          aria-label="적합 인원"
        >
          <button
            v-for="item in PARTY_OPTIONS"
            :key="item.value"
            type="button"
            class="add__pill"
            :class="{ 'add__pill--on': form.partySize === item.value }"
            :aria-pressed="form.partySize === item.value"
            @click="selectPartySize(item.value)"
          >
            {{ item.label }}
          </button>
        </div>
        <p v-if="fieldErrors.partySize" class="add__field-error" role="alert">
          {{ fieldErrors.partySize }}
        </p>
      </fieldset>

      <fieldset class="add__fieldset">
        <legend class="add__legend">태그 (최대 {{ MAX_RESTAURANT_TAGS }}개)</legend>
        <div class="add__pills" role="group" aria-label="태그">
          <button
            v-for="tag in TAG_OPTIONS"
            :key="tag"
            type="button"
            class="add__pill"
            :class="{ 'add__pill--on': form.selectedTags.includes(tag) }"
            :aria-pressed="form.selectedTags.includes(tag)"
            @click="toggleTag(tag)"
          >
            {{ tag }}
          </button>
        </div>
      </fieldset>

      <p class="add__required-note">
        <span class="add__required" aria-hidden="true">*</span>
        표시는 필수 입력입니다.
      </p>

      <p v-if="formError" class="add__message add__message--error" role="alert">{{ formError }}</p>
      <p v-else-if="formSuccess" class="add__message add__message--ok" role="status">{{ formSuccess }}</p>

      <AppButton
        variant="primary"
        size="lg"
        block
        :disabled="!canSubmit || isSubmitting"
        type="submit"
      >
        {{ submitLabel }}
      </AppButton>
    </form>
  </section>
</template>

<style scoped>
.add {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

.add__top {
  display: grid;
  grid-template-columns: 2.5rem 1fr 2.5rem;
  align-items: center;
}

.add__back {
  width: 2.5rem;
  height: 2.5rem;
  font-size: 1.125rem;
  color: var(--color-text);
  background: #fff;
  border: 1px solid #efe8e3;
  border-radius: var(--radius-full);
}

.add__top-spacer {
  width: 2.5rem;
  height: 2.5rem;
}

.add__title {
  font-size: var(--font-size-xl);
  font-weight: 800;
  letter-spacing: -0.03em;
  text-align: center;
}

.add__form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.add__fieldset {
  margin: 0;
  padding: 0;
  border: none;
}

.add__legend,
.add__label {
  display: block;
  margin-bottom: 0.6rem;
  font-size: var(--font-size-sm);
  font-weight: 700;
  color: var(--color-text);
  letter-spacing: -0.01em;
}

.add__required {
  color: var(--color-brand);
  font-weight: 700;
}

.add__required-note {
  margin: 0;
  font-size: 12px;
  color: #999;
  line-height: 1.4;
}

.add__grid {
  display: grid;
  gap: 0.5rem;
}

.add__grid--category {
  grid-template-columns: repeat(3, minmax(0, 1fr));
  padding: 0.15rem;
  border-radius: 16px;
  border: 1.5px solid transparent;
}

.add__grid--error {
  border-color: #ff3b30;
}

.add__pills--error {
  padding: 0.15rem;
  border-radius: var(--radius-lg);
  outline: 1.5px solid #ff3b30;
}

.add__field-error {
  margin: 0.4rem 0 0;
  font-size: 12px;
  color: #ff3b30;
  line-height: 1.4;
}

.add__grid--dish {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.add__card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.3rem;
  min-height: 4.25rem;
  padding: 0.5rem 0.25rem;
  background: #fff;
  border: 1.5px solid #ebe4de;
  border-radius: 14px;
  transition:
    border-color 0.15s ease,
    background-color 0.15s ease,
    transform 0.12s ease;
}

.add__card:active {
  transform: scale(0.97);
}

.add__card--on {
  background: #fff8f0;
  border-color: var(--color-brand);
  box-shadow: 0 0 0 1px rgb(255 138 0 / 0.15);
}

.add__card-emoji {
  font-size: 1.5rem;
  line-height: 1;
}

.add__card-label {
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: -0.02em;
  color: var(--color-text);
}

.add__field {
  display: flex;
  flex-direction: column;
}

.add__sublegend {
  margin: 0.75rem 0 0.5rem;
  font-size: var(--font-size-sm);
  font-weight: 700;
  color: var(--color-text);
  letter-spacing: -0.01em;
}

.add__field .add__pills {
  margin-top: 0;
}

.add__pills {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.5rem;
}

.add__pill {
  min-height: 2.6rem;
  padding: 0 0.75rem;
  font-size: var(--font-size-sm);
  font-weight: 600;
  letter-spacing: -0.01em;
  color: var(--color-text);
  background: #fff;
  border: 1.5px solid #ebe4de;
  border-radius: var(--radius-full);
  transition:
    color 0.15s ease,
    background-color 0.15s ease,
    border-color 0.15s ease;
}

.add__pill--on {
  color: #fff;
  background: var(--color-brand);
  border-color: var(--color-brand);
}

.add__message {
  margin: 0;
  font-size: var(--font-size-sm);
  text-align: center;
}

.add__message--error {
  color: #ff3b30;
}

.add__message--ok {
  color: var(--color-brand);
  font-weight: 600;
}

@media (min-width: 28rem) {
  .add__pills {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}
</style>
