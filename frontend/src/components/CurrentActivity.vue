<template>
  <div v-if="currentActivity">
    <v-card
      class="activity-card pa-6 mb-6"
      :style="{ backgroundColor: '#5ac15f' }"
      dark
    >
      <v-row align="center" justify="space-between">
        <!-- Left side: icon, name -->
        <v-col cols="12" sm="6">
          <v-row align="center" no-gutters>
            <v-icon class="mr-3 text-white" size="50">
              {{ currentActivity.icon || 'mdi-run' }}
            </v-icon>
            <span class="text-h5 font-weight-bold text-white activity-name">{{
              currentActivity.name
            }}</span>
            <v-icon
              class="ml-2"
              size="20"
              color="white"
              style="cursor: pointer"
              @click="dialogVisible = true"
            >
              mdi-information-outline
            </v-icon>

            <ActivityInfoDialog
              v-model="dialogVisible"
              v-if="currentActivity"
              :title="currentActivity.name"
              :description="currentActivity.description"
              :icon="currentActivity.icon"
            />
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
          <v-row class="mt-2 action-row" justify="end">
            <v-btn
              class="action-btn text-white"
              :style="btnStyles.warning"
              @click="$emit('pause-toggle', currentActivity._id)"
            >
              {{ isPaused ? 'Resume' : 'Pause' }}
            </v-btn>
            <v-btn
              class="action-btn text-white"
              :style="btnStyles.error"
              @click="$emit('stop', currentActivity._id)"
            >
              Stop
            </v-btn>
            <v-btn
              class="action-btn text-white"
              :style="btnStyles.edit"
              @click="editDialog = true"
            >
              Edit
            </v-btn>
          </v-row>
        </v-col>
      </v-row>
    </v-card>

    <!-- Edit dialog -->
    <v-dialog v-model="editDialog" max-width="600">
      <v-card>
        <v-card-title class="text-h6">Edit Current Activity</v-card-title>
        <v-card-text>
          <v-select
            v-model="form.activity"
            :items="activityTypes"
            item-title="name"
            item-value="_id"
            label="Activity"
            density="comfortable"
          />

          <DateTimePicker
            v-model:startTime="form.startTime"
            v-model:endTime="form.endTime"
            start-label="Start Time"
            end-label="End Time (optional)"
          />

          <v-text-field
            v-model="form.duration"
            label="Or set duration (min)"
            type="number"
            density="comfortable"
          />
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn text @click="editDialog = false">Cancel</v-btn>
          <v-btn color="error" @click="confirmDialog = true">Delete</v-btn>
          <v-btn color="primary" @click="saveEdit">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Confirm Deletion Dialog -->
    <v-dialog v-model="confirmDialog" max-width="400">
      <v-card>
        <v-card-title class="text-h6">Delete Current Activity?</v-card-title>
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
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import TimeDisplay from './TimeDisplay.vue';
import DateTimePicker from './DateTimePicker.vue';
import { reactive } from 'vue';
const api = import.meta.env.VITE_API_BASE;

const props = defineProps({
  todayEntries: Array,
  activityTypes: Array,
  now: Number,
});

import ActivityInfoDialog from './ActivityInfoDialog.vue';

const visibleDialogId = ref(null);
const dialogVisible = ref(false);

const emit = defineEmits(['entry-deleted', 'entry-updated']);
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

const editDialog = ref(false);
const form = reactive({
  activity: '',
  startTime: '',
  endTime: '',
  duration: null,
});

const deleteCurrentEntry = async () => {
  if (!activeEntry.value) {
    confirmDialog.value = false;
    editDialog.value = false;
    alert('No active entry to delete');
    return;
  }

  const token = localStorage.getItem('token');
  if (!token) {
    alert('You are not authorized. Please log in.');
    confirmDialog.value = false;
    editDialog.value = false;
    return;
  }

  try {
    const res = await fetch(`${api}/time-entries/${activeEntry.value._id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      alert('Failed to delete time entry');
      return;
    }

    confirmDialog.value = false;
    editDialog.value = false;
    emit('entry-deleted');
  } catch (err) {
    console.error('Error deleting time entry:', err);
    alert('An error occurred while deleting the time entry');
  }
};

const saveEdit = async () => {
  if (!activeEntry.value) return;

  const start = form.startTime ? new Date(form.startTime) : null;
  let end = form.endTime ? new Date(form.endTime) : null;

  if (form.duration && start) {
    const minutes = Number(form.duration);
    end = new Date(start.getTime() + minutes * 60 * 1000);
  }

  if (!start) return;

  const body = {
    activity: form.activity,
    startTime: start,
    endTime: end,
  };

  try {
    const res = await fetch(`${api}/time-entries/${activeEntry.value._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) throw new Error('Failed to update time entry');

    editDialog.value = false;
    emit('entry-updated');
  } catch (err) {
    console.error('Error updating time entry:', err);
  }
};

watch(editDialog, (opened) => {
  if (opened && activeEntry.value) {
    const start = activeEntry.value.startTime
      ? new Date(activeEntry.value.startTime)
      : null;
    const end = activeEntry.value.endTime
      ? new Date(activeEntry.value.endTime)
      : null;

    form.activity = activeEntry.value.activity;
    form.startTime =
      start && !isNaN(start.getTime()) ? start.toISOString() : '';
    form.endTime = end && !isNaN(end.getTime()) ? end.toISOString() : '';
    form.duration = null;

    console.log('Form after init:', form);
  }
});

watch(
  () => form.startTime,
  (newVal) => {
    console.log('form.startTime updated:', newVal);
  }
);

watch(
  () => form.endTime,
  (newVal) => {
    console.log('form.endTime updated:', newVal);
  }
);

const btnStyles = {
  warning: {
    backgroundColor: '#f9b24d',
    height: '38px',
    borderRadius: '8px',
    boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)',
  },
  error: {
    backgroundColor: '#f86e6e',
    height: '38px',
    borderRadius: '8px',
    boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)',
  },
  edit: {
    backgroundColor: '#616161',
    height: '38px',
    borderRadius: '8px',
    boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)',
  },
};
</script>

<style scoped>
.activity-card {
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
  transition: transform 0.2s ease, box-shadow 0.3s ease;
  margin: 0 10px !important;
  margin-bottom: 16px !important;
}

.activity-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 10px #53d753;
}
.text-white {
  color: white;
}
.v-picker.v-sheet {
  width: auto;
}
.activity-name {
  font-size: clamp(1.2rem, 4vw, 1.6rem) !important;
}

.v-icon:hover {
  transform: scale(1.1);
  transition: transform 0.2s ease;
}

.action-btn {
  margin-right: 8px;
}

@media (max-width: 600px) {
  .action-row {
    margin-right: 4px;
  }
}
</style>
