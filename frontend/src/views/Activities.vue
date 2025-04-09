<template>
  <v-app>
    <v-main>
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-card-title class="headline">My Today Activities</v-card-title>
            <v-alert v-if="error" type="error" dense outlined>
              {{ error }}
            </v-alert>
          </v-col>

          <v-col
            v-for="activity in activityTypes"
            :key="activity._id"
            cols="12"
            sm="6"
            md="4"
          >
            <v-card>
              <v-card-title>
                <v-icon left>{{ activity.icon || 'mdi-run' }}</v-icon>
                {{ activity.name }}
              </v-card-title>
              <v-card-subtitle>{{ activity.description }}</v-card-subtitle>

              <v-card-text v-if="isRunning(activity)">
                ⏱️ {{ formatTime(getElapsedTime(activity._id)) }}
              </v-card-text>

              <v-card-actions>
                <v-btn
                  color="success"
                  @click="startActivity(activity)"
                  :disabled="isRunning(activity)"
                >
                  Start
                </v-btn>
                <v-btn
                  color="warning"
                  @click="togglePause(activity)"
                  :disabled="!isRunning(activity)"
                >
                  {{ isPaused(activity._id) ? 'Resume' : 'Pause' }}
                </v-btn>
                <v-btn
                  color="error"
                  @click="stopActivity(activity)"
                  :disabled="!isRunning(activity)"
                >
                  Stop
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const activityTypes = ref([]);
const currentEntries = ref({});
const error = ref(null);
const now = ref(Date.now());

let intervalId = null;

const fetchActivities = async () => {
  try {
    const res = await fetch('http://localhost:3000/activity-types', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    activityTypes.value = await res.json();
  } catch (err) {
    error.value = 'Failed to fetch activities';
    console.error(err);
  }
};

const fetchCurrentEntries = async () => {
  try {
    const res = await fetch('http://localhost:3000/time-entries/current', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    const data = await res.json();
    data.forEach((entry) => {
      currentEntries.value[entry.activity] = entry;
    });
  } catch (err) {
    error.value = 'Failed to fetch active entries';
    console.error(err);
  }
};

const startActivity = async (activity) => {
  try {
    const res = await fetch('http://localhost:3000/time-entries', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        activity: activity._id,
        startTime: new Date(),
      }),
    });
    const data = await res.json();
    currentEntries.value[activity._id] = data;
  } catch (err) {
    error.value = 'Failed to start activity';
    console.error(err);
  }
};

const togglePause = async (activity) => {
  const entry = currentEntries.value[activity._id];
  if (!entry || entry.endTime) return;

  try {
    const endpoint = isPaused(activity._id) ? `pause-end` : `pause-start`;

    const res = await fetch(
      `http://localhost:3000/time-entries/${entry._id}/${endpoint}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );

    const updated = await res.json();

    setTimeout(() => {
      currentEntries.value[activity._id] = updated;
    }, 10);
  } catch (err) {
    error.value = 'Failed to toggle pause';
    console.error(err);
  }
};

const stopActivity = async (activity) => {
  const entry = currentEntries.value[activity._id];
  if (!entry || entry.endTime) return;

  try {
    const res = await fetch(
      `http://localhost:3000/time-entries/${entry._id}/stop`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );
    const data = await res.json();
    currentEntries.value[activity._id] = data;
  } catch (err) {
    error.value = 'Failed to stop activity';
    console.error(err);
  }
};

const isRunning = (activity) => {
  const entry = currentEntries.value[activity._id];
  return entry && !entry.endTime;
};

const isPaused = (activityId) => {
  const entry = currentEntries.value[activityId];
  if (!entry?.pauses?.length) return false;

  const lastPause = entry.pauses[entry.pauses.length - 1];
  return lastPause && !lastPause.pauseEnd;
};

const getElapsedTime = (activityId) => {
  const entry = currentEntries.value[activityId];
  if (!entry?.startTime) return 0;

  const start = new Date(entry.startTime).getTime();
  const nowTime = now.value;

  let totalPaused = 0;
  if (entry.pauses?.length) {
    for (const pause of entry.pauses) {
      const pauseStart = new Date(pause.pauseStart).getTime();
      const pauseEnd = pause.pauseEnd
        ? new Date(pause.pauseEnd).getTime()
        : nowTime;
      totalPaused += pauseEnd - pauseStart;
    }
  }

  return Math.max(0, Math.floor((nowTime - start - totalPaused) / 1000)); // 🔧 захист від -1
};

const formatTime = (seconds) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s
    .toString()
    .padStart(2, '0')}`;
};

onMounted(async () => {
  await fetchActivities();
  await fetchCurrentEntries();

  intervalId = setInterval(() => {
    now.value = Date.now();
  }, 1000);
});

onUnmounted(() => {
  clearInterval(intervalId);
});
</script>

<style scoped>
.v-card {
  margin-bottom: 16px;
}
</style>
