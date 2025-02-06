<template>
  <v-container>
    <div class="d-flex align-center flex-column">
      <v-card elevated color="red-darken-1" class="pageError">
        <v-card-title>An error as occured</v-card-title>
        <v-card-text>{{ errorMsg }}</v-card-text>
      </v-card>
    </div>
  </v-container>
</template>

<script setup>
const props = defineProps({
  errorMsg: String,
});
</script>

<style scoped>
.pageError {
  width: 75%;
  text-align: center;
}
</style>
