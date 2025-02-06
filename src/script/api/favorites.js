import { apiUrl, searchParamToString } from "@/script/api/apiUrl";
import { Parameter } from "@/script/api/objects/Parameter";
import Cookies from "js-cookie";
import { generateException } from "@/script/api/objects/Exception";

export const createFavoriteList = async (name, owner) => {
  const response = await fetch(`${apiUrl}favorites`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${Cookies.get("token")}`,
    },
    body: JSON.stringify({
      name: name,
      owner: owner,
    }),
  });

  if (response.ok) return await response.json();

  await generateException(response.status, "Unable to create favorites list");
};

/**
 * Get the list of all favorites
 * @param {number} page pages number (default 0)
 * @param {number} limit limit of result return (default 10)
 */
export const getFavorites = async (limit = undefined, page = undefined) => {
  const params = [new Parameter("limit", limit), new Parameter("page", page)];

  const response = await fetch(
    `${apiUrl}favorites${searchParamToString(params)}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${Cookies.get("token")}`,
      },
    },
  );

  if (response.ok) return await response.json().items;

  await generateException(response.status, "Unable to get favorites");
};

/**
 * Get a specific favorite list
 * @param {string} listId Unique identifier of the specific favorites list
 */
export const getFavoriteList = async (listId) => {
  const response = await fetch(`${apiUrl}favorites/${listId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${Cookies.get("token")}`,
    },
  });

  if (response.ok) return await response.json();

  await generateException(response.status, "Invalid favorites id");
};

/**
 * Delete the favorite
 * @param {string} id Unique identifier of the specific favorites list
 */
export const deleteFavoritesList = async (id) => {
  const response = await fetch(`${apiUrl}favorites/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `${Cookies.get("token")}`,
    },
  });

  if (response.ok) return await response.json();

  await generateException(response.status);
};

/**
 * Remove a restaurant from a favorites list
 * @param {number} id unique identifier of the favorites list to remove from
 * @param {number} restaurantId unique identifier of the restaurant to delete
 */
export const deleteFavoriteRestaurant = async (id, restaurantId) => {
  const response = await fetch(
    `${apiUrl}favorites/${id}/restaurants/${restaurantId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `${Cookies.get("token")}`,
      },
    },
  );

  if (response.ok) return await response.json();

  await generateException(response.status, "Unable to find the restaurant");
};

/**
 * Add a restaurant to a favorites list
 * @param {number} listId unique identifier of the favorites list to append into
 * @param {number} restaurantId unique identifier of the restaurant to append
 */
export const addFavoriteRestaurant = async (listId, restaurantId) => {
  const response = await fetch(`${apiUrl}favorites/${listId}/restaurants`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${Cookies.get("token")}`,
    },
    body: JSON.stringify({
      id: restaurantId,
    }),
  });

  if (response.ok) return await response.json();

  await generateException(response.status, "Unable to find the favorite list");
};

/**
 * Modify a favorites list
 * @param {number} id unique identifier of the favorites list to modify
 * @param name
 * @param owner
 */
export const modifyFavoritesList = async (id, name, owner) => {
  const response = await fetch(`${apiUrl}favorites/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${Cookies.get("token")}`,
    },
    body: JSON.stringify({
      name: name,
      owner: owner,
    }),
  });

  if (response.ok) return await response.json();

  await generateException(
    response.status,
    "There was an error modifying the list",
  );
};
