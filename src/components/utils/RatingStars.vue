<template>
  <div>
    <span v-if="isReadOnly">
      <text>{{ ratingForm }}/5</text></span
    >

    <v-rating
      :density="density"
      v-model="ratingForm"
      :model-value="ratingForm"
      hover
      half-increments
      color="yellow-accent-4"
      active-color="yellow-accent-4"
      :readonly="isReadOnly"
      :size="size"
      @click="onUpdate(ratingForm)"
      :rules="starRules"
    ></v-rating>
  </div>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  ratingRestaurant: Number,
  isReadOnly: Boolean,
});

const ratingForm = ref(props.ratingRestaurant);

const emit = defineEmits(["update:model-value"]);

const size = ref("small");
const density = ref("compact");

if (!props.isReadOnly) {
  ratingForm.value = undefined;
  size.value = "large";
  density.value = "comfortable";
}

const starRules = ref([
  (value) =>
    (value !== undefined && value > 0) || "Rating must be greater than 0",
  (value) =>
    (value !== undefined && value <= 5) || "Rating must be less or equal to 5",
]);

function onUpdate(ratingForm) {
  emit("update:model-value", ratingForm);
}
</script>
