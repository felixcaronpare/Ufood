<template>
  <div class="d-flex flex-column co">
    <v-text-field
      v-model="modifyList.newNameList"
      label="Enter new Name List"
    ></v-text-field>
    <v-btn id="modifyButton" @click="onClick()">Modify Current Name List</v-btn>
    <snackbar ref="snackbar"></snackbar>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { modifyFavoritesList } from "@/script/api/favorites";
import { reactive } from "vue";
import Snackbar from "@/components/utils/Snackbar.vue";
import { store } from "@/script/store";

const modifyList = reactive({
  newNameList: "",
});
const props = defineProps({
  selectedListId: String,
  owner: String,
  listTabs: Object,
});

const snackbar = ref(null);

const emit = defineEmits(["onNameChanged"]);

async function onClick() {
  try {
    await modifyFavoritesList(
      props.selectedListId,
      modifyList.newNameList,
      props.owner,
    );
    snackbar.value.displaySnackbar("success", "Favorites list updated");

    const emittedListId = props.selectedListId;
    const emittedListName = modifyList.newNameList;
    emit("onNameChanged", emittedListId, emittedListName);
  } catch (error) {
    if (store.userId !== "") snackbar.value.displaySnackbar("error", error);
  }
}
</script>

<style scoped>
#modifyButton:hover {
  color: orange;
}
</style>
