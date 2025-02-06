<template>
  <v-container class="pages-content">
    <v-row align="center" justify="center">
      <div>
        <v-img :width="200" :src="getLogo()"></v-img>
      </div>
    </v-row>

    <v-row align="center" justify="center">
      <h1 class="is-size-4">Register now!</h1>
    </v-row>
    <v-row align="center" justify="center">
      <v-form @submit.prevent="validate" method="post">
        <v-text-field
          :error="emailError"
          label="Email"
          id="email"
          v-model="credential.email"
          type="email"
          required
        ></v-text-field>
        <v-text-field
          :error="passwordError"
          label="Password"
          id="password"
          type="password"
          v-model="credential.password"
          required
        ></v-text-field>
        <label
          class="has-text-danger-dark"
          v-if="emailError || passwordError"
          >{{ errorMsg }}</label
        >
        <v-checkbox
          label="Remember me"
          v-model="credential.rememberMe"
        ></v-checkbox>

        <v-row align="center" justify="center">
          <v-btn :loading="isLoading" type="submit" class="mr-2"
            >Log In</v-btn
          ></v-row
        >
        <v-row align="center" justify="center">
          <h1 style="margin-bottom: 25px">
            Don't have an account yet ?
          </h1></v-row
        >
        <v-container v-if="showContainer" align="center" justify="center">
          <v-row>
            <v-text-field
              :error="emailErrorSignUp"
              label="Email"
              class="mb-4"
              v-model="newUser.email"
              type="email"
            ></v-text-field
          ></v-row>
          <v-row class="has-text-danger-dark" v-if="emailErrorSignUp">{{
            errorSignUpMsg
          }}</v-row>
          <v-row>
            <v-text-field
              label="Full Name"
              class="mb-4"
              v-model="newUser.name"
            ></v-text-field
          ></v-row>
          <v-row>
            <v-text-field
              label="Password"
              class="mb-4"
              v-model="newUser.password"
              type="password"
            ></v-text-field
          ></v-row>
        </v-container>
        <v-row align="center" justify="center">
          <v-btn
            v-if="!showContainer"
            :loading="isLoading"
            @click="toggleContainer"
            >Create Account</v-btn
          >
          <v-row v-if="signUpErrorMsg" align="center" justify="center">
            <label class="has-text-danger-dark">{{ signUpErrorMsg }}</label>
          </v-row>
          <v-snackbar
            v-model="showSuccessSnackBar"
            :timeout="3000"
            color="success"
          >
            Your account have been created with great success !</v-snackbar
          >

          <v-btn
            v-if="showContainer"
            :loading="isLoading"
            @click="createAccount"
            >Sign Up</v-btn
          >
        </v-row>
        <v-row align="center" justify="center">
          <h1 class="is-size-4">Or connect with :</h1>
        </v-row>

        <v-row align="center" justify="center">
          <a :href="getGoogleUrl('/')" class="mr-2 mb-2">
            <v-btn prepend-icon="fab fa-google">Sign up with Google</v-btn>
          </a>
        </v-row>
      </v-form>
    </v-row>
  </v-container>
</template>

<script setup>
import { reactive, ref } from "vue";
import { router } from "@/router";
import { getGoogleUrl, login } from "@/script/api/auth";
import { signUp } from "@/script/api/users";

const showContainer = ref(false);
const emailErrorSignUp = ref(false);
const errorSignUpMsg = ref("");
const signUpErrorMsg = ref("");
const showSuccessSnackBar = ref(false);
const isValidEmail = (email) => {
  const pattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return pattern.test(email);
};
const toggleContainer = () => {
  showContainer.value = !showContainer.value;
};

const newUser = reactive({
  name: "",
  email: "",
  password: "",
});

const createAccount = async () => {
  isLoading.value = true;
  emailErrorSignUp.value = false;

  if (!isValidEmail(newUser.email)) {
    emailErrorSignUp.value = true;
    errorSignUpMsg.value = "Invalid email format !";
    isLoading.value = false;
    return;
  }
  try {
    const signUpResult = await signUp(newUser);
    if (signUpResult) {
      showSuccessSnackBar.value = true;
      const newUserConnect = {
        email: newUser.email,
        password: newUser.password,
      };
      const userInfo = await login(newUserConnect);
      if (userInfo.token !== "") {
        setTimeout(async () => {
          await router.push({ name: "Home" });
        }, 1000);
      }
    }
  } catch (error) {
    emailErrorSignUp.value = true;
    errorSignUpMsg.value = "There is already an account with this email !";
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};

const credential = reactive({
  email: "",
  password: "",
  rememberMe: false,
});

const isLoading = ref(false);
const emailError = ref(false);
const passwordError = ref(false);
const errorMsg = ref("");

const validate = async () => {
  emailError.value = false;
  passwordError.value = false;
  errorMsg.value = "";
  isLoading.value = true;

  if (credential.email.trim().length === 0) {
    errorMsg.value = "The email is mandatory";
    emailError.value = true;
  }
  if (credential.password.trim().length === 0) {
    if (errorMsg.value.length !== 0) errorMsg.value += ". ";

    errorMsg.value += "The password is mandatory";
    passwordError.value = true;
  }

  if (!emailError.value && !passwordError.value) {
    try {
      const userInfo = await login(credential);
      if (userInfo.token !== "") {
        await router.push({ name: "Home" });
      }
    } catch (err) {
      errorMsg.value = err.message;
      passwordError.value = true;
      emailError.value = true;
    }
  }
  isLoading.value = false;
};

const getLogo = () => {
  return require("../assets/logo.png");
};
</script>

<style scoped>
form {
  width: 280px;
  min-width: 280px;
}

h1 {
  margin-top: 12px;
  margin-bottom: 8px;
}
</style>
