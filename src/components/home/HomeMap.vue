<template>
  <v-container>
    <div v-if="loading">
      Loading map...
      <br />
      <v-progress-linear indeterminate color="cyan"></v-progress-linear>
      <br />
    </div>
    <div v-if="markersIsEmpty">
      No nearby restaurants fit your search criterias
    </div>
    <div id="mapboxMap"></div>
  </v-container>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import mapboxgl from "mapbox-gl";
import {
  accessToken,
  addMarkerWithPopup,
  clearMarker,
  setBound,
} from "@/script/mapbox/MapBoxControl";
import { store } from "@/script/store";

const props = defineProps({
  markers: Array,
  selectedPrice: String,
  selectedGenres: String,
  selectedSearchName: String,
  restaurantsList: Object,
  textUpdate: String,
});

const loading = ref(false);
const markersIsEmpty = ref(false);
const snackbar = ref(null); //For error handling
const emits = defineEmits(["updatePosition"]);

let map = ref(null);
const loadMapBox = async () => {
  mapboxgl.accessToken = accessToken;
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (position) => {
      map.value = await new mapboxgl.Map({
        container: "mapboxMap",
        style: "mapbox://styles/mapbox/streets-v12",
        center: [position.coords.longitude, position.coords.latitude],
        zoom: 13,
      });

      map.value.on("moveend", () => {
        const { lng, lat } = map.value.getCenter();
        emits("updatePosition", { lng: lng, lat: lat });
      });

      await setBound(map, props.markers);
      loading.value = false;
    });
  } else {
    if (store.userId !== "" && snackbar.value !== null)
      snackbar.value.displaySnackbar(
        "error",
        "Your browser settings are currently blocking geolocation",
      );
  }
};

const addMarkerToMap = async () => {
  await clearMarker();
  for (let i = 0; i < props.restaurantsList.length; i++) {
    const description = `<div><strong><a href="http://localhost:8080/restaurant/${props.restaurantsList[i].id}" ${props.restaurantsList[i].name}</a>${props.restaurantsList[i].name}</strong><p class="text-black">${props.restaurantsList[i].address}</p></div>`;
    await addMarkerWithPopup(
      map,
      props.restaurantsList[i].location.coordinates[0],
      props.restaurantsList[i].location.coordinates[1],
      description,
    );
  }

  markersIsEmpty.value = props.markers.length === 0;
};

watch(
  [
    () => props.selectedPrice,
    () => props.selectedGenres,
    () => props.selectedSearchName,
  ],
  async ([newSelectedPrice, newSelectedGenres, newSelectedSearchName]) => {
    loading.value = true;
  },
);

watch(
  [() => props.markers, () => props.textUpdate],
  async (newMarker, newText) => {
    loading.value = true;
    await addMarkerToMap();

    if (props.textUpdate !== undefined && props.textUpdate !== "")
      await setBound(map, props.markers);
    loading.value = false;
  },
);

onMounted(async () => {
  if (!map.value) {
    loading.value = true;
    await loadMapBox();
  }
});
</script>

<style scoped>
#mapboxMap {
  width: 100%;
  height: 70vh;
}
</style>
