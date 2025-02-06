<template>
  <v-card flat class="half-page-to-full">
    <div class="title-color pa-2">{{ name }}</div>
    <v-list>
      <div v-for="(follow, idx) in followList" :key="idx">
        <follow-item
          :item="follow"
          @unfollow="$emit('refreshFollower', follow.id)"
          @consult-profil="$emit('consultProfil')"
        ></follow-item>
      </div>
    </v-list>
  </v-card>
</template>

<script setup>
import FollowItem from "@/components/user/follow/FollowItem.vue";

const props = defineProps({
  name: String,
  followList: Object,
});

const refreshFollower = defineEmits(["refreshFollower", "consultProfil"]);
</script>

<style scoped></style>
