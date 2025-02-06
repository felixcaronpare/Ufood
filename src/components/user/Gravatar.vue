<template>
  <v-avatar size="120" rounded="0">
    <v-img class="rounded-lg" :src="image"></v-img>
  </v-avatar>
</template>

<script setup>
import { ref } from "vue";
import { sha256 } from "js-sha256";

const props = defineProps({
  email: String,
});

const image = ref("");

gravatarImage();

function gravatarImage() {
  if (props.email !== undefined) {
    const address = String(props.email).trim().toLowerCase();
    const hash = sha256(address);

    image.value = `https://www.gravatar.com/avatar/${hash}`;
  } else image.value = `https://www.gravatar.com/avatar/`;
}
</script>
