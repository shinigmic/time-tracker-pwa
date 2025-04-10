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
              :item-class="getRowClass"
            >
              <template v-slot:top>
                <v-toolbar flat>
                  <v-toolbar-title>🎨 Edit Activity Types</v-toolbar-title>
                  <v-spacer></v-spacer>
                  <v-btn color="primary" @click="openNewDialog"
                    >New Activity</v-btn
                  >
                </v-toolbar>
              </template>

              <!-- Icon + Name -->
              <template v-slot:item.name="{ item }">
                <div class="d-flex align-center">
                  <v-icon class="mr-2">{{ item.icon || 'mdi-run' }}</v-icon>
                  {{ item.name }}
                </div>
              </template>

              <!-- Color chip -->
              <template v-slot:item.color="{ item }">
                <v-chip :color="item.color || 'grey lighten-2'" dark small>
                  {{ item.color || 'None' }}
                </v-chip>
              </template>

              <!-- Actions -->
              <template v-slot:item.actions="{ item }">
                <v-icon small class="mr-2" @click="editActivity(item)"
                  >mdi-pencil</v-icon
                >
                <v-icon small color="red" @click="confirmDeleteActivity(item)"
                  >mdi-delete</v-icon
                >
              </template>
            </v-data-table>
          </v-col>
        </v-row>

        <!-- Dialog -->
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
              <v-menu
                v-model="colorMenu"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
              >
                <template #activator="{ props }">
                  <v-text-field
                    v-model="editedActivity.color"
                    label="Color"
                    placeholder="#FF5733"
                    v-bind="props"
                  >
                    <template #append-inner>
                      <v-avatar size="20" class="cursor-pointer">
                        <div
                          :style="{
                            backgroundColor: editedActivity.color,
                            width: '100%',
                            height: '100%',
                          }"
                        ></div>
                      </v-avatar>
                    </template>
                  </v-text-field>
                </template>

                <v-card>
                  <v-color-picker
                    v-model="editedActivity.color"
                    hide-inputs
                    show-swatches
                    swatches-max-height="150"
                  />
                </v-card>
              </v-menu>

              <v-text-field
                v-model="editedActivity.icon"
                label="Select Icon"
                :append-inner-icon="
                  isValidIcon(editedActivity.icon)
                    ? editedActivity.icon
                    : 'mdi-run'
                "
                placeholder="mdi-dumbbell or select from list"
              >
                <template #append>
                  <v-select
                    :items="iconOptions"
                    item-title="text"
                    item-value="value"
                    label="Choose Icon"
                    hide-details
                    dense
                    solo
                    style="width: 200px"
                    @update:modelValue="(val) => (editedActivity.icon = val)"
                  />
                </template>
              </v-text-field>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn text @click="closeDialog">Cancel</v-btn>
              <v-btn text color="primary" @click="saveActivity">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-dialog v-model="confirmDelete" max-width="400px">
          <v-card>
            <v-card-title class="text-h6 d-flex align-center">
              <v-icon
                :color="activityToDelete?.color || 'grey'"
                class="mr-2"
                size="28"
              >
                {{ activityToDelete?.icon || 'mdi-run' }}
              </v-icon>
              {{ activityToDelete?.name }}
            </v-card-title>

            <v-card-text>
              Are you sure you want to delete this activity?
            </v-card-text>

            <v-card-actions class="justify-end">
              <v-btn text @click="confirmDelete = false">Cancel</v-btn>
              <v-btn text color="red" @click="performDeleteActivity"
                >Delete</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, onMounted } from 'vue';
const colorMenu = ref(false);

const headers = [
  { text: 'Name', value: 'name' },
  { text: 'Description', value: 'description' },
  { text: 'Color', value: 'color' },

  { text: 'Actions', value: 'actions', sortable: false },
];

const activityTypes = ref([]);
const dialog = ref(false);
const dialogTitle = ref('');
const editedActivity = ref({});

