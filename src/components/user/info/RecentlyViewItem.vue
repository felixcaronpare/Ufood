<template>
  <v-list-item>
    <div v-if="!isLoading" class="is-flex">
      <v-col cols="1">
        <VisitModal
          :restaurant-name="restoName"
          :isReadOnly="true"
          :v-visit="vVisit"
        >
          <template v-slot:openModal="{ props }">
            <v-btn
              icon="fas fa-street-view"
              v-bind="props"
              density="compact"
              variant="plain"
            ></v-btn>
          </template>
        </VisitModal>
      </v-col>

      <v-col cols="me-auto" sm="3" class="me-auto d-flex">
        <router-link
          :to="{ name: 'Restaurant', params: { id: vVisit.restaurant_id } }"
          >{{ restoName }}</router-link
        >
      </v-col>

      <v-col class="me-auto d-flex flex-wrap is-justify-content-space-evenly">
        <div id="date">
          <input type="datetime-local" :value="vVisit.date" readonly disabled />
        </div>
        <add-to-a-favorite-list-userpage
          :restaurant-id="props.vVisit.restaurant_id"
          :favorite-lists="favoriteList"
          @update-favorite-lists="
            (idList, idRestaurant) => updateFavoriteLists(idList, idRestaurant)
          "
        ></add-to-a-favorite-list-userpage>
      </v-col>
    </div>

    <div v-else class="loading">
      <v-progress-circular indeterminate></v-progress-circular>
    </div>
  </v-list-item>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { getRestaurant } from "@/script/api/restaurants";
import AddToAFavoriteListUserpage from "@/components/user/info/AddToAFavoriteListUserpage.vue";
import VisitModal from "@/components/VisitModal.vue";

const props = defineProps({
  vVisit: {
    type: Object,
    required: true,
  },
  favoriteList: Array,
});

const emit = defineEmits(["updateCurrentList", "updateFavoriteLists"]);

const restoName = ref("");
const isLoading = ref(true);

async function loadRestaurant() {
  const { name } = await getRestaurant(props.vVisit.restaurant_id);
  restoName.value = name;
  isLoading.value = false;
}

onMounted(() => {
  loadRestaurant();
});

function updateFavoriteLists(idList, idRestaurant) {
  emit("updateFavoriteLists", idList, idRestaurant);
}
</script>

<style scoped>
#date {
  width: 8.5em;
}

.me-auto {
  white-space: normal;
}
</style>
