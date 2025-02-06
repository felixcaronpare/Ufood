<template>
  <div class="d-flex flex-column align-self-end">
    <v-menu>
      <template v-slot:activator="{ props }">
        <v-btn
          :class="{ 'text-red-accent-3': isFavorited }"
          v-bind="props"
          size="x-small"
          :text="isFavorited ? 'Favorited' : 'Favorite'"
          :prepend-icon="
            isFavorited ? 'fa-solid fa-heart' : 'fa-regular fa-heart'
          "
        ></v-btn>
      </template>

      <v-list>
        <AddToAFavoriteListItem
          v-for="list in favoriteLists.lists"
          :restaurant-id="restaurantId"
          :key="list.id"
          :list="list"
          :onClick="() => onClick(list.id, props.restaurantId)"
        />
      </v-list>
    </v-menu>
    <snackbar ref="snackbar"></snackbar>
  </div>
</template>

<script setup>
//Imports

import { ref, watchEffect } from "vue";
import { addFavoriteRestaurant, getFavoriteList } from "@/script/api/favorites";
import { useUserFavoriteResto } from "@/components/user/composables/useUserData.js";
import AddToAFavoriteListItem from "@/components/restaurant/AddToAFavoriteListItem.vue";
import { store } from "@/script/store";
import Snackbar from "@/components/utils/Snackbar.vue";

//Props
const props = defineProps({
  restaurantId: String,
});

//Emits
defineEmits(["favoriteRefused"]);

//Variables
const isFavorited = ref(false); //Boolean : true if restaurantId is in any of the user's favorite lists.
const snackbar = ref(null); //For error handling
const { favoriteLists } = useUserFavoriteResto(store.userId); //

//Functions
// Establishes if isFavorited = true or false as soon as component loads
watchEffect(() => {
  if (favoriteLists.lists.length > 0) {
    const newFavoritedStatus = favoriteLists.lists.map((list) => {
      return list.restaurants.some(
        (restaurant) => restaurant.id === props.restaurantId,
      );
    });
    isFavorited.value = newFavoritedStatus.some((status) => status);
  }
});

// Adds/rejects restaurant to favorite list and updates isFavorited
const onClick = async (idList, idRestaurant) => {
  try {
    const myList = await getFavoriteList(idList);
    let isRestaurantInList = false;

    //Check if restaurantId is in the clicked list
    for (let restaurant of myList.restaurants) {
      if (restaurant.id === idRestaurant) {
        isRestaurantInList = true;
        break;
      }
    }

    //If restaurantId is in the clicked list, raise error
    if (isRestaurantInList) {
      if (store.userId !== "" && snackbar.value !== null)
        snackbar.value.displaySnackbar(
          "error",
          "Restaurant already in the selected favorite list! Select the list from your profile page if you wish to remove the restaurant from it.",
        );

      //If restaurantId not in clicked list, add restaurant to list and update isFavorited
    } else {
      try {
        await addFavoriteRestaurant(idList, idRestaurant);
      } catch (error) {
        if (store.userId !== "" && snackbar.value !== null)
          snackbar.value.displaySnackbar("error", error);
      }
      isFavorited.value = true;
      if (store.userId !== "" && snackbar.value !== null)
        snackbar.value.displaySnackbar("success", "Restaurant favorited!");
    }
  } catch (error) {
    if (store.userId !== "" && snackbar.value !== null)
      snackbar.value.displaySnackbar("error", error);
  }
};
</script>

<style scoped></style>
