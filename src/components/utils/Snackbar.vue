<template>
  <div class="text-center ma-2">
    <v-snackbar v-model="snackbar" location="bottom" :color="color" multi-line>
      {{ text }}

      <template v-slot:actions>
        <v-btn color="white" variant="text" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script setup>
import { ref } from "vue";

const snackbar = ref(false);
const color = ref("");
const text = ref("");

function displaySnackbar(type, message) {
  snackbar.value = true;

  if (type === "error") {
    color.value = "red";
  } else if (type === "success") {
    color.value = "green";
  } else {
    color.value = "blue";
  }
  text.value = message;
}

defineExpose({
  displaySnackbar,
});
</script>
