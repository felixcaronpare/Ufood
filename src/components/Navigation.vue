<template>
  <div class="navbar position-fixed title-color w-100">
    <v-container class="d-flex is-align-items-center w-100 pa-0">
      <v-col cols="7" class="me-auto d-flex">
        <router-link to="/welcome" class="navbar-item title-color">
          <img alt="logo" src="@/assets/ufood-logo.png" />
        </router-link>
        <v-tab to="/" class="navbar-item">Home</v-tab>
      </v-col>
      <div class="d-flex search-container w-100">
        <tab-search-users
          v-if="store.userId !== ''"
          class="w-100 mt-1 mr-2 search-bar"
          :class="{ 'is-hidden': $route.name === 'User' }"
        ></tab-search-users>
        <search-bar
          v-if="store.userId !== ''"
          class="w-100 mt-1 mr-2 search-bar"
          :class="{ 'is-hidden': $route.name === 'Home' }"
        ></search-bar>
      </div>
      <v-menu open-on-click transition="scale-transition">
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props"> {{ username }} </v-btn>
        </template>
        <v-list>
          <v-list-item @click="toggleTheme">
            <v-list-item-action class="d-flex justify-center">
              <i v-if="darkMode" class="fa-solid fa-sun"></i>
              <i v-if="!darkMode" class="fa-solid fa-moon"></i>
            </v-list-item-action>
          </v-list-item>
          <v-list-item
            v-for="(item, index) in items"
            :key="index"
            @click="handleItemClick(item.title)"
          >
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-container>
    <snackbar ref="snackbar"></snackbar>
  </div>
</template>

<script setup>
import { ref, watchEffect } from "vue";
import SearchBar from "@/components/SearchBar.vue";
import TabSearchUsers from "./user/TabSearchUsers.vue";
import { store } from "@/script/store";
import { showUserInfo } from "@/script/api/users";
import { router } from "@/router";
import Snackbar from "@/components/utils/Snackbar.vue";
import Cookies from "js-cookie";
import { useTheme } from "vuetify";

const items = ref([{ title: "Profile" }, { title: "Log Out" }]);

const snackbar = ref(null);
const theme = useTheme();
const darkMode = ref(false);

const handleItemClick = (title) => {
  if (title === "Profile") {
    router.push(`/user/${store.userId}`);
  } else if (title === "Log Out") {
    logout();
  }
};

const logout = async () => {
  Cookies.remove("token", { path: "" });
  store.userId = "";
  await router.push({ name: "Welcome" });
};

let username = ref("");

async function getUsername() {
  try {
    const user = await showUserInfo(store.userId);
    username.value = user.name;
  } catch (error) {
    if (store.userId !== "" && snackbar.value !== null)
      snackbar.value.displaySnackbar("error", error);
  }
}

function toggleTheme() {
  darkMode.value = !darkMode.value;
  theme.global.name.value = darkMode.value ? "dark" : "light";
}

watchEffect(() => {
  if (username.value === "" && store.userId !== "") getUsername();
});
</script>

<style scoped>
.navbar {
  align-items: center;
  z-index: 2;
}

.search-bar {
  min-width: 20%;
}

.search-container {
  flex-direction: row;
}

@media (max-width: 450px) {
  .search-bar {
    min-width: 100%;
  }

  .search-container {
    flex-direction: column;
  }
}
</style>
