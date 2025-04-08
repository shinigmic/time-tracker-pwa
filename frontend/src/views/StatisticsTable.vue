<template>
  <v-app>
    <v-main>
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-card class="mb-4">
              <v-card-title>Daily Statistics</v-card-title>
              <v-card-text>
                <v-data-table
                  :headers="dailyHeaders"
                  :items="stats.daily"
                  item-key="date"
                  class="elevation-1"
                ></v-data-table>
              </v-card-text>
            </v-card>
            <v-card class="mb-4">
              <v-card-title>Weekly Statistics</v-card-title>
              <v-card-text>
                <v-data-table
                  :headers="weeklyHeaders"
                  :items="stats.weekly"
                  item-key="week"
                  class="elevation-1"
                ></v-data-table>
              </v-card-text>
            </v-card>
            <v-card class="mb-4">
              <v-card-title>Monthly Statistics</v-card-title>
              <v-card-text>
                <v-data-table
                  :headers="monthlyHeaders"
                  :items="stats.monthly"
                  item-key="month"
                  class="elevation-1"
                ></v-data-table>
              </v-card-text>
            </v-card>
            <v-card class="mb-4">
              <v-card-title>Yearly Statistics</v-card-title>
              <v-card-text>
                <v-data-table
                  :headers="yearlyHeaders"
                  :items="stats.yearly"
                  item-key="year"
                  class="elevation-1"
                ></v-data-table>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'StatisticsTable',
  data() {
    return {
      stats: {
        daily: [],
        weekly: [],
        monthly: [],
        yearly: [],
      },
      dailyHeaders: [
        { text: 'Date', value: 'date' },
        { text: 'Overall Total (min)', value: 'overallTotal' },
        { text: 'Groups', value: 'groups', sortable: false },
      ],
      weeklyHeaders: [
        { text: 'Week (Year, Week)', value: 'week' },
        { text: 'Overall Total (min)', value: 'overallTotal' },
        { text: 'Groups', value: 'groups', sortable: false },
      ],
      monthlyHeaders: [
        { text: 'Month (Year, Month)', value: 'month' },
        { text: 'Overall Total (min)', value: 'overallTotal' },
        { text: 'Groups', value: 'groups', sortable: false },
      ],
      yearlyHeaders: [
        { text: 'Year', value: 'year' },
        { text: 'Overall Total (min)', value: 'overallTotal' },
        { text: 'Groups', value: 'groups', sortable: false },
      ],
    };
  },
  created() {
    this.fetchStatistics();
  },
  methods: {
    async fetchStatistics() {
      try {
        const response = await fetch('http://localhost:3000/stats/table', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        this.stats = await response.json();
      } catch (error) {
        console.error('Error fetching statistics:', error);
      }
    },
  },
};
</script>

<style scoped></style>
