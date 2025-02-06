<template>
  <v-app id="app">
    <nav-menu
      v-if="!($route.path === '/welcome' || $route.path === '/LoginGoogle')"
    ></nav-menu>
    <router-view :key="$route.path"></router-view>
  </v-app>
</template>

<script>
import Navigation from "@/components/Navigation";
export default {
  name: "app",
  components: {
    "nav-menu": Navigation,
  },
};
</script>
