<template>
  <v-card outlined>
    <v-card-title>
      <v-icon left>{{ activity.icon || 'mdi-run' }}</v-icon>
      {{ activity.name }}
      <v-tooltip bottom>
        <template #activator="{ props }">
          <v-icon class="ml-2" small color="grey" v-bind="props" v-on="on">
            mdi-information-outline
          </v-icon>
        </template>
        <span>{{ activity.description }}</span>
      </v-tooltip>
    </v-card-title>

    <v-tooltip bottom>
      <template #activator="{ on, attrs }">
        <v-card-subtitle v-bind="attrs" v-on="on">
          <span class="text-grey">Not started today</span>
        </v-card-subtitle>
      </template>
      <span>{{ activity.description }}</span>
    </v-tooltip>

    <v-card-actions>
      <v-btn color="success" @click="$emit('start')">Start</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
defineProps({
  activity: Object,
});
</script>
