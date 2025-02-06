<template>
  <div>
    <v-label :text="distanceAway"></v-label>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import * as turf from "@turf/turf";
const props = defineProps({
  coordinatesTo: Array,
});

const distanceAway = ref("0 km");

onMounted(async () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      let from = turf.point([
        position.coords.longitude,
        position.coords.latitude,
      ]);
      let to = turf.point(props.coordinatesTo);
      let options = { units: "kilometers" };

      let distance = turf.distance(from, to, options);

      if (distance >= 100) {
        distanceAway.value = `${distance.toFixed(0)} km`;
      } else if (distance >= 1) {
        distanceAway.value = `${distance.toFixed(1)} km`;
      } else {
        distanceAway.value = `${(distance * 1000).toFixed(0)} m`;
      }
    });
  }
});
</script>
