<template>
  <div>
    <v-list-item
      class="align-self-end v-list-item--active"
      :class="{ 'text-red-accent-3': isRestaurantInList }"
      :prepend-icon="
        isRestaurantInList ? 'fa-solid fa-heart' : 'fa-regular fa-heart'
      "
    >
      <v-list-item-title>{{ props.list.name }}</v-list-item-title>
    </v-list-item>
    <snackbar ref="snackbar"></snackbar>
  </div>
</template>

<script setup>
//Imports
import { getFavoriteList } from "@/script/api/favorites";
import { ref, watchEffect } from "vue";
import Snackbar from "@/components/utils/Snackbar.vue";
import { store } from "@/script/store";

//Props
const props = defineProps({
  restaurantId: String,
  list: Object,
});

//Variables
const isRestaurantInList = ref(false);
const snackbar = ref(null); //For error handling

//Functions
//Checks if restaurantId is in the list of this item
const checkRestaurantInList = async () => {
  try {
    const myList = await getFavoriteList(props.list.id);
    isRestaurantInList.value = myList.restaurants.some(
      (restaurant) => restaurant.id === props.restaurantId,
    );
  } catch (error) {
    if (store.userId !== "" && snackbar.value !== null)
      snackbar.value.displaySnackbar("error", error);
  }
};

//Watches for changes in to the list
watchEffect(() => {
  checkRestaurantInList();
});
</script>

<style scoped>
.v-list-item--active:hover {
  background-color: lightgrey;
  cursor: pointer;
}
</style>
