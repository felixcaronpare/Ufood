<template>
  <div class="home-container">
    <div
      class="half-page-to-full"
      v-for="restaurant in restaurantsList"
      :key="restaurant.id"
    >
      <restaurant-header
        v-if="restaurant"
        :restaurant="restaurant"
        :is-link="true"
      ></restaurant-header>
    </div>
    <div
      :class="{ hidden: hideMoreResult }"
      id="sentinel"
      ref="sentinel"
      class="loading"
    >
      <v-progress-circular indeterminate></v-progress-circular>
    </div>
  </div>
</template>

<script setup>
import RestaurantHeader from "@/components/restaurant/RestaurantHeader.vue";
import { onMounted, reactive, ref, watch } from "vue";

const props = defineProps({
  restaurantsList: Object,
  hideMoreResult: Boolean,
});
let observer = null;
const emit = defineEmits(["nextPage"]);

const sentinel = ref();
const setupSection = () => {
  if (props.hideMoreResult === false) {
    observer.observe(sentinel.value);
  }
};

const updated = reactive(props);
watch(
  () => updated.restaurantsList,
  () => {
    setupSection();
  },
);

const handleIntersection = ([entry]) => {
  if (entry.isIntersecting) {
    observer.unobserve(entry.target);
    emit("nextPage");
  }
};

onMounted(() => {
  observer = new IntersectionObserver(handleIntersection, {
    rootMargin: "10px",
  });
  setupSection();
});
</script>

<style scoped>
.home-container {
  height: 100%;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  align-content: flex-start;
}

#sentinel {
  width: 100%;
}

.hidden {
  display: none;
}
</style>
