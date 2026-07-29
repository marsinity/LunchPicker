<script setup>
import { computed, ref } from 'vue'

const model = defineModel({
  type: String,
  default: '',
})

defineProps({
  id: {
    type: String,
    default: undefined,
  },
  label: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: '',
  },
  maxlength: {
    type: Number,
    default: undefined,
  },
  error: {
    type: String,
    default: '',
  },
  required: {
    type: Boolean,
    default: false,
  },
  clearLabel: {
    type: String,
    default: '입력 지우기',
  },
})

const emit = defineEmits(['input'])

const inputRef = ref(null)

const showClear = computed(() => model.value.length > 0)

function clearInput() {
  model.value = ''
  emit('input')
  inputRef.value?.focus()
}
</script>

<template>
  <div class="text-field">
    <label v-if="label" class="text-field__label" :for="id">
      {{ label }}
      <span v-if="required" class="text-field__required" aria-hidden="true">*</span>
    </label>

    <div class="text-field__control" :class="{ 'text-field__control--error': error }">
      <input
        :id="id"
        ref="inputRef"
        v-model="model"
        class="text-field__input"
        type="text"
        :placeholder="placeholder"
        :maxlength="maxlength"
        :aria-invalid="error ? 'true' : undefined"
        @input="emit('input', $event)"
      />

      <button
        v-if="showClear"
        type="button"
        class="text-field__clear"
        :aria-label="clearLabel"
        @click="clearInput"
      >
        <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <circle cx="10" cy="10" r="7.5" fill="currentColor" opacity="0.12" />
          <path
            d="M7 7l6 6M13 7l-6 6"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
          />
        </svg>
      </button>
    </div>

    <p v-if="error" class="text-field__error" role="alert">{{ error }}</p>
  </div>
</template>

<style scoped>
.text-field {
  display: flex;
  flex-direction: column;
}

.text-field__label {
  display: block;
  margin-bottom: 0.6rem;
  font-size: var(--font-size-sm);
  font-weight: 700;
  color: var(--color-text);
  letter-spacing: -0.01em;
}

.text-field__required {
  color: var(--color-brand);
  font-weight: 700;
}

.text-field__control {
  position: relative;
  display: flex;
  align-items: center;
}

.text-field__input {
  width: 100%;
  min-height: 3rem;
  padding: 0 2.5rem 0 0.95rem;
  font: inherit;
  font-size: var(--font-size-sm);
  color: var(--color-text);
  background: #fff;
  border: 1.5px solid #ebe4de;
  border-radius: 14px;
  outline: none;
}

.text-field__input:focus {
  border-color: var(--color-brand);
}

.text-field__control--error .text-field__input {
  border-color: #ff3b30;
}

.text-field__control--error .text-field__input:focus {
  border-color: #ff3b30;
}

.text-field__clear {
  position: absolute;
  right: 0.55rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  padding: 0;
  color: var(--color-text-muted);
  background: transparent;
  border: none;
  border-radius: var(--radius-full);
  transition: color 0.15s ease, transform 0.12s ease;
}

.text-field__clear:active {
  transform: scale(0.94);
}

.text-field__clear svg {
  width: 1.25rem;
  height: 1.25rem;
}

.text-field__error {
  margin: 0.4rem 0 0;
  font-size: 12px;
  color: #ff3b30;
  line-height: 1.4;
}
</style>
