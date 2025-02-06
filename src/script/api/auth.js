import { apiUrl } from "@/script/api/apiUrl";
import Cookies from "js-cookie";
import { store } from "@/script/store";

export const login = async (credential) => {
  const response = await fetch(`${apiUrl}login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credential),
  });

  if (response.ok) {
    const result = await response.json();

    Cookies.set("token", result.token, { path: "", secure: true });
    store.userId = result.id;

    return result;
  }

  switch (response.status) {
    case 401:
      throw new Error("Wrong username or password, try again.");
    default:
      throw new Error(response.statusText);
  }
};

export const loginGoogle = async (code) => {
  const response = await fetch(`${apiUrl}logingoogle`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code: code }),
  });

  if (response.ok) {
    const result = await response.json();

    Cookies.set("token", result.token, { path: "", secure: true });
    store.userId = result.id;

    return result;
  }

  switch (response.status) {
    case 400:
      throw new Error("An error occured try again later");
    default:
      throw new Error(response.statusText);
  }
};

export const getGoogleUrl = (from) => {
  const rootUrl = `https://accounts.google.com/o/oauth2/v2/auth`;

  const options = {
    redirect_uri: process.env.VUE_APP_GOOGLE_REDIRECT_URI,
    client_id: process.env.VUE_APP_GOOGLE_CLIENT_ID,
    access_type: "offline",
    response_type: "code",
    prompt: "consent",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ].join(" "),
    state: from,
  };
  const qs = new URLSearchParams(options);

  return `${rootUrl}?${qs.toString()}`;
};
