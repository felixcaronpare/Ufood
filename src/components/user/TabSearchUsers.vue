<template>
  <div class="search">
    <v-text-field
      label="Search a user"
      v-model="searchText"
      @input="search()"
      rounded="0"
      density="compact"
      hide-details
    ></v-text-field>
    <v-card
      v-if="searchPerformed"
      :class="{ 'search-results': $route.name !== 'User' }"
      v-click-outside="clearSearch"
    >
      <v-card-item>
        <v-list class="results-list">
          <v-list-item v-if="noUserFound">No user found</v-list-item>
          <v-list-item v-else v-for="user in users" :key="user.id">
            <div class="d-flex justify-space-between">
              <div class="d-flex align-center">
                <router-link
                  :to="{ name: 'User', params: { userId: user.id } }"
                  @click="$emit('consultProfil')"
                  >{{ user.name }}
                </router-link>
              </div>
              <follow-user :id-to-follow="user.id" />
            </div>
          </v-list-item>
        </v-list>
      </v-card-item>
      <v-card-subtitle v-if="totalUsers > 10">
        {{ totalUsers }} users found
        <br />
        Page {{ resultsPage }} out of {{ totalPages }}
      </v-card-subtitle>
      <v-card-actions>
        <v-btn v-if="hasPreviousPage" @click="goPreviousPage()"
          >Previous page</v-btn
        >
        <v-spacer></v-spacer>
        <v-btn v-if="hasNextPage" @click="goNextPage()">Next page</v-btn>
      </v-card-actions>
    </v-card>
    <snackbar ref="snackbar"></snackbar>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { getUsers } from "@/script/api/users";
import Snackbar from "@/components/utils/Snackbar.vue";

import { useRoute } from "vue-router";
import { store } from "@/script/store";
import FollowUser from "@/components/user/follow/FollowUser.vue";

const route = useRoute();

const snackbar = ref(null);
const searchText = ref("");
const searchPerformed = ref(false);
const users = ref([]);
const noUserFound = ref(false);
const totalUsers = ref(0);
const resultsPage = ref(1);
const totalPages = ref(0);

const search = async (page = 0) => {
  if (searchText.value === "") {
    searchPerformed.value = false;
  } else {
    searchPerformed.value = true;
  }

  let usersList = [];

  resultsPage.value = page + 1;

  try {
    usersList = await getUsers({
      limit: 10,
      page: page,
      q: searchText.value,
    });
    totalUsers.value = usersList.total;
    usersList = usersList.items;
    totalPages.value = Math.ceil(totalUsers.value / 10);

    if (usersList.length === 0) {
      noUserFound.value = true;
    } else {
      noUserFound.value = false;
    }
  } catch (error) {
    if (store.userId !== "" && snackbar.value !== null)
      snackbar.value.displaySnackbar("error", error);
    return;
  }

  users.value = usersList.map((user) => {
    let data = { id: user.id, name: user.name };

    try {
      if (user.name.trim() === "") {
        data.name = JSON.stringify(user.name);
      } else {
        data.name = JSON.parse(user.name);
      }
    } catch (error) {
      // The name is not a JSON string so it cannot be parsed
    }

    return data;
  });
};

const hasPreviousPage = computed(() => {
  return resultsPage.value > 1;
});

const hasNextPage = computed(() => {
  return resultsPage.value < totalPages.value;
});

const goPreviousPage = () => {
  resultsPage.value--;
  search(resultsPage.value - 1);
};

const goNextPage = () => {
  resultsPage.value++;
  search(resultsPage.value - 1);
};

const clearSearch = () => {
  if (route.name !== "User") {
    searchText.value = "";
    searchPerformed.value = false;
  }
};

onMounted(() => {
  search();
});
</script>

<style scoped>
.search {
  position: relative;
}

.search-results {
  position: absolute;
  width: 100%;
  z-index: 1;
  min-width: 300px;
}

.results-list {
  max-height: 500px;
  overflow-y: auto;
}

@media screen and (max-width: 725px) {
  .search-results {
    left: -200px;
  }
}
</style>
