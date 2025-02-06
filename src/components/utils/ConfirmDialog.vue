<template>
  <v-dialog v-model="showDialog" width="285" height="285">
    <template v-slot:activator="{ on, props }">
      <slot name="deleteButton" :on="on" :props="props"></slot>
    </template>

    <v-card>
      <v-card-text>Are you sure you want to proceed?</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="red-darken-1" variant="text" @click="showDialog = false"
          >Cancel
        </v-btn>

        <v-btn color="green-darken-1" variant="text" @click="confirmClick">
          Confirm
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref } from "vue";
const emits = defineEmits(["confirmed"]);

const showDialog = ref(false);

const confirmClick = () => {
  emits("confirmed");
  showDialog.value = false;
};
</script>

<style scoped></style>
