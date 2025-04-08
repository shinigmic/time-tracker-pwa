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
                  <v-btn color="primary" @click="openNewDialog">
                    New Activity
                  </v-btn>
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
              />
              <v-text-field
                v-model="editedActivity.description"
                label="Description"
              />
              <v-text-field v-model="editedActivity.icon" label="Icon URL" />
              <v-text-field v-model="editedActivity.color" label="Color" />
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

<script setup>
import { ref, onMounted } from 'vue';

const headers = [
  { text: 'Name', value: 'name' },
  { text: 'Description', value: 'description' },
  { text: 'Icon', value: 'icon' },
  { text: 'Color', value: 'color' },
  { text: 'Actions', value: 'actions', sortable: false },
];

const activityTypes = ref([]);
const dialog = ref(false);
const dialogTitle = ref('');
const editedActivity = ref({});

const fetchActivityTypes = async () => {
  try {
    const response = await fetch('http://localhost:3000/activity-types', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    activityTypes.value = await response.json();
  } catch (error) {
    console.error('Error fetching activity types:', error);
  }
};

const openNewDialog = () => {
  dialogTitle.value = 'New Activity Type';
  editedActivity.value = {
    name: '',
    description: '',
    icon: '',
    color: '',
  };
  dialog.value = true;
};

const editActivity = (item) => {
  dialogTitle.value = 'Edit Activity Type';
  editedActivity.value = { ...item };
  dialog.value = true;
};

const closeDialog = () => {
  dialog.value = false;
};

const saveActivity = async () => {
  try {
    let response;
    if (editedActivity.value._id) {
      response = await fetch(
        `http://localhost:3000/activity-types/${editedActivity.value._id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify(editedActivity.value),
        }
      );
    } else {
      response = await fetch('http://localhost:3000/activity-types', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(editedActivity.value),
      });
    }
    await response.json();
    dialog.value = false;
    fetchActivityTypes();
  } catch (error) {
    console.error('Error saving activity type:', error);
  }
};

const deleteActivity = async (item) => {
  try {
    await fetch(`http://localhost:3000/activity-types/${item._id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    fetchActivityTypes();
  } catch (error) {
    console.error('Error deleting activity type:', error);
  }
};

onMounted(() => {
  fetchActivityTypes();
});
</script>

<style scoped>
/* Optional styling here */
</style>
