import { router } from "@/router";
import Cookies from "js-cookie";
import { store } from "@/script/store";

const unexpectedErrorMsg = "An unexpected error as occured try again later.";
const notFoundErrorMsg =
  "Unable to find what you are looking for, try again later";

export const generateException = async (exceptionNumber, message404) => {
  switch (exceptionNumber) {
    case 401:
      store.userId = "";
      Cookies.remove("token", { path: "" });
      await router.push({ name: "Welcome" });
      break;
    case 404:
      throw new Error(message404 ?? notFoundErrorMsg);
    default:
      throw new Error(unexpectedErrorMsg);
  }
};
