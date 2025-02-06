<template>
  <v-card flat id="recentlyView">
    <div class="title-color pa-2">Recently viewed</div>
    <v-list>
      <div v-if="isError" class="loading">
        {{ errorMsg }}<br />
        <router-link to="/">Restaurant list</router-link>
      </div>
      <div v-else-if="!isError && !isLoading && recentVisites.items.length > 0">
        <div v-if="nbPage > 1" class="d-flex justify-center">
          <v-btn
            :disabled="currentPage - 1 === 0"
            @click="loadPage(currentPage - 1)"
            >&lt;&lt;</v-btn
          >

          <v-btn
            :disabled="currentPage === nbPage"
            @click="loadPage(currentPage + 1)"
            >&gt;&gt;</v-btn
          >
        </div>

        <div v-for="visited in recentVisites.items" :key="visited.id">
          <recently-view-item
            @update-favorite-lists="
              (idList, idRestaurant) =>
                updateFavoriteLists(idList, idRestaurant)
            "
            :v-visit="{
              user_id: props.userId,
              restaurant_id: visited.restaurant_id,
              id: visited.id,
              comment: visited.comment,
              rating: visited.rating,
              date: visited.date.slice(0, 16),
            }"
            :favorite-list="favoriteList"
          >
          </recently-view-item>
        </div>
      </div>
      <div v-else-if="!isLoading">
        <router-link to="/">Restaurant list</router-link>
      </div>
      <div v-else class="loading">
        <v-progress-circular indeterminate></v-progress-circular>
      </div>
    </v-list>
    <snackbar ref="snackbar"></snackbar>
  </v-card>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { getAllRestaurantsVisitedByUser } from "@/script/api/visits";
import RecentlyViewItem from "@/components/user/info/RecentlyViewItem.vue";
import Snackbar from "@/components/utils/Snackbar.vue";
import { store } from "@/script/store";

const snackbar = ref(null);

const props = defineProps({
  userId: String,
  favoriteList: Array,
});

const recentVisites = ref([]);
const isLoading = ref(true);
const isError = ref(false);
const errorMsg = ref("");

const currentPage = ref(0);
const nbPage = ref(0);

const emit = defineEmits(["updateCurrentList", "updateFavoriteLists"]);

const loadPage = async (newPage) => {
  if (newPage !== currentPage.value) {
    await getAllRestaurantsVisitedByUser({
      id: props.userId,
      page: newPage - 1,
    })
      .then((success) => {
        recentVisites.value = success;
        currentPage.value = newPage;
        nbPage.value = Math.ceil(success.total / 10);
      })
      .catch((e) => {
        if (store.userId !== "") snackbar.value.displaySnackbar("error", error);
        isError.value = true;
      });
  }

  isLoading.value = false;
};

function updateFavoriteLists(idList, idRestaurant) {
  emit("updateFavoriteLists", idList, idRestaurant);
}

onMounted(() => {
  loadPage(1);
});
</script>

<style scoped>
.loading {
  text-align: center;
}
</style>
