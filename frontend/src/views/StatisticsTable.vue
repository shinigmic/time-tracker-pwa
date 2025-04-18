<template>
  <v-app>
    <v-main>
      <v-card-title class="section-title"> Statistics </v-card-title>
      <v-container class="py-8">
        <v-card elevation="3" class="pa-6">
          <v-row class="calendar-row" align="stretch" justify="space-evenly">
            <v-col cols="auto">
              <v-date-picker
                v-model="from"
                label="From"
                show-adjacent-months
                elevation="1"
                :first-day-of-week="firstDayOfWeek"
              ></v-date-picker>
            </v-col>
            <v-col cols="auto">
              <v-date-picker
                v-model="to"
                label="To"
                show-adjacent-months
                elevation="1"
                :first-day-of-week="firstDayOfWeek"
              ></v-date-picker>
            </v-col>
          </v-row>

          <div class="d-flex justify-center my-4">
            <v-btn color="primary" class="btn-load" @click="fetchStats">
              Load Statistics
            </v-btn>
          </div>

          <v-divider class="my-4"></v-divider>

          <div v-if="stats">
            <v-row class="mb-4">
              <v-col cols="12" md="4">
                <p><strong>Total Days:</strong> {{ stats.totalDays }}</p>
                <p>
                  <strong>Total Activities:</strong> {{ stats.totalGroups }}
                </p>
              </v-col>
              <v-col cols="12" md="4">
                <p>
                  <strong>Tracked Time:</strong>
                  {{ stats.totalDurationOverall }} h ({{
                    stats.trackedPercentage
                  }}%)
                </p>
                <p>
                  <strong>Untracked Time:</strong>
                  {{ stats.untrackedTime.hours }} h ({{
                    stats.untrackedTime.percentage
                  }}%)
                </p>
              </v-col>
            </v-row>

            <v-table class="elevation-1">
              <thead>
                <tr>
                  <th>Activity</th>
                  <th>Total Duration (h)</th>
                  <th>Sessions</th>
                  <th>Avg Duration / Session (h)</th>
                  <th>Share (%)</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="activity in stats.stats" :key="activity.activity">
                  <td class="td_activity">
                    {{
                      activityTypeMap[activity.activity] || activity.activity
                    }}
                  </td>
                  <td>{{ activity.totalDuration }}</td>
                  <td>{{ activity.count }}</td>
                  <td>{{ activity.averageDurationPerSession }}</td>
                  <td>{{ activity.percentage }}</td>
                </tr>
              </tbody>
            </v-table>
          </div>

          <div v-else class="text-center text-grey mt-6">
            Select a date range and load statistics.
          </div>
        </v-card>
      </v-container>
    </v-main></v-app
  >
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
const api = import.meta.env.VITE_API_BASE;

const today = new Date();
const weekAgo = new Date();
weekAgo.setDate(today.getDate() - 6);

const from = ref(weekAgo.toISOString().split('T')[0]);
const to = ref(today.toISOString().split('T')[0]);

const stats = ref(null);
const error = ref(null);
const currentEntries = ref({});
const activityTypeMap = ref({});

//  0 = Sunday, 1 = Monday
const userLocale = ref(navigator.language || 'en-US');

const firstDayOfWeek = computed(() => {
  const mondayLocales = ['uk', 'uk-UA', 'ru', 'de', 'fr', 'es', 'pl', 'it'];
  return mondayLocales.some((l) => userLocale.value.startsWith(l)) ? 1 : 0;
});

const fetchActivityTypes = async () => {
  try {
    const res = await fetch(`${api}/activity-types`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    const data = await res.json();
    data.forEach((type) => {
      activityTypeMap.value[type._id] = type.name;
    });
  } catch (err) {
    console.error('Failed to fetch activity types:', err);
  }
};

const fetchStats = async () => {
  try {
    const res = await fetch(
      `${api}/stats/table?from=${from.value}&to=${to.value}`,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      }
    );
    const data = await res.json();
    stats.value = data;
  } catch (err) {
    error.value = 'Failed to fetch stats.';
    console.error(err);
  }
};

onMounted(() => {
  fetchActivityTypes();
  fetchStats();
});
</script>

<style scoped>
thead {
  font-size: larger;
}
th,
td {
  padding: 12px 16px;
  text-align: center;
}

.btn-load {
  min-width: 200px;
  width: 100%;
  margin: 8px 0;
  height: 50px;
}
.td_activity {
  text-align: left;
}

/* .v-container {
  padding: 0 !important;
} */

.v-container {
  padding: 0 0 35px 0 !important;
}
.v-card {
  box-shadow: none !important;
}
@media (max-width: 960px) {
  .calendar-row {
    flex-direction: column;
    gap: 16px;
  }

  .v-date-picker {
    width: 100%;
    max-width: 360px;
    margin: 0 auto;
  }

  .btn-load {
    font-size: 1rem;
    height: 48px;
    width: 100%;
  }
}
/* @media (max-width: 600px) {
  .v-container {
    padding-left: 0 !important;
    padding-right: 0 !important;
  }

  .v-card {
    padding-left: 8px !important;
    padding-right: 8px !important;
    transition: padding 0.3s ease, border-radius 0.3s ease;
  }

  .v-main {
    padding: 0 !important;
  }
} */
.v-date-picker {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  background-color: white;
}
</style>
