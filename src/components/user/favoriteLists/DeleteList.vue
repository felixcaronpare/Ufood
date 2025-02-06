<template>
  <div class="d-flex flex-column">
    <confirm-dialog @confirmed="deleteList">
      <template v-slot:deleteButton="{ props }">
        <v-btn v-bind="props" id="deleteButton">Delete Current List</v-btn>
        <snackbar ref="snackbar"></snackbar>
      </template>
    </confirm-dialog>
    <snackbar ref="snackbar"></snackbar>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { deleteFavoritesList } from "@/script/api/favorites";
import ConfirmDialog from "@/components/utils/ConfirmDialog.vue";
import Snackbar from "@/components/utils/Snackbar.vue";
import { store } from "@/script/store";

const props = defineProps({
  selectedListId: String,
});

const emits = defineEmits(["deleted", "cleanList"]);
const snackbar = ref(null);
async function deleteList() {
  try {
    await deleteFavoritesList(props.selectedListId);

    emits("deleted", props.selectedListId);
    emits("cleanList");

    snackbar.value.displaySnackbar("success", "List deleted");
  } catch (error) {
    if (store.userId !== "") snackbar.value.displaySnackbar("error", error);
  }
}
</script>

<style scoped>
#deleteButton:hover {
  color: red;
}
</style>
