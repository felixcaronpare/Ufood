<template>
  <div>
    <div class="elevation-3 my-2 d-flex flex-column">
      <v-select
        :items="
          favoriteLists.lists.length > 0
            ? favoriteLists.lists.map((item) => item.name)
            : []
        "
        class="d-flex flex-column"
        label="Select your List"
        @click="$emit('updateLists')"
        @update:modelValue="onListSelected"
        v-model="toDeleteId"
      >
      </v-select>
      <delete-list
        @deleted="(listId) => deleteLists(listId)"
        @clean-list="() => cleanList()"
        :selected-list-id="listTabs.selectedListId"
      />
    </div>
    <div class="elevation-3 my-2">
      <div>
        <modify-list
          :owner="props.userEmail"
          :selected-list-id="listTabs.selectedListId"
          @on-name-changed="
            (emittedListId, emittedListName) =>
              updateLists(emittedListId, emittedListName)
          "
        />
      </div>
      <v-table v-if="listTabs.selectedList !== ''" height="260px" class="mt-3">
        <tbody>
          <tr
            v-for="restaurant in listTabs.infoRestaurant"
            :key="restaurant.id"
          >
            <td>
              <router-link
                :to="{
                  name: 'Restaurant',
                  params: { id: restaurant.id },
                }"
                >{{ restaurant.name }}</router-link
              >
            </td>
            <td>
              <confirm-dialog
                @confirmed="onClick(listTabs.selectedListId, restaurant.id)"
              >
                <template v-slot:deleteButton="{ props }">
                  <i
                    v-bind="props"
                    id="deleteButton"
                    class="fa-solid fa-xmark"
                  ></i>
                </template>
              </confirm-dialog>
            </td>
          </tr>
        </tbody>
      </v-table>
    </div>
    <snackbar ref="snackbar"></snackbar>
  </div>
</template>

<script setup>
import { inject, reactive, ref } from "vue";
import { getRestaurant } from "@/script/api/restaurants";
import ModifyList from "@/components/user/favoriteLists/ModifyList.vue";
import DeleteList from "@/components/user/favoriteLists/DeleteList.vue";
import { deleteFavoriteRestaurant } from "@/script/api/favorites";
import ConfirmDialog from "@/components/utils/ConfirmDialog.vue";
import Snackbar from "@/components/utils/Snackbar.vue";
import { store } from "@/script/store";

const snackbar = ref(null);

const emit = defineEmits([
  "updateLists",
  "deletedList",
  "deletedResto",
  "onNameChanged",
]);

// DATA Section //
const listTabs = reactive({
  selectedList: "",
  restaurants: Array,
  infoRestaurant: [],
  selectedListId: "",
  emittedListId: "",
});
const props = defineProps({
  favoriteLists: Object,
  userId: String,
  userEmail: String,
});
// END Data Section //

/**
 * Important, global emitter - this component is the listener.
 */

const emitter = inject("emitter");
emitter.on("emitListid", (idList) => {
  listTabs.emittedListId = idList;
});

emitter.on("addToList", async (idRestaurant) => {
  if (listTabs.selectedListId === listTabs.emittedListId) {
    try {
      const info = await getRestaurant(idRestaurant);
      listTabs.infoRestaurant.push(info);
    } catch (error) {
      if (store.userId !== "" && snackbar.value !== null)
        snackbar.value.displaySnackbar(
          "error",
          "Error while adding restaurant to list",
        );
    }
  }
});

/**
 * Responsible for updating the selected list in the component.
 */
async function onListSelected(selectedList) {
  listTabs.selectedList = selectedList;
  const selectedItem = props.favoriteLists.lists.find(
    (item) => item.name === selectedList,
  );
  listTabs.selectedListId = selectedItem.id;
  if (selectedItem) {
    listTabs.infoRestaurant = [];
    for (const restaurant of selectedItem.restaurants) {
      const info = await getRestaurant(restaurant.id);
      listTabs.infoRestaurant.push(info);
    }
  }
}

const toDeleteId = ref(null);
const deleteLists = async (selectedListid) => {
  if (selectedListid) {
    toDeleteId.value = null;
    emit("deletedList", selectedListid);
  } else {
    if (store.userId !== "" && snackbar.value !== null)
      snackbar.value.displaySnackbar("info", "No list selected");
  }
};

const updateLists = async (emittedListId, emittedListName) => {
  toDeleteId.value = emittedListName;
  emit("onNameChanged", emittedListId, emittedListName);
};

async function onClick(selectedListid, restaurantId) {
  try {
    await deleteFavoriteRestaurant(selectedListid, restaurantId);
    snackbar.value.displaySnackbar("success", "Favorite restaurant deleted");
  } catch (error) {
    if (store.userId !== "") snackbar.value.displaySnackbar("error", error);
  }
  listTabs.infoRestaurant = listTabs.infoRestaurant.filter(
    (restaurant) => restaurant.id !== restaurantId,
  );
  emit("deletedResto", selectedListid, restaurantId);
}

/**
 * Listener linked with the component DeleteList in order to clean the current list of restaurant
 */
function cleanList() {
  listTabs.infoRestaurant = [];
}
</script>

<style scoped>
.fa-xmark:hover {
  color: red;
}
</style>
