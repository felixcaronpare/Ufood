<template>
  <div>
    <h4 class="text-h4">Opening Hours</h4>
    <v-table>
      <tbody>
        <tr v-for="(day, key) in openingHours" :key="key">
          <td>{{ setUpperCase(key) }}</td>
          <td v-if="day">{{ day }}</td>
          <td v-else>Closed</td>
        </tr>
      </tbody>
    </v-table>
  </div>
</template>

<script setup>
const props = defineProps({
  openingHours: Object,
});

function setUpperCase(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
</script>

<style scoped>
td {
  vertical-align: middle;
}
</style>
