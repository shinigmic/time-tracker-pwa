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
          <v-card outlined>
            <v-card-title class="d-flex align-center justify-space-between">
              <span>
                <v-icon left>{{ activity.icon || 'mdi-run' }}</v-icon>
                {{ activity.name }}
              </span>

              <v-tooltip bottom>
                <template #activator="{ props }">
                  <v-icon small color="grey" v-bind="props">
                    mdi-information-outline
                  </v-icon>
                </template>
                <span>{{ activity.description }}</span>
              </v-tooltip>
            </v-card-title>

            <v-card-actions class="justify-center">
              <v-btn small color="primary" @click="$emit('start', activity)">
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
import { computed } from 'vue';

const props = defineProps({
  activityTypes: Array,
  todayEntries: Array,
});

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
.v-card {
  border-radius: 12px;
}
.v-icon {
  cursor: pointer;
}
</style>
