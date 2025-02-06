<template>
  <v-container>
    <div v-if="!isLoading">
      <v-row class="is-flex container-flex-direction">
        <gravatar :email="user.email"></gravatar>
        <user-info
          :name="user.name"
          :email="user.email"
          :rating="user.rating"
        ></user-info>
        <follow-user
          v-if="user.id !== store.userId"
          :id-to-follow="user.id"
          :following="props.following"
          :followers="props.followers"
        ></follow-user>
      </v-row>
      <v-row
        class="is-flex container-flex-direction is-justify-content-space-between mt-6"
      >
        <favorites
          v-if="user.id === store.userId"
          :favorite-list="favoriteListsReactive"
          class="half-page-to-full"
          :user-email="user.email"
          :user-id="user.id"
        ></favorites>

        <recently-view
          v-if="user.id === store.userId"
          :favorite-list="favoriteListsReactive.lists"
          class="half-page-to-full"
          :user-id="user.id"
          @update-favorite-lists="
            (idList, idRestaurant) => updateFavoriteLists(idList, idRestaurant)
          "
        ></recently-view>
      </v-row>
    </div>
    <div v-else class="loading">
      <v-progress-circular indeterminate></v-progress-circular>
    </div>

    <snackbar ref="snackbar"></snackbar>
  </v-container>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";

import Gravatar from "@/components/user/Gravatar.vue";
import UserInfo from "@/components/user/UserInfo.vue";
import RecentlyView from "@/components/user/info/RecentlyView.vue";
import Favorites from "@/components/user/info/Favorites.vue";
import { useUserFavoriteResto } from "@/components/user/composables/useUserData";
import Snackbar from "@/components/utils/Snackbar.vue";
import { store } from "@/script/store";
import FollowUser from "@/components/user/follow/FollowUser.vue";

const props = defineProps({
  user: Object,
  following: Object,
  followers: Object,
});

const snackbar = ref(null);

const { favoriteLists, isLoading } = useUserFavoriteResto(props.user.id);
let favoriteListsReactive = reactive(favoriteLists);

/**
 * is Responsible to update reactive FavoriteLists in order to add a restaurant.
 */
function updateFavoriteLists(idList, idRestaurant) {
  const targetList = favoriteLists.lists.find((list) => list.id === idList);
  if (targetList) {
    if (!targetList.restaurants.includes(idRestaurant)) {
      targetList.restaurants.push({ id: idRestaurant });
    }
  }
}

onMounted(() => {
  isLoading.value = false;
});
</script>

<style scoped></style>
