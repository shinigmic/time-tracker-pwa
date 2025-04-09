<template>
  <v-app>
    <v-main>
      <v-container>
        <v-card-title class="headline text-center">
          Today’s Activity Overview
        </v-card-title>

        <v-alert
          v-if="error"
          type="error"
          dense
          outlined
          class="mb-4 text-center"
        >
          {{ error }}
        </v-alert>

        <!-- Top: Currently running or last paused activity -->
        <CurrentActivity
          :today-entries="todayEntries"
          :activity-types="activityTypes"
          :now="now"
          @stop="stopActivity"
          @pause-toggle="togglePause"
        />

        <!-- Middle: Today's active sessions (sorted by time spent) -->
        <TodayActiveList
          :activity-types="activityTypes"
          :today-entries="todayEntries"
          :now="now"
          :current-entries="currentEntries"
          @start="startActivity"
          @pause-toggle="togglePause"
          @stop="stopActivity"
        />

        <!-- Bottom: Inactive activities (not started today)-->
        <TodayInactiveList
          :today-entries="todayEntries"
          :activity-types="activityTypes"
          @start="startActivity"
        />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

import CurrentActivity from '../components/CurrentActivity.vue';
import TodayActiveList from '../components/TodayActiveList.vue';
import TodayInactiveList from '../components/TodayInactiveList.vue';

const activityTypes = ref([]);
const currentEntries = ref({});
const error = ref(null);
const now = ref(Date.now());
const todayEntries = ref([]);

let intervalId = null;

// Fetch user-defined activity types
const fetchActivities = async () => {
  try {
    const res = await fetch('http://localhost:3000/activity-types', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    activityTypes.value = await res.json();
  } catch (err) {
    error.value = 'Failed to fetch activity types.';
    console.error(err);
  }
};

// Fetch all ongoing/unfinished activity sessions
const fetchCurrentEntries = async () => {
  try {
    const res = await fetch('http://localhost:3000/time-entries/current', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    const data = await res.json();
    data.forEach((entry) => {
      currentEntries.value[entry.activity] = entry;
    });
  } catch (err) {
    error.value = 'Failed to fetch current entries.';
    console.error(err);
  }
};

// Stop an active activity
const stopActivity = async (activityId) => {
  const entry = todayEntries.value.find(
    (e) => e.activity === activityId && !e.endTime
  );
  if (!entry) return;

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
    await res.json();
    await fetchTodayEntries();
  } catch (err) {
    error.value = 'Failed to stop activity.';
    console.error(err);
  }
};

// Toggle pause or resume for an activity
const togglePause = async (activityId) => {
  const entry = todayEntries.value.find(
    (e) => e.activity === activityId && !e.endTime
  );
  if (!entry) return;

  const isPaused = entry.pauses?.length
    ? !entry.pauses[entry.pauses.length - 1].pauseEnd
    : false;

  const endpoint = isPaused ? 'pause-end' : 'pause-start';

  try {
    await fetch(`http://localhost:3000/time-entries/${entry._id}/${endpoint}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    await fetchTodayEntries(); // ⚠️ Не забувай оновити todayEntries
  } catch (err) {
    error.value = 'Failed to toggle pause';
    console.error(err);
  }
};

// Start a new activity — stops the previous one if necessary
const startActivity = async (activity) => {
  const activeEntry = todayEntries.value.find((e) => !e.endTime);
  if (activeEntry) {
    await stopActivity(activeEntry.activity); // зупиняємо поточну
  }

  try {
    await fetch('http://localhost:3000/time-entries', {
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

    await fetchTodayEntries(); // оновлюємо список
  } catch (err) {
    error.value = 'Failed to start new activity';
    console.error(err);
  }
};

const fetchTodayEntries = async () => {
  try {
    const res = await fetch('http://localhost:3000/time-entries/today', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    todayEntries.value = await res.json();
  } catch (err) {
    error.value = "Failed to fetch today's entries.";
  }
};

// Start ticking now every second
onMounted(async () => {
  await fetchActivities();
  await fetchCurrentEntries();
  await fetchTodayEntries();
  intervalId = setInterval(() => {
    now.value = Date.now();
  }, 1000);
});

onUnmounted(() => {
  clearInterval(intervalId);
});
</script>

<style scoped>
.text-center {
  text-align: center;
}
.mb-4 {
  margin-bottom: 16px;
}
</style>
