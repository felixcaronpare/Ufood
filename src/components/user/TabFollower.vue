<template>
  <div id="follow-tab">
    <follow-list
      name="Following"
      :follow-list="following"
      @consult-profil="$emit('consultProfil')"
      @refresh-follower="(id) => $emit('refreshFollowing', id)"
    ></follow-list>
    <follow-list
      name="Follower"
      :follow-list="followers"
      @consult-profil="$emit('consultProfil')"
      @refresh-follower="(id) => $emit('refreshFollower', id)"
    ></follow-list>
  </div>
</template>

<script setup>
import FollowList from "@/components/user/follow/FollowList.vue";

const props = defineProps({
  following: Object,
  followers: Object,
});

defineEmits(["refreshFollower", "refreshFollowing", "consultProfil"]);
</script>

<style scoped>
#follow-tab {
  margin-top: 0.5em;
  display: flex;
  justify-content: space-between;
  column-gap: 5px;
}

@media screen and (max-width: 1023px) {
  #follow-tab {
    display: unset;
  }
}
</style>
