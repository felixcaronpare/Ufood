<template>
  <div id="instructions" class="genres-background p-2 overflow-y-auto">
    <div class="font-weight-bold">
      Trip duration: {{ Math.floor(instruction.duration / 60) }} min
    </div>
    <v-divider />
    <div v-for="(step, idx) in instruction.steps" :key="idx">
      <span>&#8226; </span>{{ step.maneuver.instruction }}
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  instruction: Object,
});
</script>

<style scoped>
#instructions {
  color: rgba(238, 238, 238, 0.93);
  z-index: 1;
  height: 45vh;
}
</style>
