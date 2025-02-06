<template>
  <div class="d-flex flex-column align-self-end">
    <v-menu>
      <template v-slot:activator="{ props }">
        <v-btn v-bind="props" size="x-small" text="Favorite"></v-btn>
      </template>

      <v-list>
        <v-list-item
          v-for="list in favoriteLists"
          :key="list.id"
          @click="onClick(list.id, props.restaurantId)"
        >
          <v-list-item-title>{{ list.name }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
    <snackbar ref="snackbar"></snackbar>
  </div>
</template>

<script setup>
//Imports
import { inject, onMounted, ref, watch } from "vue";
import { addFavoriteRestaurant, getFavoriteList } from "@/script/api/favorites";
import Snackbar from "@/components/utils/Snackbar.vue";
import { store } from "@/script/store";

//Props
const props = defineProps({
  restaurantId: String,
  favoriteLists: Array,
});

//Emits
const emits = defineEmits([
  "favoriteRefused",
  "updateFavoriteLists",
  "addToList",
  "emitListid",
]);

// Injection of a global Emit
const emitter = inject("emitter");

//Variables
const isFavorited = ref(false); //Boolean : true if restaurantId is in any of the user's favorite lists.
const snackbar = ref(null); //For error handling

// Establishes if isFavorited = true or false as soon as component loads
watch(
  () => props.favoriteLists.lists,
  (newLists) => {
    if (newLists.length > 0) {
      for (const list of newLists) {
        for (const restaurant of list.restaurants) {
          if (restaurant.id === props.restaurantId) {
            isFavorited.value = true;
            return;
          }
        }
      }
    }
  },
);

// Adds/rejects restaurant to favorite list and updates isFavorited
const onClick = async (idList, idRestaurant) => {
  try {
    const myList = await getFavoriteList(idList);
    let isRestaurantInList = false;

    for (let restaurant of myList.restaurants) {
      if (restaurant.id === idRestaurant) {
        isRestaurantInList = true;
        break;
      }
    }

    if (isRestaurantInList) {
      snackbar.value.displaySnackbar(
        "error",
        "Restaurant already in the selected favorite list ! Select the list from your profile page if you wish to remove the restaurant from it.",
      );
    } else {
      try {
        await addFavoriteRestaurant(idList, idRestaurant);
        // This line emits a global event to be listened to by the SelectFavoriteList component.
        emitter.emit("emitListid", idList);
        emitter.emit("addToList", idRestaurant);
        emits("updateFavoriteLists", idList, idRestaurant);
        isFavorited.value = true;
        snackbar.value.displaySnackbar("success", "Restaurant favorited!");
      } catch (error) {
        if (store.userId !== "" && snackbar.value !== null)
          snackbar.value.displaySnackbar("error", error);
      }
    }
  } catch (error) {
    if (store.userId !== "" && snackbar.value !== null)
      snackbar.value.displaySnackbar("error", error);
  }
};

/**
 * Is responsible for updating if a restaurant is in a favorite List
 */
onMounted(() => {
  for (const list of props.favoriteLists) {
    for (const restaurant of list.restaurants) {
      if (restaurant.id === props.restaurantId) {
        isFavorited.value = true;
        return;
      }
    }
  }
});
</script>

<style scoped></style>
