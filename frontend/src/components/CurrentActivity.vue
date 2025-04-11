<template>
  <div v-if="currentActivity">
    <v-card
      class="activity-card pa-6 mb-6"
      :style="{ backgroundColor: '#5ac15f' }"
      dark
    >
      <v-row align="center" justify="space-between">
        <!-- Left side: icon, name, tooltip -->
        <v-col cols="12" sm="6">
          <v-row align="center" no-gutters>
            <v-icon class="mr-3 text-white" size="50">
              {{ currentActivity.icon || 'mdi-run' }}
            </v-icon>

            <span class="text-h5 font-weight-bold text-white">
              {{ currentActivity.name }}
            </span>

            <v-tooltip bottom>
              <template #activator="{ props }">
                <v-icon
                  v-bind="props"
                  class="ml-2"
                  size="20"
                  color="white"
                  style="cursor: pointer"
                >
                  mdi-information-outline
                </v-icon>
              </template>
              <span>{{ currentActivity.description }}</span>
            </v-tooltip>
          </v-row>

          <div class="mt-2 text-subtitle-2 text-white font-italic">
            Active session
          </div>
        </v-col>

        <!-- Right side: timer and controls -->
        <v-col cols="12" sm="6" class="text-sm-right text-center">
          <div class="text-h4 font-weight-bold text-white">
            <TimeDisplay :entry="activeEntry" :now="now" />
          </div>

          <v-row class="mt-2" justify="end">
            <v-btn
              class="mr-2 text-white"
              :style="{
                backgroundColor: '#f9b24d',
                height: '38px',
                borderRadius: '8px',
                boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)',
              }"
              @click="$emit('pause-toggle', currentActivity._id)"
            >
              {{ isPaused ? 'Resume' : 'Pause' }}
            </v-btn>

            <v-btn
              color="error"
              :style="{
                backgroundColor: '#f86e6e',
                height: '38px',
                borderRadius: '8px',
                boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)',
              }"
              @click="$emit('stop', currentActivity._id)"
            >
              Stop
            </v-btn>
          </v-row>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import TimeDisplay from './TimeDisplay.vue';

const props = defineProps({
  todayEntries: Array,
  activityTypes: Array,
  now: Number,
});

const activeEntry = computed(
  () => props.todayEntries.find((e) => !e.endTime) || null
);

const currentActivity = computed(() => {
  if (!activeEntry.value) return null;
  return props.activityTypes.find((a) => a._id === activeEntry.value.activity);
});

const isPaused = computed(() => {
  const pauses = activeEntry.value?.pauses || [];
  const last = pauses[pauses.length - 1];
  return last && !last.pauseEnd;
});
</script>

<style scoped>
.activity-card {
  border-radius: 16px;
  box-shadow: 0 2px 6px #5ac15f;
  transition: transform 0.2s ease, box-shadow 0.3s ease;
}
.activity-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 16px #5ac15f;
}
.text-sm-right {
  text-align: right;
}
.text-white {
  color: white;
}
.mb-4 {
  margin-bottom: 24px;
}
</style>