// Example icons you can expand
const iconOptions = [
  { text: 'Work', value: 'mdi-briefcase-outline' },
  { text: 'Rest', value: 'mdi-sofa' },
  { text: 'Reading', value: 'mdi-book-open-page-variant' },
  { text: 'Meditation', value: 'mdi-meditation' },
  { text: 'Chores', value: 'mdi-broom' },
  { text: 'Exercise', value: 'mdi-dumbbell' },
  { text: 'Learning', value: 'mdi-school' },
  { text: 'Socializing', value: 'mdi-account-group' },
  { text: 'Commuting', value: 'mdi-car' },
  { text: 'Entertainment', value: 'mdi-movie' },
  { text: 'Sleep', value: 'mdi-bed' },
  { text: 'Nutrition', value: 'mdi-silverware-fork-knife' },
  { text: 'Walking', value: 'mdi-walk' },
  { text: 'Traveling', value: 'mdi-airplane' },
  { text: 'Yoga', value: 'mdi-yoga' },
  { text: 'BJJ Training', value: 'mdi-karate' },
  { text: 'Coding', value: 'mdi-code-braces' },
  { text: 'Designing', value: 'mdi-vector-square' },
  { text: 'Meetings', value: 'mdi-account-multiple-outline' },
  { text: 'Planning', value: 'mdi-calendar-text' },
  { text: 'Grocery Shopping', value: 'mdi-cart-outline' },
  { text: 'Cooking', value: 'mdi-pot-mix' },
  { text: 'Cleaning', value: 'mdi-vacuum-outline' },
  { text: 'Gaming', value: 'mdi-controller' },
  { text: 'Watching TV', value: 'mdi-television' },
  { text: 'Music', value: 'mdi-music-note' },
  { text: 'Guitar', value: 'mdi-guitar-electric' },
  { text: 'Drawing', value: 'mdi-palette' },
  { text: 'Photography', value: 'mdi-camera' },
  { text: 'Journaling', value: 'mdi-notebook-outline' },
  { text: 'Studying', value: 'mdi-book-open-variant' },
  { text: 'Language Learning', value: 'mdi-translate' },
  { text: 'Meditative Walks', value: 'mdi-nature' },
  { text: 'Relaxation', value: 'mdi-spa' },
  { text: 'Volunteering', value: 'mdi-hand-heart' },
  { text: 'Pet Care', value: 'mdi-dog' },
  { text: 'Child Care', value: 'mdi-baby-carriage' },
  { text: 'Driving', value: 'mdi-steering' },
  { text: 'Sleeping In', value: 'mdi-weather-night' },
  { text: 'Therapy', value: 'mdi-emoticon-neutral' },
  { text: 'Phone Calls', value: 'mdi-phone' },
  { text: 'Emails', value: 'mdi-email-outline' },
  { text: 'Online Shopping', value: 'mdi-cart-arrow-down' },
  { text: 'Budgeting', value: 'mdi-currency-usd' },
  { text: 'Laundry', value: 'mdi-tshirt-crew' },
  { text: 'Self-care', value: 'mdi-human-female-female' },
  { text: 'Appointments', value: 'mdi-clock-outline' },
  { text: 'Breaks', value: 'mdi-coffee' },
  { text: 'Stretching', value: 'mdi-arm-flex' },
  { text: 'Mindfulness', value: 'mdi-brain' },
  { text: 'Custom', value: 'mdi-run' },
];

const isValidIcon = (icon) => {
  // Vuetify/Mdi won't throw, but we fallback to 'mdi-run' if empty or invalid
  return !!icon && icon.startsWith('mdi-');
};

const getRowClass = (item) => {
  return item.color ? `activity-row-${item._id}` : '';
};

const generateRowStyles = () => {
  const style = document.createElement('style');
  style.innerHTML = activityTypes.value
    .filter((a) => a.color)
    .map(
      (a) => `
      .activity-row-${a._id} {
        background-color: ${a.color}22 !important;
        transition: background-color 0.3s ease;
      }
      .activity-row-${a._id}:hover {
        background-color: ${a.color}44 !important;
      }
    `
    )
    .join('\n');
  document.head.appendChild(style);
};

const fetchActivityTypes = async () => {
  try {
    const response = await fetch('http://localhost:3000/activity-types', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    activityTypes.value = await response.json();
    generateRowStyles();
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
    const payload = {
      ...editedActivity.value,
      icon:
        typeof editedActivity.value.icon === 'object'
          ? editedActivity.value.icon.value
          : editedActivity.value.icon,
    };

    let response;
    if (payload._id) {
      response = await fetch(
        `http://localhost:3000/activity-types/${payload._id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify(payload),
        }
      );
    } else {
      response = await fetch('http://localhost:3000/activity-types', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(payload),
      });
    }

    await response.json();
    dialog.value = false;
    await fetchActivityTypes();
  } catch (error) {
    console.error('Error saving activity type:', error);
  }
};

const confirmDelete = ref(false);
const activityToDelete = ref(null);

const confirmDeleteActivity = (activity) => {
  activityToDelete.value = activity;
  confirmDelete.value = true;
};

const performDeleteActivity = async () => {
  try {
    await fetch(
      `http://localhost:3000/activity-types/${activityToDelete.value._id}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );
    confirmDelete.value = false;
    activityToDelete.value = null;
    fetchActivityTypes();
  } catch (error) {
    console.error('Error deleting activity type:', error);
  }
};

onMounted(fetchActivityTypes);
</script>

<style scoped>
.v-card {
  border-radius: 10px;
}
.v-icon {
  cursor: pointer;
}
</style>
