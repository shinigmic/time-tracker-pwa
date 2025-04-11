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
            class="activity-card"
            :style="{
              borderLeft:
                '6px solid ' +
                (isActive(activity._id) ? '#5ac15f' : activity.color),
            }"
            :color="isActive(activity._id) ? '#5ac15f' : ''"
          >
            <v-card-title class="d-flex align-center justify-space-between">
              <span class="d-flex align-center">
                <v-icon
                  class="mr-2"
                  :color="isActive(activity._id) ? '#fff' : activity.color"
                >
                  {{ activity.icon || 'mdi-run' }}
                </v-icon>
                <span
                  class="font-weight-bold text-subtitle-1"
                  :style="{ color: isActive(activity._id) ? 'white' : 'black' }"
                >
                  {{ activity.name }}
                </span>
              </span>

              <v-tooltip bottom>
                <template #activator="{ props }">
                  <v-icon
                    small
                    :color="isActive(activity._id) ? '#fff' : 'grey'"
                    v-bind="props"
                  >
                    mdi-information-outline
                  </v-icon>
                </template>
                <span>{{ activity.description }}</span>
              </v-tooltip>
            </v-card-title>

            <v-card-text
              class="text-h5 text-center font-weight-bold"
              :style="{ color: isActive(activity._id) ? 'white' : '#212121' }"
            >
              {{ formatTime(getTotalDurationToday(activity._id)) }}
            </v-card-text>

            <v-card-actions class="justify-center">
              <template v-if="isActive(activity._id)">
                <v-btn
                  class="mr-2 text-white"
                  :style="{
                    backgroundColor: '#f9b24d',
                    minWidth: '100px',
                    height: '38px',
                    borderRadius: '8px',
                    boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)',
                  }"
                  @click="$emit('pause-toggle', activity._id)"
                >
                  {{ isPaused(activity._id) ? 'Resume' : 'Pause' }}
                </v-btn>

                <v-btn
                  class="text-white"
                  :style="{
                    backgroundColor: '#f86e6e',
                    minWidth: '100px',
                    height: '38px',
                    borderRadius: '8px',
                    boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)',
                  }"
                  @click="$emit('stop', activity._id)"
                >
                  Stop
                </v-btn>
              </template>

              <v-btn
                v-else
                variant="outlined"
                color="primary"
                min-width="140"
                class="font-weight-medium"
                rounded
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

const getActiveEntry = (activityId) => {
  return props.todayEntries.find(
    (e) => e.activity === activityId && !e.endTime
  );
};

const isActive = (activityId) => {
  return !!getActiveEntry(activityId);
};

const isPaused = (activityId) => {
  const entry = getActiveEntry(activityId);
  const pauses = entry?.pauses || [];
  const last = pauses[pauses.length - 1];
  return last && !last.pauseEnd;
};

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

const sortedActivities = computed(() => {
  return props.activityTypes
    .filter((a) => getTotalDurationToday(a._id) > 0)
    .sort(
      (a, b) => getTotalDurationToday(b._id) - getTotalDurationToday(a._id)
    );
});

const totalTimeToday = computed(() => {
  return props.activityTypes.reduce(
    (sum, a) => sum + getTotalDurationToday(a._id),
    0
  );
});
</script>

<style scoped>
.activity-card {
  border-radius: 12px;
  transition: transform 0.2s ease, box-shadow 0.3s ease;
  background-color: #fafafa;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  border-left: 6px solid var(--accent-color, #5ac15f);
}
.activity-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(134, 67, 67, 0.15);
}
.text-white {
  color: white;
}
.v-btn {
  min-width: 110px;
  text-transform: none;
  font-size: 16px;
  border-radius: 8px;
}
</style>
