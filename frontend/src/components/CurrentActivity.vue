<template>
  <div v-if="currentActivity">
    <v-card color="success lighten-1" class="mb-5 pa-5">
      <v-row align="center" justify="space-between">
        <!-- Left side: icon, name, info tooltip -->
        <v-col cols="12" sm="6">
          <v-row align="center" no-gutters>
            <v-icon class="mr-2" size="50">
              {{ currentActivity.icon || 'mdi-run' }}
            </v-icon>
            <span class="text-h5 font-weight-bold">{{
              currentActivity.name
            }}</span>

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

          <div class="mt-2 text-subtitle-2 text-white">Active session</div>
        </v-col>

        <!-- Right side: timer and controls -->
        <v-col cols="12" sm="6" class="text-sm-right text-center">
          <div class="text-h4 font-weight-bold">
            <TimeDisplay :entry="activeEntry" :now="now" />
          </div>

          <v-row class="mt-2" justify="end">
            <v-btn
              class="mr-2"
              color="warning"
              @click="$emit('pause-toggle', currentActivity._id)"
            >
              {{ isPaused ? 'Resume' : 'Pause' }}
            </v-btn>

            <v-btn color="error" @click="$emit('stop', currentActivity._id)">
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

// Get the active entry (not ended)
const activeEntry = computed(
  () => props.todayEntries.find((e) => !e.endTime) || null
);

// Get activity info for the current entry
const currentActivity = computed(() => {
  if (!activeEntry.value) return null;
  return props.activityTypes.find((a) => a._id === activeEntry.value.activity);
});

// Detect if the active entry is currently paused
const isPaused = computed(() => {
  const pauses = activeEntry.value?.pauses || [];
  const last = pauses[pauses.length - 1];
  return last && !last.pauseEnd;
});
</script>

<style scoped>
.mb-4 {
  margin-bottom: 24px;
}
.text-sm-right {
  text-align: right;
}
.text-white {
  color: white;
}
</style>
