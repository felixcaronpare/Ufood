<template>
  <div class="search-bar">
    <v-text-field
      @click="isVisible = !isVisible && homeMode !== 'Map'"
      label="Search"
      type="text"
      v-model="myText"
      :model-value="myText"
      :items="maListe"
      @keyup.enter="findResto"
      @input="getRestaurantsNameId"
      clearable
      rounded="0"
      density="compact"
      hide-details
    ></v-text-field>
    <v-menu v-if="isVisible" v-model="isVisible" offset-y>
      <template v-slot:activator="{ attrs }">
        <div v-bind="attrs" class="dropdown-popover">
          <div class="options">
            <ul>
              <li
                v-for="(restaurant, index) in restoName"
                :key="`restaurant-${index}`"
                @click="selectItem(restaurant)"
              >
                {{ restaurant }}
              </li>
            </ul>
          </div>
        </div>
      </template>
    </v-menu>
    <snackbar ref="snackbar"></snackbar>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref, watch } from "vue";
import { getRestaurants } from "@/script/api/restaurants";
import { router } from "@/router";
import Snackbar from "@/components/utils/Snackbar.vue";
import { store } from "@/script/store";

const snackbar = ref(false);

const data = reactive({ restaurant: [] });
const myText = ref("");
const restoName = ref([]);
const restoId = ref([]);
const maListe = ref(restoName);

const isVisible = ref(false);

const props = defineProps({
  homeMode: String,
});

const emit = defineEmits(["update:model-value", "mapSearch"]);

function findResto() {
  if (props.homeMode !== "Map") {
    if (restoName.value.includes(myText.value)) {
      const position = restoName.value.findIndex(
        (name) => name === myText.value,
      );
      const id = restoId.value[position];
      if (props.homeMode !== "Map") {
        router.push(`/restaurant/${id}`);
      } else {
        emit("update:model-value", myText);
      }
      myText.value = "";
    } else {
      if (store.userId !== "" && snackbar.value !== null)
        snackbar.value.displaySnackbar(
          "error",
          "The searched restaurant does not exist!",
        );
    }
  }
}

const getRestaurantsNameId = async () => {
  if (props.homeMode !== "Map") {
    emit("update:model-value", myText);
    try {
      data.restaurant = await getRestaurants({ q: myText.value }).then(
        (result) => {
          data.restaurant = result;
          restoName.value = result.items.map((resto) => resto.name);
          restoId.value = result.items.map((resto) => resto.id);
        },
      );
    } catch (error) {
      if (store.userId !== "" && snackbar.value !== null)
        snackbar.value.displaySnackbar("error", error);
    }
  } else {
    emit("mapSearch", myText);
  }
};

const selectItem = (item) => {
  myText.value = item;
  isVisible.value = false;
  findResto();
};

onMounted(async () => {
  await getRestaurantsNameId();
});
</script>

<style scoped>
.search-bar {
  position: relative;
}
.dropdown-popover {
  position: fixed;
  border: 2px solid lightgray;

  background-color: #fff;
  width: 20%;
  padding: 0.5em;
  z-index: 1;
}

.options {
  width: 100%;
  color: #9b9b9b;
}

ul {
  max-height: 200px;
  overflow-y: scroll;
  overflow-x: hidden;
  border: 1px solid lightgray;
}

li {
  width: 100%;
  border-bottom: 1px solid lightgray;
  padding: 0.5em;
  background-color: #f1f1f1;
  cursor: pointer;
  &:hover {
    background: #70878a;
    color: #fff;
    font-weight: bold;
  }
}

@media screen and (max-width: 1023px) {
  .dropdown-popover {
    width: unset;
  }
}
</style>
