<template>
  <div>
    <v-select
      label="Price"
      :items="price"
      v-model="selectPrice"
      @update:model-value="emitSelection"
      multiple
      clearable
      chips
      rounded="0"
      density="compact"
      hide-details
    ></v-select>
  </div>
</template>

<script setup>
import { ref } from "vue";
const price = ["$", "$$", "$$$", "$$$$"];
const selectPrice = ref([]);

const props = defineProps(["selectedPrice"]);
const emits = defineEmits(["selectedPrice"]);

const emitSelection = () => {
  emits("selectedPrice", Array.from(selectPrice.value));
};
</script>

<style scoped>
@media screen and (min-width: 1023px) {
  div {
    max-width: 18em;
  }
}
</style>
