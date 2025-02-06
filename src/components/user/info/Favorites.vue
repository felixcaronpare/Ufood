<template>
  <v-card flat id="favoritesResto">
    <div class="title-color pa-2">Favorites</div>
    <v-container>
      <add-new-list :owner="userEmail" :favorite-list="favoriteList" />
      <list-tabs
        :favoriteLists="favoriteList"
        :user-id="userId"
        :user-email="userEmail"
        @on-name-changed="
          (emittedListId, emittedListName) =>
            updateLists(emittedListId, emittedListName)
        "
        @deleted-list="(itemId) => deleteLists(itemId)"
        @deleted-resto="
          (selectedListid, restaurantId) =>
            deleteResto(selectedListid, restaurantId)
        "
      />
    </v-container>
  </v-card>
</template>

<script setup>
import ListTabs from "@/components/user/favoriteLists/SelectFavoriteList.vue";
import AddNewList from "@/components/user/favoriteLists/AddNewList.vue";
import { reactive } from "vue";

const user = defineProps({
  userId: String,
  userEmail: String,
  favoriteList: {
    type: Object,
    required: true,
  },
});

const favoriteLists = reactive(user.favoriteList);
/**
 * Fonctions call-back pour traiter l'emit envoye par ListTabs afin de mettre a jour la favortieList
 *
 */

async function updateLists(emittedListId, emittedListName) {
  const idx = favoriteLists.lists.findIndex((obj) => obj.id === emittedListId);
  favoriteLists.lists[idx].name = emittedListName;
}

const deleteLists = (itemId) => {
  const idx = favoriteLists.lists.findIndex((obj) => obj.id === itemId);
  favoriteLists.lists.splice(idx, 1);
};

const deleteResto = (selectedListid, restaurantId) => {
  for (const list of favoriteLists.lists) {
    for (const restaurant of list.restaurants) {
      if (restaurant.id === restaurantId) {
        const idx = list.restaurants.indexOf(restaurant);
        list.restaurants.splice(idx, 1);
      }
    }
  }
};
</script>

<style scoped></style>
