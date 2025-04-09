<template>
  <v-card class="mb-6 pa-4">
    <v-card-title class="text-h6 font-weight-bold">
      📊 Today's Active Activities
    </v-card-title>

    <v-card-text>
      <v-row>
        <v-col
          v-for="activity in sortedActivities"
          :key="activity._id"
          cols="12"
          sm="6"
          md="4"
        >
          <v-card
            :color="isActive(activity._id) ? 'green lighten-4' : ''"
            outlined
          >
            <v-card-title class="d-flex align-center justify-space-between">
              <span>
                <v-icon left>{{ activity.icon || 'mdi-run' }}</v-icon>
                {{ activity.name }}
              </span>
              <v-tooltip bottom>
                <template #activator="{ props }">
                  <v-icon small color="grey" v-bind="props">
                    mdi-information-outline
                  </v-icon>
                </template>
                <span>{{ activity.description }}</span>
              </v-tooltip>
            </v-card-title>

            <v-card-text class="text-h6 text-center">
              {{ formatTime(getTotalDurationToday(activity._id)) }}
            </v-card-text>

            <v-card-actions class="justify-center">
              <template v-if="isActive(activity._id)">
                <v-btn
                  small
                  color="warning"
                  @click="$emit('pause-toggle', activity._id)"
                >
                  {{ isPaused(activity._id) ? 'Resume' : 'Pause' }}
                </v-btn>
                <v-btn small color="error" @click="$emit('stop', activity._id)">
                  Stop
                </v-btn>
              </template>
              <v-btn
                v-else
                small
                color="primary"
                @click="$emit('start', activity)"
              >
                Resume Activity
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-card-text>

    <v-divider class="my-2"></v-divider>

    <v-card-subtitle class="text-right font-italic">
      Total time today: {{ formatTime(totalTimeToday) }}
    </v-card-subtitle>
  </v-card>
</template>

<script setup>
import { computed } from 'vue';
import { formatTime } from '../utils/time.js';

const props = defineProps({
  activityTypes: Array,
  todayEntries: Array,
  now: Number,
});

// Get all entries today for given activity
const getActiveEntry = (activityId) => {
  return props.todayEntries.find(
    (e) => e.activity === activityId && !e.endTime
  );
};

// Check if activity has running session
const isActive = (activityId) => {
  return !!getActiveEntry(activityId);
};

// Calculate total time today for a given activity
const getTotalDurationToday = (activityId) => {
  return props.todayEntries
    .filter((e) => e.activity === activityId)
    .reduce((sum, entry) => {
      if (entry.endTime && entry.duration != null) {
        return sum + entry.duration * 60;
      } else if (!entry.endTime) {
        return sum + getElapsedTime(entry);
      } else return sum;
    }, 0);
};

// Calculate live running time for active entries
const getElapsedTime = (entry) => {
  const start = new Date(entry.startTime).getTime();
  const nowTime = props.now;

  let paused = 0;
  if (entry.pauses?.length) {
    for (const pause of entry.pauses) {
      const pauseStart = new Date(pause.pauseStart).getTime();
      const pauseEnd = pause.pauseEnd
        ? new Date(pause.pauseEnd).getTime()
        : nowTime;
      paused += pauseEnd - pauseStart;
    }
  }

  return Math.max(0, Math.floor((nowTime - start - paused) / 1000));
};

// Sorted activities by total duration
const sortedActivities = computed(() => {
  return props.activityTypes
    .filter((a) => getTotalDurationToday(a._id) > 0)
    .sort(
      (a, b) => getTotalDurationToday(b._id) - getTotalDurationToday(a._id)
    );
});

// Total time for today (all activities)
const totalTimeToday = computed(() => {
  return props.activityTypes.reduce(
    (sum, a) => sum + getTotalDurationToday(a._id),
    0
  );
});

// Detect if the active entry is currently paused
const isPaused = (activityId) => {
  const entry = getActiveEntry(activityId);
  const pauses = entry?.pauses || [];
  const last = pauses[pauses.length - 1];
  return last && !last.pauseEnd;
};
</script>

<style scoped>
.v-card {
  border-radius: 12px;
}
.v-icon {
  cursor: pointer;
}
</style>
