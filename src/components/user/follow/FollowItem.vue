<template>
  <v-list-item>
    <v-row>
      <v-col>
        <router-link
          :to="{ name: 'User', params: { userId: item.id } }"
          @click="$emit('consultProfil')"
          >{{ item.name }}
        </router-link>
      </v-col>
      <v-spacer></v-spacer>

      <confirm-dialog @confirmed="removeFollow">
        <template v-slot:deleteButton="{ props }">
          <v-btn
            v-bind="props"
            id="deleteButton"
            color="grey-lighten-1"
            icon="fa fa-xmark"
            variant="text"
          ></v-btn>
        </template>
      </confirm-dialog>
    </v-row>
  </v-list-item>
</template>

<script setup>
import ConfirmDialog from "@/components/utils/ConfirmDialog.vue";
import { unFollow } from "@/script/api/users";

const props = defineProps({
  item: Object,
});

const unfollowUser = defineEmits(["unfollow", "consultProfil"]);

const removeFollow = () => {
  unfollowUser("unfollow", props.item.id);
  unFollow(props.item.id);
};
</script>

<style scoped></style>
