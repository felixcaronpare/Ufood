<template>
  <div class="d-flex flex-column elevation-3 my-2">
    <v-text-field
      v-model="addNewList.newListName"
      label="Enter new List"
    ></v-text-field>
    <v-btn id="addButton" @click="onClick()" :text="addNewList.text"></v-btn>
    <snackbar ref="snackbar"></snackbar>
  </div>
</template>

<script setup>
import { createFavoriteList } from "@/script/api/favorites";
import { reactive, ref } from "vue";
import Snackbar from "@/components/utils/Snackbar.vue";
import { store } from "@/script/store";
const addNewList = reactive({
  text: "Create",
  newListName: "",
});
const props = defineProps({
  owner: String,
  favoriteList: {
    type: Object,
    required: true,
  },
});

const favorites = reactive(props.favoriteList);
const snackbar = ref(null);

async function onClick() {
  let listExist = false;
  for (let list of props.favoriteList.lists) {
    if (list.name === addNewList.newListName) {
      snackbar.value.displaySnackbar(
        "error",
        "There is already a similar list name.",
      );
      listExist = true;
      break;
    }
  }
  if (!listExist) {
    let newList = {};

    try {
      newList = await createFavoriteList(addNewList.newListName, props.owner);
      favorites.lists.push(newList);
      addNewList.newListName = "";
      snackbar.value.displaySnackbar("success", "List created!");
    } catch (error) {
      if (store.userId !== "" && snackbar.value !== null)
        snackbar.value.displaySnackbar("error", error);
    }
  }
}
</script>

<style scoped>
#addButton:hover {
  color: green;
}
</style>
