<template>
  <v-container class="ma-0">
    <v-card class="d-flex card-flex-direction tile-height">
      <v-img
        v-if="restaurant.pictures"
        class="text-white restaurant-banner mr-2 img-size"
        :src="restaurant.pictures[0]"
        cover
      >
        <div class="d-flex h-100">
          <p class="pl-1 align-self-end genres-background">
            <v-icon size="x-small" icon="fa:fas fa-utensils"></v-icon>&nbsp;
            <span v-for="(genre, index) in restaurant.genres" :key="index">
              {{ genre }}&nbsp;
            </span>
          </p>
        </div>

        <div class="visited-favorite-buttons">
          <div class="d-flex flex-row justify-space-between pl-1 pr-1 pt-1">
            <visit-modal
              :restaurant-name="restaurant.name"
              :is-read-only="false"
              :v-visit="{
                user_id: store.userId,
                restaurant_id: restaurant.id,
                comment: '',
                rating: 0,
                date: undefined,
              }"
              @add-visit="nbVisit++"
            >
              <template v-slot:openModal="{ props }">
                <v-btn
                  :prepend-icon="
                    nbVisit > 0 ? 'fas fa-check-double' : 'fas fa-street-view s'
                  "
                  size="x-small"
                  v-bind="props"
                  :text="nbVisit > 0 ? `${nbVisit} visit(s)` : 'Visited'"
                  :loading="isLoadingVisit"
                  :class="{ 'title-color': nbVisit > 0 }"
                ></v-btn>
              </template>
            </visit-modal>
            <add-to-a-favorite-list
              :restaurant-id="restaurant.id"
            ></add-to-a-favorite-list>
          </div>
        </div>
      </v-img>

      <v-container class="pa-0 pr-1 h-100">
        <p class="text-h6 mb-0">
          <router-link
            v-if="isLink"
            :to="{ name: 'Restaurant', params: { id: restaurant.id } }"
          >
            {{ restaurant.name }}</router-link
          >
          <span v-else>{{ restaurant.name }}</span>
        </p>
        <p>
          <span>
            <rating-stars
              v-if="restaurant.rating"
              :rating-restaurant="
                Math.round((restaurant?.rating ?? 0) * 100) / 100
              "
              :is-read-only="true"
            ></rating-stars>
          </span>
          <span class="float-right">
            <span v-for="index in restaurant.price_range" :key="index">$</span>
            <distance-from
              v-if="restaurant.location"
              :coordinates-to="restaurant.location.coordinates"
            ></distance-from
          ></span>
        </p>

        <p>
          <v-icon size="small" icon="fa:fas fa-location-dot"></v-icon>
          Address:
        </p>
        <p>{{ restaurant.address }}</p>
        <p>
          <v-icon size="small" icon="fa:fas fa-phone"></v-icon>
          Phone number :
        </p>
        <p>{{ restaurant.tel }}</p>
      </v-container>
    </v-card>
    <snackbar ref="snackbar"></snackbar>
  </v-container>
</template>

<script setup>
import { onMounted, ref } from "vue";
import DistanceFrom from "@/components/utils/DistanceFrom.vue";
import VisitModal from "@/components/VisitModal.vue";
import RatingStars from "@/components/utils/RatingStars.vue";
import { store } from "@/script/store";
import { getAllVisitsToOneRestaurantByOneUser } from "@/script/api/visits";
import AddToAFavoriteList from "./AddToAFavoriteList.vue";
import Snackbar from "@/components/utils/Snackbar.vue";

const nbVisit = ref(0);

const snackbar = ref(null);

const props = defineProps({
  restaurant: Object,
  isLink: Boolean,
});

const isLoadingVisit = ref(true);
onMounted(async () => {
  try {
    await getAllVisitsToOneRestaurantByOneUser({
      id: store.userId,
      restaurantId: props.restaurant.id,
      limit: 1,
    }).then((visite) => {
      nbVisit.value = visite.total;
    });
  } catch (e) {
    if (store.userId !== "" && snackbar.value !== null)
      snackbar.value.displaySnackbar("error", e);
  }
  isLoadingVisit.value = false;
});
</script>

<style scoped>
.card-flex-direction {
  flex-direction: row;
}
.restaurant-banner {
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
}

.visited-favorite-buttons {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  top: 0;
}
.tile-height {
  height: 300px;
  min-height: 300px;
}

.img-size {
  height: 100%;
  width: 225px;
}

@media screen and (max-width: 1408px) {
  .card-flex-direction {
    flex-direction: column;
  }

  .tile-height {
    height: 400px;
    min-height: 400px;
  }

  .img-size {
    height: 200px;
    width: 100%;
  }
}

@media screen and (max-width: 1279px) {
  .tile-height {
    height: 450px;
    min-height: 450px;
  }
}

@media screen and (max-width: 1023px) {
  .tile-height {
    height: 100%;
  }
}
</style>
