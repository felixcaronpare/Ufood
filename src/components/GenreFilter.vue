<template>
  <div class="w-100">
    <v-select
      label="Styles"
      v-model="selectGenres"
      :items="genres"
      multiple
      clearable
      rounded="0"
      density="compact"
      hide-details
      @update:modelValue="emitSelection"
    >
      <template v-slot:selection="{ item, index }">
        <v-chip v-if="index < 2">
          <span>{{ item.title }}</span>
        </v-chip>
        <span
          v-if="index === 2"
          class="text-grey text-caption align-self-center"
        >
          (+{{ selectGenres.length - 2 }} others)
        </span>
      </template>
    </v-select>
  </div>
</template>

<script setup>
import { ref } from "vue";
const genres = [
  "ambiance",
  "asiatique",
  "bistro",
  "café",
  "charcuterie",
  "desserts",
  "fast-food",
  "fruits de mer",
  "hamburgers",
  "happy hour",
  "indien",
  "italien",
  "japonais",
  "libanais",
  "mexicain",
  "pizzeria",
  "santé",
  "steakhouse",
  "végétarien",
];
const selectGenres = ref([]);

const props = defineProps(["selectedGenres"]);
const emits = defineEmits(["selectedGenres"]);

const emitSelection = () => {
  emits("selectedGenres", Array.from(selectGenres.value));
};
</script>

<style scoped>
@media screen and (min-width: 1023px) {
  div {
    max-width: 25em;
  }
}
</style>
