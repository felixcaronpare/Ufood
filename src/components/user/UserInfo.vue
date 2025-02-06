<template>
  <div class="info">
    <p>
      Score : <span class="tag is-primary is-medium">{{ rating ?? 0 }}</span>
    </p>
    <p>Username : {{ name }}</p>
    <p>Email : {{ email }}</p>
  </div>
</template>

<script setup>
const props = defineProps({
  rating: Number,
  name: String,
  email: String,
});
</script>

<style scoped>
.info {
  padding: 0.5em;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
}
</style>
