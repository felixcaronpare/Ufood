<template>
  <v-container class="pages-content">
    <restaurant-header
      v-if="!isLoadingResto"
      :restaurant="data.restaurant"
      :is-link="false"
      :user-favorite-lists="userFavoriteLists"
    ></restaurant-header>

    <pictures :pictures="data.restaurant.pictures"></pictures>

    <div class="directions-and-opening-hours d-flex mt-2">
      <div class="map-container w-75">
        <div id="mapboxMap" class="w-100"></div>
        <map-direction
          class="map-direction"
          v-if="directionLoaded && instruction.steps.length > 0"
          :instruction="instruction"
        ></map-direction>
      </div>
      <div class="justify-center align-center text-center">
        <v-btn
          color="blue-darken-1"
          id="directions-button"
          @click="getMapBoxDirection"
          >Get Directions</v-btn
        >
        <schedule :opening-hours="data.restaurant.opening_hours"></schedule>
      </div>
    </div>
    <snackbar ref="snackbar"></snackbar>
  </v-container>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import RestaurantHeader from "@/components/restaurant/RestaurantHeader.vue";
import pictures from "@/components/restaurant/Pictures.vue";
import schedule from "@/components/restaurant/Schedule.vue";

import { getRestaurant } from "@/script/api/restaurants";
import mapboxgl from "mapbox-gl/dist/mapbox-gl.js";
import {
  accessToken,
  addMarker,
  getDirection,
  setBound,
} from "@/script/mapbox/MapBoxControl";
import { useUserFavoriteResto } from "@/components/user/composables/useUserData.js";
import { store } from "@/script/store";
import { useLocation } from "@/script/useLocation";
import Snackbar from "@/components/utils/Snackbar.vue";
import MapDirection from "@/components/utils/MapDirection.vue";

const data = reactive({ restaurant: [] });

const resto = defineProps({
  id: String,
});

const snackbar = ref(null);

const { favoriteLists } = useUserFavoriteResto(store.userId);
const userFavoriteLists = favoriteLists;

let map = ref(null);
const loadMapBox = async () => {
  mapboxgl.accessToken = accessToken;

  map.value = await new mapboxgl.Map({
    container: "mapboxMap",
    style: "mapbox://styles/mapbox/streets-v12",
    center: [
      data.restaurant.location.coordinates[0],
      data.restaurant.location.coordinates[1],
    ],
    zoom: 13,
  });

  await addMarker(
    map,
    data.restaurant.location.coordinates[0],
    data.restaurant.location.coordinates[1],
  );
};

const directionLoaded = ref(false);
const instruction = ref(null);
const { location, error } = useLocation();
const getMapBoxDirection = async () => {
  if (error.value === "") {
    if (!directionLoaded.value) {
      instruction.value = await getDirection(map, data.restaurant.location);
      directionLoaded.value = true;
    } else {
      await setBound(map, [
        location.value,
        data.restaurant.location.coordinates,
      ]);
    }
  } else {
    snackbar.value.displaySnackbar("error", error.value);
  }
};

const isLoadingResto = ref(true);
onMounted(async () => {
  try {
    data.restaurant = await getRestaurant(resto.id);
    isLoadingResto.value = false;
    await loadMapBox();
  } catch (error) {
    snackbar.value.displaySnackbar("error", error);
  }
});
</script>

<style scoped>
.map-container {
  position: relative;
}

.map-direction {
  position: absolute;
  width: 33%;
  margin: 1em;
}

#mapboxMap {
  position: absolute;
  height: 50vh;
}

.directions-and-opening-hours {
  column-gap: 0.5em;
}

@media screen and (max-width: 1022px) {
  .directions-and-opening-hours {
    justify-content: center;
    align-items: center;
    flex-direction: column;
    row-gap: 0.5em;
  }
  #mapboxMap {
    position: unset;
  }
  .map-direction {
    position: unset;
    width: unset;
    margin: unset;
  }

  .map-container {
    width: 100%;
  }
}
</style>
