import { apiUrl, searchParamToString } from "@/script/api/apiUrl";
import { Parameter } from "@/script/api/objects/Parameter";
import Cookies from "js-cookie";
import { generateException } from "@/script/api/objects/Exception";
import { store } from "@/script/store";

export const getUsers = async ({
  limit = undefined,
  page = undefined,
  q = undefined,
}) => {
  const params = [
    new Parameter("limit", limit),
    new Parameter("page", page),
    new Parameter("q", q),
  ];

  const response = await fetch(`${apiUrl}users${searchParamToString(params)}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${Cookies.get("token")}`,
    },
  });

  if (response.ok) return await response.json();

  await generateException(response.status, "Unable to get users");
};

export const showUserInfo = async (id) => {
  const response = await fetch(`${apiUrl}users/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${Cookies.get("token")}`,
    },
  });

  if (response.ok) return await response.json();

  await generateException(response.status);
};

export const getUserFavoritesResto = async (
  id,
  limit = undefined,
  page = undefined,
) => {
  const params = [new Parameter("limit", limit), new Parameter("page", page)];

  const response = await fetch(
    `${apiUrl}users/${id}/favorites${searchParamToString(params)}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${Cookies.get("token")}`,
      },
    },
  );

  if (response.ok) return await response.json();

  await generateException(
    response.status,
    "Unable do find user favorite lists",
  );
};

export const followUser = async (idToFollow) => {
  const response = await fetch(`${apiUrl}follow`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${Cookies.get("token")}`,
    },
    body: JSON.stringify({
      id: idToFollow,
    }),
  });

  if (response.ok) {
    return await response.json();
  }
  await generateException(response.status);
};
export const unFollow = async (idToUnFollow) => {
  const response = await fetch(`${apiUrl}follow/${idToUnFollow}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${Cookies.get("token")}`,
    },
  });

  if (response.ok) {
    return await response.json();
  }
  await generateException(response.status);
};

export const signUp = async (newUser) => {
  const response = await fetch(`${apiUrl}signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${Cookies.get("token")}`,
    },
    body: JSON.stringify(newUser),
  });

  if (response.ok) {
    const result = await response.json();

    Cookies.set("token", result.token, { path: "", secure: true });
    store.userId = result.id;
    return result;
  } else {
    const errorMessage = await response.text();
    switch (response.status) {
      case 401:
        throw new Error("This account already exist ");
      default:
        throw new Error(errorMessage.message || response.statusText);
    }
  }
};
