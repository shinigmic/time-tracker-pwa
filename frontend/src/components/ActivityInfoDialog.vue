<template>
  <v-dialog v-model="model" max-width="420">
    <v-card class="info-dialog-card">
      <v-card-title class="info-dialog-title">
        <div class="info-header d-flex align-center">
          <v-icon class="info-icon" :color="iconColor" v-if="icon">
            {{ icon }}
          </v-icon>
          <span class="info-title-text">{{ title }}</span>
        </div>
      </v-card-title>

      <v-card-text class="info-dialog-text">
        {{ description }}
      </v-card-text>

      <v-card-actions class="justify-end px-4 pb-4">
        <v-btn text class="info-dialog-close" @click="model = false">
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  modelValue: Boolean,
  title: String,
  description: String,
  icon: String,
  iconColor: String,
});

const emit = defineEmits(['update:modelValue']);
const model = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
});
</script>

<style scoped>
.info-dialog-card {
  border-radius: 12px;
  background-color: #ffffff;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  padding-top: 8px;
}

.info-dialog-title {
  padding: 16px 24px 8px;
  color: #1e1e1e;
}

.info-header {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.info-icon {
  font-size: 28px;
  margin-top: 2px;
}

.info-title-text {
  font-size: 1.25rem;
  font-weight: 600;
  line-height: 1.3;
  white-space: normal;
  word-break: break-word;
  flex: 1;
  margin-top: 4px;
}

.info-dialog-text {
  font-size: 1rem;
  line-height: 1.6;
  padding: 8px 24px;
  color: #444;
  white-space: pre-line;
}

.info-dialog-close {
  color: #1976d2;
  font-weight: 500;
  font-size: 14px;
  text-transform: none;
}
</style>
