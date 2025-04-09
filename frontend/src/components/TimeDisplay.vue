<template>
  <div>
    <span v-if="elapsedSeconds >= 0">⏱️ {{ formatted }}</span>
    <span v-else>–</span>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  entry: {
    type: Object,
    required: true,
  },
  now: {
    type: Number,
    required: true,
  },
});

// Compute total time considering pauses
const elapsedSeconds = computed(() => {
  if (!props.entry?.startTime) return -1;

  const start = new Date(props.entry.startTime).getTime();
  const now = props.now;

  let totalPaused = 0;

  if (props.entry.pauses?.length) {
    for (const pause of props.entry.pauses) {
      const pauseStart = new Date(pause.pauseStart).getTime();
      const pauseEnd = pause.pauseEnd
        ? new Date(pause.pauseEnd).getTime()
        : now;

      if (!isNaN(pauseStart) && !isNaN(pauseEnd)) {
        totalPaused += pauseEnd - pauseStart;
      }
    }
  }

  return Math.max(0, Math.floor((now - start - totalPaused) / 1000));
});

// Format time HH:MM:SS
const formatted = computed(() => {
  const sec = elapsedSeconds.value;
  if (sec < 0) return '–';

  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;

  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s
    .toString()
    .padStart(2, '0')}`;
});
</script>

<style scoped>
span {
  font-weight: bold;
  font-size: 1.2em;
}
</style>
