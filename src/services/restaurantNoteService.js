import { MOCK_USER } from '@/data/mockUser'

const STORAGE_KEY = 'lunchpicker-restaurant-notes'
export const NOTE_MAX_LENGTH = 150

function readStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : {}
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

function writeStore(store) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
}

function sortNewestFirst(notes) {
  return [...notes].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
}

/**
 * 우리 팀 한줄 메모 (식당별, localStorage)
 * 공개 리뷰가 아니라 그룹 공유 메모입니다.
 */
export const restaurantNoteService = {
  async getByRestaurantId(restaurantId) {
    if (!restaurantId) return []
    const store = readStore()
    const notes = Array.isArray(store[restaurantId]) ? store[restaurantId] : []
    return sortNewestFirst(notes)
  },

  async create(restaurantId, rawContent) {
    const content = String(rawContent ?? '').trim()

    if (!content) {
      throw new Error('EMPTY')
    }
    if (content.length > NOTE_MAX_LENGTH) {
      throw new Error('TOO_LONG')
    }

    const store = readStore()
    const list = Array.isArray(store[restaurantId]) ? store[restaurantId] : []
    const now = new Date().toISOString()

    const note = {
      id: `note-${Date.now()}`,
      restaurantId,
      authorId: MOCK_USER.id,
      authorName: MOCK_USER.name,
      content,
      createdAt: now,
      updatedAt: null,
    }

    store[restaurantId] = [note, ...list]
    writeStore(store)
    return note
  },

  async update(restaurantId, noteId, rawContent) {
    const content = String(rawContent ?? '').trim()

    if (!content) {
      throw new Error('EMPTY')
    }
    if (content.length > NOTE_MAX_LENGTH) {
      throw new Error('TOO_LONG')
    }

    const store = readStore()
    const list = Array.isArray(store[restaurantId]) ? store[restaurantId] : []
    const index = list.findIndex((item) => item.id === noteId)

    if (index < 0) {
      throw new Error('NOT_FOUND')
    }

    const target = list[index]
    if (target.authorId !== MOCK_USER.id) {
      throw new Error('FORBIDDEN')
    }

    list[index] = {
      ...target,
      content,
      updatedAt: new Date().toISOString(),
    }

    store[restaurantId] = list
    writeStore(store)
    return list[index]
  },

  async remove(restaurantId, noteId) {
    const store = readStore()
    const list = Array.isArray(store[restaurantId]) ? store[restaurantId] : []
    const target = list.find((item) => item.id === noteId)

    if (!target) return false
    if (target.authorId !== MOCK_USER.id) {
      throw new Error('FORBIDDEN')
    }

    store[restaurantId] = list.filter((item) => item.id !== noteId)
    writeStore(store)
    return true
  },

  async clearByRestaurantId(restaurantId) {
    const store = readStore()
    if (!store[restaurantId]) return
    delete store[restaurantId]
    writeStore(store)
  },
}

export function formatNoteTime(iso) {
  try {
    return new Intl.DateTimeFormat('ko-KR', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(iso))
  } catch {
    return iso
  }
}
