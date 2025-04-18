<template>
  <v-card class="mb-6 pa-4">
    <v-card-title class="text-h6 font-weight-bold">
      ⏳ Inactive Activities Today
    </v-card-title>

    <v-card-text>
      <v-row>
        <v-col
          v-for="activity in inactiveActivities"
          :key="activity._id"
          cols="12"
          sm="6"
          md="4"
        >
          <v-card
            class="activity-card"
            outlined
            :style="{
              borderLeft: '6px solid ' + (activity.color || '#CCCCCC'),
              backgroundColor: '#fafafa',
            }"
          >
            <v-card-title class="d-flex align-center justify-space-between">
              <span class="d-flex align-center activity-header">
                <v-icon class="mr-2" :color="activity.color || 'grey'">
                  {{ activity.icon || 'mdi-run' }}
                </v-icon>
                <span
                  class="font-weight-bold text-subtitle-1 activity-name"
                  :title="activity.name"
                >
                  {{ activity.name }}
                </span>
              </span>

              <v-icon
                small
                color="grey"
                style="cursor: pointer"
                @click.stop="
                  dialogVisible = true;
                  visibleDialogId = activity._id;
                "
              >
                mdi-information-outline
              </v-icon>

              <ActivityInfoDialog
                v-model="dialogVisible"
                v-if="visibleDialogId === activity._id"
                :title="activity.name"
                :description="activity.description"
                :icon="activity.icon"
                :iconColor="activity.color"
              />
            </v-card-title>

            <v-card-actions class="justify-center">
              <v-btn
                small
                variant="outlined"
                color="primary"
                class="font-weight-medium"
                rounded
                @click="$emit('start', activity)"
              >
                Start Activity
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>

        <v-col
          v-if="inactiveActivities.length === 0"
          cols="12"
          class="text-center"
        >
          <v-alert type="info" text>
            All activities were already used today!
          </v-alert>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, computed } from 'vue';
import ActivityInfoDialog from './ActivityInfoDialog.vue';

const props = defineProps({
  activityTypes: Array,
  todayEntries: Array,
});
const visibleDialogId = ref(null);
const dialogVisible = ref(false);

// Collect activity IDs that were used today
const usedTodayIds = computed(
  () => new Set(props.todayEntries.map((e) => e.activity))
);

// Filter out only unused activities
const inactiveActivities = computed(() =>
  props.activityTypes.filter((a) => !usedTodayIds.value.has(a._id))
);
</script>

<style scoped>
.activity-card {
  border-radius: 12px;
  transition: transform 0.2s ease, box-shadow 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
  background-color: #ddc4c9;
}
.activity-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.15);
}
.v-icon {
  cursor: pointer;
}
.v-btn {
  min-width: 110px;
  text-transform: none;
  font-size: 16px;
  border-radius: 8px;
}
.activity-name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
  display: inline-block;
}
.v-icon:hover {
  transform: scale(1.1);
  transition: transform 0.2s ease;
}
</style>
