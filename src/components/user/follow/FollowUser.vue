<template>
  <div class="d-flex flex-column justify-center justify-space-around">
    <div v-if="shouldShowButtonFollow">
      <div v-if="followInProgress || unfollowInProgress">
        <v-progress-circular
          model-value="10"
          indeterminate
          color="primary"
        ></v-progress-circular>
      </div>
      <div v-else>
        <div v-if="!returnFollow()">
          <v-chip @click="onClick()" class="ma-2" color="blue">
            <i class="fa-regular fa-heart mr-2"></i>
            Follow
          </v-chip>
        </div>
        <div v-else>
          <v-chip
            @click="unFollowOnClick()"
            class="ma-2"
            color="teal"
            :model-value="true"
          >
            <i class="fa-solid fa-heart mr-2"></i>
            Followed
          </v-chip>
        </div>
      </div>
    </div>
    <v-btn v-if="shouldShowButtonReturnToYourProfil">
      <router-link
        v-if="store.userId !== ''"
        :to="{ name: 'User', params: { userId: store.userId } }"
        >Return to your Profil
      </router-link>
    </v-btn>
    <snackbar ref="snackbar"></snackbar>
  </div>
</template>

<script setup>
import { followUser, showUserInfo, unFollow } from "@/script/api/users";
import { store } from "@/script/store";
import { computed, onMounted, ref, watch } from "vue";
import Snackbar from "@/components/utils/Snackbar.vue";
import { useRoute } from "vue-router";

const snackbar = ref(null);

const props = defineProps({
  idToFollow: String,
  following: Object,
  followers: Object,
});

const followingList = ref([]);
const isFollowed = ref(false);
const route = ref(useRoute());

let loadingFollowingList = false;
let followInProgress = ref(false);
let unfollowInProgress = ref(false);

async function onClick() {
  const isFollowing = followingList.value.following.some(
    (element) => element.id === props.idToFollow,
  );
  if (isFollowing) {
    snackbar.value.displaySnackbar(
      "error",
      "You are already following this user",
    );
  } else if (!followInProgress.value) {
    followInProgress.value = true;
    try {
      await followUser(props.idToFollow);
      await loadFollowingList();
    } finally {
      followInProgress.value = false;
    }
  }
}

async function unFollowOnClick() {
  if (!unfollowInProgress.value) {
    unfollowInProgress.value = true;
    try {
      await unFollow(props.idToFollow);
      await loadFollowingList();
    } finally {
      unfollowInProgress.value = false;
    }
  }
}
const shouldShowButtonReturnToYourProfil = computed(() => {
  return route.value.params.userId === props.idToFollow;
});

const shouldShowButtonFollow = computed(() => {
  return (
    route.value.name === "Home" ||
    route.value.params.userId === props.idToFollow ||
    route.value.name === "Restaurant"
  );
});

async function loadFollowingList() {
  if (!loadingFollowingList) {
    loadingFollowingList = true;
    try {
      followingList.value = await showUserInfo(store.userId);
    } catch (error) {
      console.error("Error loading following list:", error);
    } finally {
      loadingFollowingList = false;
    }
  }
}

watch(
  () => followingList.value,
  () => {
    isFollowed.value = followingList.value.following.some(
      (element) => element.id === props.idToFollow,
    );
  },
);

function returnFollow() {
  return isFollowed.value;
}

onMounted(() => {
  loadFollowingList();
});
</script>

<style scoped></style>
