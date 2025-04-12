<template>
  <div>
    <!-- Start Time Picker -->
    <v-menu
      v-model="startTimeMenu"
      :close-on-content-click="false"
      transition="scale-transition"
    >
      <template #activator="{ props }">
        <v-text-field
          v-model="formattedStartTime"
          v-bind="props"
          :label="startLabel"
          density="comfortable"
          readonly
        />
      </template>
      <v-card>
        <v-sheet v-if="!showStartTimePicker">
          <v-date-picker
            v-model="startDate"
            color="primary"
            show-adjacent-months
          />
          <v-card-actions class="justify-end">
            <v-btn text @click="startTimeMenu = false">Cancel</v-btn>
            <v-btn
              color="primary"
              text
              :disabled="!startDate"
              @click="showStartTimePicker = true"
            >
              Next
            </v-btn>
          </v-card-actions>
        </v-sheet>
        <v-sheet v-else>
          <!-- Manual time input -->
          <v-text-field
            v-model="tempStartTime"
            label="Time (HH:mm)"
            placeholder="e.g. 14:30"
            density="comfortable"
            hide-details
            class="mb-2"
            :rules="[validateTimeFormat]"
          />

          <!-- Visual time selection -->
          <v-time-picker
            v-model="tempStartTime"
            format="24hr"
            color="primary"
            scrollable
          />

          <v-card-actions class="justify-end">
            <v-btn text @click="showStartTimePicker = false">Back</v-btn>
            <v-btn color="primary" text @click="applyStartDateTime">OK</v-btn>
          </v-card-actions>
        </v-sheet>
      </v-card>
    </v-menu>

    <!-- End Time Picker -->
    <v-menu
      v-model="endTimeMenu"
      :close-on-content-click="false"
      transition="scale-transition"
      max-width="340px"
      min-width="auto"
    >
      <template #activator="{ props }">
        <v-text-field
          v-model="formattedEndTime"
          v-bind="props"
          :label="endLabel"
          density="comfortable"
          readonly
        />
      </template>
      <v-card>
        <v-sheet v-if="!showEndTimePicker">
          <v-date-picker
            v-model="endDate"
            color="primary"
            show-adjacent-months
          />
          <v-card-actions class="justify-end">
            <v-btn text @click="endTimeMenu = false">Cancel</v-btn>
            <v-btn
              color="primary"
              text
              :disabled="!endDate"
              @click="showEndTimePicker = true"
            >
              Next
            </v-btn>
          </v-card-actions>
        </v-sheet>
        <v-sheet v-else>
          <!-- Manual time input -->
          <v-text-field
            v-model="endTime"
            label="Time (HH:mm)"
            placeholder="e.g. 14:30"
            density="comfortable"
            hide-details
            class="mb-2"
            :rules="[validateTimeFormat]"
          />

          <!-- Visual time selection -->
          <v-time-picker
            v-if="endDate"
            v-model="endTime"
            format="24hr"
            color="primary"
            scrollable
          />

          <v-card-actions class="justify-end">
            <v-btn text @click="showEndTimePicker = false">Back</v-btn>
            <v-btn color="primary" text @click="applyEndDateTime">OK</v-btn>
          </v-card-actions>
        </v-sheet>
      </v-card>
    </v-menu>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
  startTime: String,
  endTime: String,
  startLabel: { type: String, default: 'Start Time' },
  endLabel: { type: String, default: 'End Time (optional)' },
});

const emit = defineEmits(['update:startTime', 'update:endTime']);

// Local reactive states
const localStartTime = ref(props.startTime || '');
const localEndTime = ref(props.endTime || '');

// Start time logic
const startTimeMenu = ref(false);
const startDate = ref(null);
const tempStartTime = ref(null);
const showStartTimePicker = ref(false);

// End time logic
const endTimeMenu = ref(false);
const endDate = ref(null);
const endTime = ref(null);
const showEndTimePicker = ref(false);

