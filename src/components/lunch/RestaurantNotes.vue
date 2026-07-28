<script setup>
/**
 * 우리 팀 한줄 메모
 * - 회사 구성원 공유용 짧은 메모 (공개 리뷰 아님)
 * - 저장: localStorage (restaurantNoteService)
 */
import { computed, onMounted, ref, watch } from 'vue'
import { MOCK_USER } from '@/data/mockUser'
import {
  NOTE_MAX_LENGTH,
  formatNoteTime,
  restaurantNoteService,
} from '@/services/restaurantNoteService'

const props = defineProps({
  restaurantId: {
    type: String,
    required: true,
  },
})

const notes = ref([])
const draft = ref('')
const editingId = ref(null)
const editDraft = ref('')
const errorMessage = ref('')
const isSaving = ref(false)

const charCount = computed(() => draft.value.length)
const editCharCount = computed(() => editDraft.value.length)
const canSubmit = computed(() => draft.value.trim().length > 0 && !isSaving.value)

async function loadNotes() {
  notes.value = await restaurantNoteService.getByRestaurantId(props.restaurantId)
}

function isMine(note) {
  return note.authorId === MOCK_USER.id
}

function mapError(code) {
  if (code === 'EMPTY') return '내용을 입력해 주세요.'
  if (code === 'TOO_LONG') return `메모는 ${NOTE_MAX_LENGTH}자까지 가능해요.`
  if (code === 'FORBIDDEN') return '본인 메모만 수정·삭제할 수 있어요.'
  return '저장에 실패했어요. 다시 시도해 주세요.'
}

async function handleCreate() {
  errorMessage.value = ''
  isSaving.value = true

  try {
    await restaurantNoteService.create(props.restaurantId, draft.value)
    draft.value = ''
    await loadNotes()
  } catch (err) {
    errorMessage.value = mapError(err?.message)
  } finally {
    isSaving.value = false
  }
}

function startEdit(note) {
  editingId.value = note.id
  editDraft.value = note.content
  errorMessage.value = ''
}

function cancelEdit() {
  editingId.value = null
  editDraft.value = ''
}

async function handleUpdate(noteId) {
  errorMessage.value = ''
  isSaving.value = true

  try {
    await restaurantNoteService.update(props.restaurantId, noteId, editDraft.value)
    cancelEdit()
    await loadNotes()
  } catch (err) {
    errorMessage.value = mapError(err?.message)
  } finally {
    isSaving.value = false
  }
}

async function handleDelete(note) {
  if (!window.confirm('이 메모를 삭제할까요?')) return

  errorMessage.value = ''
  try {
    await restaurantNoteService.remove(props.restaurantId, note.id)
    if (editingId.value === note.id) cancelEdit()
    await loadNotes()
  } catch (err) {
    errorMessage.value = mapError(err?.message)
  }
}

onMounted(loadNotes)

watch(
  () => props.restaurantId,
  () => {
    cancelEdit()
    draft.value = ''
    loadNotes()
  },
)
</script>

