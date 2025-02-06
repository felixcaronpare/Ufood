<template>
  <v-row align="center" justify="center">
    <v-progress-circular indeterminate></v-progress-circular>

    <snackbar ref="snackbar"></snackbar>
  </v-row>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { loginGoogle } from "@/script/api/auth";
import { router } from "@/router";
import Snackbar from "@/components/utils/Snackbar.vue";
import Cookies from "js-cookie";
import { store } from "@/script/store";

const snackbar = ref();

onMounted(async () => {
  const searchURL = new URL(window.location);
  const code = searchURL.searchParams.get("code");
  try {
    if (await loginGoogle(code)) {
      await router.push({ name: "Home" });
    }
  } catch (ex) {
    snackbar.value.displaySnackbar("error", ex);

    setTimeout(async () => {
      Cookies.remove("token", { path: "" });
      store.userId = "";
      await router.push({ name: "Welcome" });
    }, 3000);
  }
});
</script>
