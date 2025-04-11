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
              class="mr-2 text-white"
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

            <v-btn
              class="text-white"
              :style="{
                backgroundColor: '#616161',
                height: '38px',
                borderRadius: '8px',
                boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)',
              }"
              @click="confirmDialog = true"
            >
              Delete
            </v-btn>
          </v-row>

          <!-- Confirm Deletion Dialog -->
          <v-dialog v-model="confirmDialog" max-width="400">
            <v-card>
              <v-card-title class="text-h6"
                >Delete Current Activity?</v-card-title
              >
              <v-card-text>
                <p>
                  <v-icon left>{{ currentActivity.icon || 'mdi-run' }}</v-icon>
                  <strong>{{ currentActivity.name }}</strong
                  ><br />
                  Are you sure you want to delete this time entry?
                </p>
              </v-card-text>
              <v-card-actions class="justify-end">
                <v-btn text @click="confirmDialog = false">Cancel</v-btn>
                <v-btn color="error" @click="deleteCurrentEntry">Delete</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import TimeDisplay from './TimeDisplay.vue';

const props = defineProps({
  todayEntries: Array,
  activityTypes: Array,
  now: Number,
});

const emit = defineEmits(['entry-deleted']);

const confirmDialog = ref(false);

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

const deleteCurrentEntry = async () => {
  if (!activeEntry.value) return;

  try {
    const res = await fetch(
      `http://localhost:3000/time-entries/${activeEntry.value._id}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );

    if (!res.ok) {
      console.error('Failed to delete time entry');
      return;
    }

    confirmDialog.value = false;
    emit('entry-deleted');
  } catch (err) {
    console.error('Error deleting time entry:', err);
  }
};
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
.v-card-title {
  font-weight: bold;
}
.v-card-text {
  font-size: 14px;
}
.delete-btn {
  background-color: rgba(255, 255, 255, 0.15);
  color: white;
  border-radius: 50%;
  transition: background-color 0.2s ease;
}

.delete-btn:hover {
  background-color: rgba(255, 255, 255, 0.3);
}
</style>
