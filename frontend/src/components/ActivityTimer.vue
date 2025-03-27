<template>
  <div class="timer-container">
    <h1>{{ formattedTime }}</h1>
    <div class="controls">
      <button @click="start" :disabled="isRunning">Start</button>
      <button @click="pause" :disabled="!isRunning">Pause</button>
      <button @click="stop">Stop</button>
    </div>
  </div>
</template>

<script>
import { ref, computed, onUnmounted } from 'vue';

export default {
  name: 'ActivityTimer',
  setup() {
    const elapsed = ref(0); // Total elapsed seconds
    const isRunning = ref(false); // Timer running status
    let interval = null;

    // Function to start the timer
    const start = () => {
      if (!isRunning.value) {
        isRunning.value = true;
        interval = setInterval(() => {
          elapsed.value += 1;
        }, 1000);
      }
    };

    // Function to pause the timer
    const pause = () => {
      if (isRunning.value) {
        clearInterval(interval);
        isRunning.value = false;
      }
    };

    // Function to stop the timer and reset the time
    const stop = () => {
      clearInterval(interval);
      elapsed.value = 0;
      isRunning.value = false;
    };

    // Cleanup the interval when the component is unmounted
    onUnmounted(() => {
      clearInterval(interval);
    });

    // Compute formatted time in HH:MM:SS format
    const formattedTime = computed(() => {
      const seconds = elapsed.value % 60;
      const minutes = Math.floor(elapsed.value / 60) % 60;
      const hours = Math.floor(elapsed.value / 3600);
      return `${hours.toString().padStart(2, '0')}:${minutes
        .toString()
        .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    });

    return {
      formattedTime,
      isRunning,
      start,
      pause,
      stop,
    };
  },
};
</script>

<style scoped>
.timer-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
}

.controls {
  margin-top: 20px;
}

button {
  margin: 0 5px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
}
</style>
