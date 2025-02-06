<template>
  <div class="ma-4">
    <v-carousel hide-delimiters cycle v-if="pictures" height="300">
      <v-carousel-item v-for="(url, i) in pictures" :key="i" eager>
        <v-row class="pa-3 justify-space-around">
          <v-card width="500" height="300">
            <v-img :src="url" eager cover height="100%"></v-img>
          </v-card>
        </v-row>
      </v-carousel-item>
    </v-carousel>
  </div>
</template>

<script setup>
const props = defineProps({
  pictures: Object,
});
</script>
