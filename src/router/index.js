import { createRouter, createWebHistory } from "vue-router";
import Home from "@/pages/Home";
import Welcome from "@/pages/Welcome.vue";
import Restaurant from "@/pages/Restaurant";
import User from "@/pages/User";
import LoginGoogle from "@/components/LoginGoogle.vue";
import Cookies from "js-cookie";
import { store } from "@/script/store";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/restaurant/:id",
    name: "Restaurant",
    component: Restaurant,
    props: true,
  },
  {
    path: "/user/:userId",
    name: "User",
    component: User,
    props: true,
  },
  {
    path: "/welcome",
    name: "Welcome",
    component: Welcome,
  },
  {
    path: "/logingoogle",
    component: LoginGoogle,
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from) => {
  const connected = isConnected();

  if (
    !connected &&
    to.fullPath !== "/welcome" &&
    !to.fullPath.startsWith("/LoginGoogle")
  ) {
    return "/welcome";
  }

  if (connected && to.fullPath.startsWith("/LoginGoogle")) return false;

  if (connected && to.name === "Welcome") return false;
});

const isConnected = () => {
  let connected = false;

  if (Cookies.get("token") !== undefined && Cookies.get("token") !== "") {
    connected = true;
    const token = Cookies.get("token");
    try {
      //Handle F5 refresh
      store.userId = JSON.parse(atob(token.split(".")[1])).iss;
    } catch {
      connected = false;
    }
  }

  return connected;
};
