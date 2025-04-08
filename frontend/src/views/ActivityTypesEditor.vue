<template>
  <v-app>
    <v-main>
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-data-table
              :headers="headers"
              :items="activityTypes"
              item-key="_id"
              class="elevation-1"
            >
              <template v-slot:top>
                <v-toolbar flat>
                  <v-toolbar-title>Edit Activity Types</v-toolbar-title>
                  <v-spacer></v-spacer>
                  <v-btn color="primary" @click="openNewDialog"
                    >New Activity</v-btn
                  >
                </v-toolbar>
              </template>
              <template v-slot:item.actions="{ item }">
                <v-icon small class="mr-2" @click="editActivity(item)">
                  mdi-pencil
                </v-icon>
                <v-icon small @click="deleteActivity(item)">
                  mdi-delete
                </v-icon>
              </template>
            </v-data-table>
          </v-col>
        </v-row>

        <!-- Dialog for creating/editing activity type -->
        <v-dialog v-model="dialog" max-width="500px">
          <v-card>
            <v-card-title>
              <span class="headline">{{ dialogTitle }}</span>
            </v-card-title>
            <v-card-text>
              <v-text-field
                v-model="editedActivity.name"
                label="Name"
                required
              ></v-text-field>
              <v-text-field
                v-model="editedActivity.description"
                label="Description"
              ></v-text-field>
              <v-text-field
                v-model="editedActivity.icon"
                label="Icon URL"
              ></v-text-field>
              <v-text-field
                v-model="editedActivity.color"
                label="Color"
              ></v-text-field>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn text @click="closeDialog">Cancel</v-btn>
              <v-btn text color="primary" @click="saveActivity">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'ActivityTypesEditor',
  data() {
    return {
      headers: [
        { text: 'Name', value: 'name' },
        { text: 'Description', value: 'description' },
        { text: 'Icon', value: 'icon' },
        { text: 'Color', value: 'color' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      activityTypes: [],
      dialog: false,
      editedActivity: {},
      dialogTitle: '',
    };
  },
  created() {
    this.fetchActivityTypes();
  },
  methods: {
    async fetchActivityTypes() {
      try {
        // Replace with your API endpoint for activity types
        const response = await fetch('http://localhost:3000/activity-types', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        this.activityTypes = await response.json();
      } catch (error) {
        console.error('Error fetching activity types:', error);
      }
    },
    openNewDialog() {
      this.dialogTitle = 'New Activity Type';
      this.editedActivity = { name: '', description: '', icon: '', color: '' };
      this.dialog = true;
    },
    editActivity(activity) {
      this.dialogTitle = 'Edit Activity Type';
      this.editedActivity = { ...activity };
      this.dialog = true;
    },
    closeDialog() {
      this.dialog = false;
    },
    async saveActivity() {
      try {
        let response;
        if (this.editedActivity._id) {
          // Update existing activity type
          response = await fetch(
            `http://localhost:3000/ctivity-types/${this.editedActivity._id}`,
            {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
              },
              body: JSON.stringify(this.editedActivity),
            }
          );
        } else {
          // Create new activity type
          response = await fetch('http://localhost:3000/activity-types', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify(this.editedActivity),
          });
        }
        await response.json();
        this.dialog = false;
        this.fetchActivityTypes();
      } catch (error) {
        console.error('Error saving activity type:', error);
      }
    },
    async deleteActivity(activity) {
      try {
        await fetch(`http://localhost:3000/activity-types/${activity._id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        this.fetchActivityTypes();
      } catch (error) {
        console.error('Error deleting activity type:', error);
      }
    },
  },
};
</script>

<style scoped></style>
