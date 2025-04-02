<template>
  <div class="activities-container">
    <div v-for="(activity, index) in activities" :key="index" class="activity">
      <h2>{{ activity.name }}</h2>
      <p>{{ formatTime(activity.elapsed) }}</p>
      <div class="controls">
        <button @click="startTimer(index)" :disabled="activity.isRunning">
          Start
        </button>
        <button @click="pauseTimer(index)" :disabled="!activity.isRunning">
          Pause
        </button>
        <button @click="stopTimer(index)">Stop</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onUnmounted } from 'vue';

export default {
  name: 'ActivityTimer',
  setup() {
    // Array of activities with basic fields
    const activities = ref([
      { name: 'Work', elapsed: 0, isRunning: false, interval: null },
      { name: 'Rest', elapsed: 0, isRunning: false, interval: null },
      { name: 'Reading', elapsed: 0, isRunning: false, interval: null },
      { name: 'Meditation', elapsed: 0, isRunning: false, interval: null },
      { name: 'House Chores', elapsed: 0, isRunning: false, interval: null },
      { name: 'Other', elapsed: 0, isRunning: false, interval: null },
    ]);

    // Function to start a specific activity timer
    const startTimer = (index) => {
      const activity = activities.value[index];
      if (!activity.isRunning) {
        activity.isRunning = true;
        activity.interval = setInterval(() => {
          activity.elapsed += 1;
        }, 1000);
      }
    };

    // Function to pause a specific activity timer
    const pauseTimer = (index) => {
      const activity = activities.value[index];
      if (activity.isRunning) {
        clearInterval(activity.interval);
        activity.isRunning = false;
      }
    };

    // Function to stop and reset a specific activity timer
    const stopTimer = (index) => {
      const activity = activities.value[index];
      clearInterval(activity.interval);
      activity.elapsed = 0;
      activity.isRunning = false;
    };

    // Cleanup intervals for all activities on unmount
    onUnmounted(() => {
      activities.value.forEach((act) => {
        clearInterval(act.interval);
      });
    });

    // Helper function to format elapsed time as HH:MM:SS
    const formatTime = (seconds) => {
      const s = seconds % 60;
      const m = Math.floor(seconds / 60) % 60;
      const h = Math.floor(seconds / 3600);
      return `${h.toString().padStart(2, '0')}:${m
        .toString()
        .padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    return {
      activities,
      startTimer,
      pauseTimer,
      stopTimer,
      formatTime,
    };
  },
};
</script>

<style scoped>
.activities-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding-top: env(safe-area-inset-top); /* додатковий відступ зверху */
  padding-bottom: env(
    safe-area-inset-bottom
  ); /* відступ знизу, якщо потрібно */
}

.activity {
  text-align: center;
  margin-bottom: 20px;
}

.controls {
  margin-top: 10px;
}

button {
  margin: 0 5px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
}
</style>