// Emits formatted ISO datetime string for start
const applyStartDateTime = () => {
  if (startDate.value && tempStartTime.value) {
    const date = new Date(startDate.value);
    const [hours, minutes] = tempStartTime.value.split(':');
    date.setHours(hours, minutes, 0, 0);

    const offset = date.getTimezoneOffset();
    const sign = offset > 0 ? '-' : '+';
    const hoursOffset = String(Math.floor(Math.abs(offset) / 60)).padStart(
      2,
      '0'
    );
    const minutesOffset = String(Math.abs(offset) % 60).padStart(2, '0');
    const timezone = `${sign}${hoursOffset}:${minutesOffset}`;

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const formattedTime = `${year}-${month}-${day}T${tempStartTime.value}:00${timezone}`;

    localStartTime.value = formattedTime;
    emit('update:startTime', formattedTime);
    startTimeMenu.value = false;
    showStartTimePicker.value = false;
  }
};

// Emits formatted ISO datetime string for end
const applyEndDateTime = () => {
  if (endDate.value && endTime.value) {
    const date = new Date(endDate.value);
    const [hours, minutes] = endTime.value.split(':');
    date.setHours(hours, minutes, 0, 0);

    const offset = date.getTimezoneOffset();
    const sign = offset > 0 ? '-' : '+';
    const hoursOffset = String(Math.floor(Math.abs(offset) / 60)).padStart(
      2,
      '0'
    );
    const minutesOffset = String(Math.abs(offset) % 60).padStart(2, '0');
    const timezone = `${sign}${hoursOffset}:${minutesOffset}`;

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const formattedTime = `${year}-${month}-${day}T${endTime.value}:00${timezone}`;

    localEndTime.value = formattedTime;
    emit('update:endTime', formattedTime);
    endTimeMenu.value = false;
    showEndTimePicker.value = false;
  }
};

// Computed values for UI
const formattedStartTime = computed(() => formatDateTime(localStartTime.value));
const formattedEndTime = computed(() => formatDateTime(localEndTime.value));

// Formatting function for displaying datetime
const formatDateTime = (dateTimeString) => {
  if (!dateTimeString) return '';
  try {
    const d = new Date(dateTimeString);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleString('uk-UA', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  } catch (error) {
    console.error('Error formatting date:', dateTimeString, error);
    return '';
  }
};

// Validates HH:mm time format
const validateTimeFormat = (value) => {
  if (!value) return true;
  return /^([01]\d|2[0-3]):([0-5]\d)$/.test(value) || 'Invalid format (HH:mm)';
};

// Sync local values with props
watch(
  () => props.startTime,
  (newVal) => {
    localStartTime.value = newVal || '';
  }
);

watch(
  () => props.endTime,
  (newVal) => {
    localEndTime.value = newVal || '';
  }
);

// Initialize date & time values from props
watch(
  () => localStartTime.value,
  (newVal) => {
    if (newVal) {
      const start = new Date(newVal);
      if (!isNaN(start.getTime())) {
        startDate.value = start.toISOString().split('T')[0];
        tempStartTime.value = start.toTimeString().slice(0, 5);
      }
    }
  },
  { immediate: true }
);

watch(
  () => localEndTime.value,
  (newVal) => {
    if (newVal) {
      const end = new Date(newVal);
      if (!isNaN(end.getTime())) {
        endDate.value = end.toISOString().split('T')[0];
        endTime.value = end.toTimeString().slice(0, 5);
      }
    }
  },
  { immediate: true }
);

// Reset time pickers when menus close
watch(startTimeMenu, (isOpen) => {
  if (!isOpen) showStartTimePicker.value = false;
});

watch(endTimeMenu, (isOpen) => {
  if (!isOpen) showEndTimePicker.value = false;
});
</script>

<style scoped>
.v-picker.v-sheet {
  width: auto;
}
</style>
