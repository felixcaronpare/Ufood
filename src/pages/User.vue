<template>
  <v-container class="pages-content">
    <v-tabs v-model="currentTab" @onChange="change" class="title-color">
      <v-tab v-if="props.userId === store.userId" value="tabProfile"
        >Profile</v-tab
      >
      <v-tab v-if="props.userId !== store.userId" value="tabProfile"
        >You are currently on {{ user.name }} profile</v-tab
      >
      <v-tab v-if="props.userId === store.userId" value="tabFollower"
        >Follower</v-tab
      >
      <v-tab v-if="props.userId === store.userId" value="tabSearchUsers"
        >Search Users</v-tab
      >
    </v-tabs>

    <div v-if="user?.id !== undefined">
      <tab-profile
        :user="user"
        v-if="currentTab === 'tabProfile'"
        :following="user?.following"
        :followers="user?.followers"
      ></tab-profile>
      <tab-follower
        :following="user?.following"
        :followers="user?.followers"
        @consult-profil="currentTab = 'tabProfile'"
        @refresh-following="(id) => refreshFollowing(id)"
        @refresh-follower="(id) => refreshFollower(id)"
        v-if="currentTab === 'tabFollower'"
      ></tab-follower>
      <tab-search-users
        v-if="currentTab === 'tabSearchUsers'"
      ></tab-search-users>
    </div>
    <div v-else-if="errorMsg !== ''">
      <page-error :error-msg="errorMsg"></page-error>
    </div>
    <snackbar ref="snackbar"></snackbar>
  </v-container>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";

import TabFollower from "@/components/user/TabFollower.vue";
import TabProfile from "@/components/user/TabProfile.vue";
import TabSearchUsers from "@/components/user/TabSearchUsers.vue";
import { showUserInfo } from "@/script/api/users";
import PageError from "@/components/utils/PageError.vue";
import Snackbar from "@/components/utils/Snackbar.vue";
import { store } from "@/script/store";
const props = defineProps({
  userId: String,
});

const snackbar = ref(null);

const currentTab = ref("tabProfile");
const change = computed({
  get() {
    return currentTab.value;
  },
  set(sender) {
    currentTab.value = sender.value;
  },
});

const errorMsg = ref("");
const user = ref("");
const loadUser = async () => {
  errorMsg.value = "";
  try {
    user.value = await showUserInfo(props.userId);
  } catch (error) {
    if (store.userId !== "") snackbar.value.displaySnackbar("error", error);
  }
};

const refreshFollowing = (id) => {
  const idx = user.value.following.findIndex((obj) => obj.id === id);
  user.value.following.splice(idx, 1);
};

const refreshFollower = (id) => {
  const idx = user.value.followers.findIndex((obj) => obj.id === id);
  user.value.followers.splice(idx, 1);
};

onMounted(() => {
  loadUser();
});
</script>
