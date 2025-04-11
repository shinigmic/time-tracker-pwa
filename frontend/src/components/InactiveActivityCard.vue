<template>
  <v-card
    class="activity-card"
    dark
    elevation="3"
    :style="{ backgroundColor: activity.color || '#F5F5F5' }"
  >
    <v-card-title class="d-flex align-center justify-space-between">
      <span class="d-flex align-center">
        <v-icon class="mr-2">{{ activity.icon || 'mdi-run' }}</v-icon>
        <span class="font-weight-bold text-subtitle-1">
          {{ activity.name }}
        </span>
      </span>

      <v-tooltip bottom>
        <template #activator="{ props }">
          <v-icon small color="white" v-bind="props">
            mdi-information-outline
          </v-icon>
        </template>
        <span>{{ activity.description }}</span>
      </v-tooltip>
    </v-card-title>

    <v-card-text class="text-center">
      <span class="text-caption">Not started today</span>
    </v-card-text>

    <v-card-actions class="justify-center">
      <v-btn small color="primary" @click="$emit('start')"> Start </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
defineProps({
  activity: Object,
});
</script>

<style scoped>
.activity-card {
  border-radius: 14px;
  transition: transform 0.2s ease, box-shadow 0.3s ease;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
}
.activity-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}
</style>
