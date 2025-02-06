<template>
  <v-container class="pages-content">
    <v-toolbar density="compact">
      <v-toolbar-items class="w-100">
        <search-bar
          class="w-100"
          :home-mode="mode"
          @update:model-value="
            (myText) => {
              selectedSearchName = myText;
            }
          "
          @map-search="(text) => handleMapSearch(text)"
        ></search-bar>
      </v-toolbar-items>
      <v-menu>
        <template v-slot:activator="{ props }">
          <v-toolbar-items>
            <v-btn v-bind="props" @click="showFilter = !showFilter">
              <v-icon>fa-solid fa-ellipsis-vertical</v-icon>
            </v-btn>
          </v-toolbar-items>
        </template>
      </v-menu>
    </v-toolbar>
    <div v-if="showFilter" class="d-flex container-flex-direction">
      <genre-filter
        class="half-page-to-full"
        @selected-genres="updateSelectedGenres"
      ></genre-filter>
      <price-filter
        class="half-page-to-full"
        @selected-price="updateSelectedPrice"
      ></price-filter>
    </div>
    <v-btn
      class="filter"
      v-model="mode"
      @click="changeMode"
      :prepend-icon="iconMode"
      :text="mode"
    ></v-btn>
    <v-row v-if="mode === 'List'" class="home-content">
      <home-list
        :hide-more-result="hideLoadMore"
        @next-page="loadRestaurant(scroll.loadedPage + 1)"
        :restaurants-list="data.restaurants.items"
        :page="scroll.loadedPage"
      ></home-list>
    </v-row>
    <home-map
      v-if="mode === 'Map'"
      :markers="markers"
      :selected-genres="selectedGenres"
      :selected-price="selectedPrice"
      :selected-search-name="selectedSearchName"
      :restaurants-list="data.restaurants.items"
      @update-position="(coords) => handleUpdatePosition(coords)"
      :text-update="textSearch"
    ></home-map>
    <snackbar ref="snackbar"></snackbar>
  </v-container>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import { getRestaurants } from "@/script/api/restaurants";
import PriceFilter from "@/components/PriceFilter.vue";
import GenreFilter from "@/components/GenreFilter.vue";
import SearchBar from "@/components/SearchBar.vue";
import HomeList from "@/components/home/HomeList.vue";
import HomeMap from "@/components/home/HomeMap.vue";
import Snackbar from "@/components/utils/Snackbar.vue";
import { store } from "@/script/store";
import { getPosition } from "@/script/useLocation";

const mode = ref("List");
const iconMode = ref("fas fa-utensils");

const data = reactive({ restaurants: [] });
const markers = ref([]);
const selectedSearchName = ref("");

const changeMode = async () => {
  switch (mode.value) {
    case "Map":
      mode.value = "List";
      iconMode.value = "fas fa-utensils";
      resetPageCount();
      await loadRestaurant(0);
      break;
    default:
      mode.value = "Map";
      iconMode.value = "fa-regular fa-map";
      resetPageCount();
      await loadRestaurant(0);
      break;
  }
};

const snackbar = ref(null);
const showFilter = ref(false);
const selectedPrice = ref("");
const updateSelectedPrice = async (price) => {
  selectedPrice.value = "";
  let counts = [];
  for (let i = 0; i < price.length; i++) {
    let count = 0;
    let characters = price[i].split("");
    for (let j = 0; j < characters.length; j++) {
      if (characters[j] === "$") {
        count++;
      }
    }
    counts.push(count);
  }

  resetPageCount();
  selectedPrice.value = counts.join(", ");
  await loadRestaurant(0);
};

const resetPageCount = () => {
  scroll.maxPage = 0;
  scroll.loadedPage = 0;
  data.restaurants.items = undefined;
};

const scroll = reactive({ maxPage: 0, loadedPage: -1 });
const selectedGenres = ref("");
const updateSelectedGenres = async (genres) => {
  selectedGenres.value = "";

  selectedGenres.value = genres.join(", ");
  resetPageCount();
  await loadRestaurant(0);
};

const hideLoadMore = ref(false);
const loadRestaurant = async (page) => {
  try {
    if (mode.value === "List") {
      await getPosition()
      .then((pos) => {
        currentPos = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      })
      .catch((err) => {
        if (store.userId !== "") snackbar.value.displaySnackbar("error", err);
      });

      const result = await handleSearch({
        limit: mode.value === "Map" ? 10 : 2,
        q: selectedSearchName.value,
        page: page,
        genres: selectedGenres.value,
        price_range: selectedPrice.value,
        lon: currentPos?.lng,
        lat: currentPos?.lat,
      });
      scroll.maxPage = Math.ceil(result.total / 2);
      scroll.loadedPage++;

      hideLoadMore.value = scroll.maxPage <= scroll.loadedPage;
    } else if (mode.value === "Map") {
      const result = await handleSearch({
        limit: mode.value === "Map" ? 10 : 2,
        q: selectedSearchName.value,
        page: page,
        genres: selectedGenres.value,
        price_range: selectedPrice.value,
        lon: currentPos?.lng,
        lat: currentPos?.lat,
      });

      markers.value = result.items.map((resto) => resto.location.coordinates);
    }
  }
  catch (error) {
    if (store.userId !== "") snackbar.value.displaySnackbar("error", error);
  }
};
const handleUpdatePosition = async (coords) => {
  if (textSearch.value === undefined || textSearch.value === "") {
    try {
      const result = await handleSearch({
        limit: 10,
        q: selectedSearchName.value,
        genres: selectedGenres.value,
        price_range: selectedPrice.value,
        lon: coords.lng,
        lat: coords.lat,
      });

      currentPos = coords;
      markers.value = result.items.map((resto) => resto.location.coordinates);
    } catch (error) {
      if (store.userId !== "") snackbar.value.displaySnackbar("error", error);
    }
  }
};

const textSearch = ref(undefined);
const handleMapSearch = async (text) => {
  data.restaurants.items = undefined;
  try {
    const result = await handleSearch({
      limit: 10,
      q: text.value,
      genres: selectedGenres.value,
      price_range: selectedPrice.value,
    });

    textSearch.value = text.value;
    markers.value = result.items.map((resto) => resto.location.coordinates);
  } catch (error) {
    if (store.userId !== "") snackbar.value.displaySnackbar("error", error);
  }
};

const handleSearch = async (params) => {
  const result = await getRestaurants(params);
  let items;

  if (data.restaurants.items !== undefined) {
    let toAdd = [];
    for (let resto of result.items) {
      if (data.restaurants.items.findIndex((r) => r.id === resto.id) === -1)
        toAdd.push(resto);
    }
    items = data.restaurants.items.concat(toAdd);
    data.restaurants.items = items;
  } else {
    data.restaurants = result;
  }

  return result;
};

let currentPos;
onMounted(async () => {
  await getPosition()
    .then((pos) => {
      currentPos = { lat: pos.coords.latitude, lng: pos.coords.longitude };
    })
    .catch((err) => {
      if (store.userId !== "") snackbar.value.displaySnackbar("error", err);
    });
});
</script>

<style scoped></style>
