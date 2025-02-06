<template>
  <v-dialog persistent v-model="dialog" width="80%" height="70%">
    <template v-slot:activator="{ on, props }">
      <slot name="openModal" :on="on" :props="props"></slot>
    </template>

    <v-card>
      <v-card-title>Restaurant visit info to {{ restaurantName }}</v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-container fluid>
          <v-form ref="sendForm" lazy-validation>
            <v-text-field
              type="datetime-local"
              label="Date and time of visit"
              v-model="visit.date"
              :readonly="isReadOnly"
              :min="minDate"
              :max="maxDate"
              :rules="dateRules"
            ></v-text-field>

            <v-row>
              <rating-stars
                :rating-restaurant="Number(visit?.rating ?? 0)"
                @update:model-value="
                  (ratingForm) => (visit.rating = ratingForm)
                "
                :is-read-only="isReadOnly"
              ></rating-stars>
            </v-row>
            <v-row>
              <v-textarea
                label="Comments"
                v-model="visit.comment"
                :readonly="isReadOnly"
                :rules="commentRules"
              ></v-textarea>
            </v-row>
          </v-form>
        </v-container>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue-darken-1" variant="text" @click="closeForm">
          Close
        </v-btn>
        <v-btn
          v-if="!isReadOnly"
          color="blue-darken-1"
          variant="text"
          @click="submitForm"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
    <snackbar ref="snackbar"></snackbar>
  </v-dialog>
</template>

<script setup>
import { ref } from "vue";
import { createRestaurantVisit } from "@/script/api/visits.js";
import RatingStars from "@/components/utils/RatingStars.vue";
import Snackbar from "@/components/utils/Snackbar.vue";
import { store } from "@/script/store";

const dialog = ref(false);
const date = ref("");

const maxDate = ref(new Date().setHours(new Date().getHours() + 5));
const minDate = ref(new Date().setFullYear(new Date().getFullYear() - 5));
const isDateValid = ref(false);
const isRatingValid = ref(false);
const isCommentValid = ref(false);

const props = defineProps({
  restaurantName: {
    type: String,
    required: true,
  },
  vVisit: {
    type: Object,
    required: true,
  },
  isReadOnly: Boolean,
});

const visit = ref(props.vVisit);
const snackbar = ref(null);

const closeForm = () => {
  if (!props.isReadOnly) {
    visit.value.id = undefined;
    visit.value.date = undefined;
    visit.value.rating = "0";
    visit.value.comment = "";
  }
  dialog.value = !dialog.value;
};
const dateRules = [
  (value) =>
    value === undefined ||
    new Date(value) !== "Invalid Date" ||
    "Invalid date or time.",
  (value) =>
    value === undefined ||
    minDate.value <= new Date(value) ||
    "Date must be greater than 5 years ago.",
  (value) =>
    value === undefined ||
    new Date(value) <= maxDate.value ||
    "Date must not be greater than now.",
];

const commentRules = [
  (value) => (value || "").length <= 200 || "Max 200 characters",
];
const validateForm = () => {
  let error = "";
  const dtVisit =
    visit.value.date !== undefined ? new Date(visit.value.date) : undefined;

  if (
    dtVisit !== undefined &&
    dtVisit &&
    dtVisit !== "Invalid Date" &&
    minDate.value <= dtVisit &&
    dtVisit <= maxDate.value
  ) {
    isDateValid.value = true;
  } else error = "Date is invalid! ";

  if (
    visit.value.rating === undefined ||
    visit.value.rating <= 0 ||
    visit.value.rating > 5
  ) {
    error += "Rating is invalid! ";
  } else isRatingValid.value = true;

  if (visit.value.comment === undefined) {
    visit.value.comment = "";
  }
  if (visit.value.comment === "" || visit.value.comment.length <= 200) {
    isCommentValid.value = true;
  } else {
    error += "Comment is invalid! ";
  }

  return error;
};

const emits = defineEmits(["addVisit"]);
const submitForm = async () => {
  const formError = validateForm();

  if (formError.trim() === "") {
    try {
      await createRestaurantVisit(visit.value.user_id, visit.value).then(() => {
        emits("addVisit");
        closeForm();
      });
    } catch (error) {
      if (store.userId !== "" && snackbar.value !== null)
        snackbar.value.displaySnackbar("error", error);
    }
  } else {
    if (store.userId !== "") snackbar.value.displaySnackbar("error", formError);
  }
};
</script>