<template>
  <section class="notes" aria-labelledby="notes-title">
    <header class="notes__header">
      <h2 id="notes-title" class="notes__title">우리 팀 한줄 메모</h2>
      <p class="notes__desc">함께 일하는 동료들의 짧은 팁이에요.</p>
    </header>

    <form class="notes__composer" @submit.prevent="handleCreate">
      <label class="sr-only" for="team-note-input">메모 작성</label>
      <textarea
        id="team-note-input"
        v-model="draft"
        class="notes__textarea"
        rows="3"
        :maxlength="NOTE_MAX_LENGTH"
        placeholder="예: 국물이 깔끔하고 음식이 빨리 나와요."
      />
      <div class="notes__composer-foot">
        <p class="notes__count" :class="{ 'notes__count--warn': charCount >= NOTE_MAX_LENGTH }">
          {{ charCount }} / {{ NOTE_MAX_LENGTH }}
        </p>
        <button
          type="submit"
          class="notes__submit"
          :disabled="!canSubmit || charCount > NOTE_MAX_LENGTH"
        >
          {{ isSaving && !editingId ? '등록 중...' : '등록' }}
        </button>
      </div>
    </form>

    <p v-if="errorMessage" class="notes__error" role="alert">{{ errorMessage }}</p>

    <p v-if="!notes.length" class="notes__empty">아직 메모가 없어요. 첫 한줄을 남겨보세요.</p>

    <ul v-else class="notes__list">
      <li v-for="note in notes" :key="note.id" class="notes__item">
        <div class="notes__item-top">
          <p class="notes__author">{{ note.authorName }}</p>
          <p class="notes__time">
            {{ formatNoteTime(note.updatedAt || note.createdAt) }}
            <span v-if="note.updatedAt" class="notes__edited">(수정됨)</span>
          </p>
        </div>

        <template v-if="editingId === note.id">
          <textarea
            v-model="editDraft"
            class="notes__textarea notes__textarea--edit"
            rows="3"
            :maxlength="NOTE_MAX_LENGTH"
          />
          <div class="notes__composer-foot">
            <p
              class="notes__count"
              :class="{ 'notes__count--warn': editCharCount >= NOTE_MAX_LENGTH }"
            >
              {{ editCharCount }} / {{ NOTE_MAX_LENGTH }}
            </p>
            <div class="notes__edit-actions">
              <button type="button" class="notes__text-btn" @click="cancelEdit">취소</button>
              <button
                type="button"
                class="notes__submit"
                :disabled="!editDraft.trim() || isSaving"
                @click="handleUpdate(note.id)"
              >
                저장
              </button>
            </div>
          </div>
        </template>

        <template v-else>
          <p class="notes__content">{{ note.content }}</p>
          <div v-if="isMine(note)" class="notes__actions">
            <button type="button" class="notes__text-btn" @click="startEdit(note)">수정</button>
            <button type="button" class="notes__text-btn notes__text-btn--danger" @click="handleDelete(note)">
              삭제
            </button>
          </div>
        </template>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.notes {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
  padding: 1.15rem 1.1rem 1.25rem;
  background: #ffffff;
  border: 1px solid #efe8e3;
  border-radius: 22px;
  box-shadow: 0 1px 2px rgb(0 0 0 / 0.03);
}

.notes__title {
  font-size: 1.0625rem;
  font-weight: 800;
  letter-spacing: -0.025em;
}

.notes__desc {
  margin-top: 0.2rem;
  font-size: 0.8125rem;
  color: #8a847e;
}

.notes__composer {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.notes__textarea {
  width: 100%;
  padding: 0.85rem 0.95rem;
  font: inherit;
  font-size: 0.875rem;
  line-height: 1.45;
  color: #1d1d1f;
  background: #fbf7f2;
  border: 1px solid #efe8e3;
  border-radius: 14px;
  resize: vertical;
  outline: none;
}

.notes__textarea:focus {
  background: #fff;
  border-color: rgb(255 122 0 / 0.45);
}

.notes__textarea--edit {
  margin-top: 0.45rem;
}

.notes__composer-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.notes__count {
  font-size: 0.75rem;
  color: #8a847e;
}

.notes__count--warn {
  color: #ff7a00;
  font-weight: 700;
}

.notes__submit {
  min-height: 2.125rem;
  padding: 0 0.9rem;
  font: inherit;
  font-size: 0.8125rem;
  font-weight: 700;
  color: #fff;
  background: #ff7a00;
  border: none;
  border-radius: 12px;
}

.notes__submit:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.notes__error {
  margin: 0;
  font-size: 0.8125rem;
  color: #ff3b30;
}

.notes__empty {
  padding: 0.35rem 0 0;
  text-align: center;
  font-size: 0.8125rem;
  color: #8a847e;
}

.notes__list {
  display: flex;
  flex-direction: column;
  gap: 0;
  margin: 0;
  padding: 0;
  list-style: none;
}

.notes__item {
  padding: 0.85rem 0;
  border-top: 1px solid #f0ebe6;
}

.notes__item:first-child {
  padding-top: 0.35rem;
  border-top: none;
}

.notes__item-top {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.5rem;
}

.notes__author {
  font-size: 0.8125rem;
  font-weight: 700;
  color: #1d1d1f;
}

.notes__time {
  font-size: 0.75rem;
  color: #8a847e;
}

.notes__edited {
  margin-left: 0.15rem;
}

.notes__content {
  margin-top: 0.35rem;
  font-size: 0.875rem;
  line-height: 1.5;
  color: #4a4a4f;
  white-space: pre-wrap;
  word-break: break-word;
}

.notes__actions,
.notes__edit-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.65rem;
  margin-top: 0.45rem;
}

.notes__text-btn {
  padding: 0;
  font: inherit;
  font-size: 0.75rem;
  font-weight: 600;
  color: #ff7a00;
  background: transparent;
  border: none;
}

.notes__text-btn--danger {
  color: #ff3b30;
}
</style>
