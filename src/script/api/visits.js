import { apiUrl, searchParamToString } from "@/script/api/apiUrl";
import { Parameter } from "@/script/api/objects/Parameter";
import Cookies from "js-cookie";
import { generateException } from "@/script/api/objects/Exception";

/**
 * Get the list of all restaurants visited by the user
 * @param {string} id Unique identifier of the user
 * @param {number} page pages number (default 0)
 * @param {number} limit limit of result return (default 10)
 */
export const getAllRestaurantsVisitedByUser = async ({
  id,
  limit = undefined,
  page = undefined,
}) => {
  const params = [new Parameter("limit", limit), new Parameter("page", page)];

  const response = await fetch(
    `${apiUrl}users/${id}/restaurants/visits${searchParamToString(params)}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${Cookies.get("token")}`,
      },
    },
  );
  if (response.ok) return response.json();

  await generateException(
    response.status,
    "Unable to get restaurants visited by user",
  );
};

/**
 * Get the specific visit to a restaurant by the user
 * @param {string} visitId Unique identifier of the restaurant visit
 * @param {string} id Unique identifier of the user
 */
export const getOneRestaurantVisitByOneUser = async (id, visitId) => {
  return await fetch(`${apiUrl}users/${id}/restaurants/visits/${visitId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })
    .then((response) => response.json())
    .then((result) => result.items);
};

/**
 * @param {string} id Unique identifier of the user
 * @param {Object} visit Visit object to be added by/for the user
 */
export const createRestaurantVisit = async (id, visit) => {
  const response = await fetch(`${apiUrl}users/${id}/restaurants/visits`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${Cookies.get("token")}`,
    },
    body: JSON.stringify(visit),
  });

  if (response.ok) return await response.json();

  await generateException(response.status);
};

/**
 * Get the all visits to a restaurant by the user
 * @param {string} restaurantId Unique identifier of the restaurant visit
 * @param {string} id Unique identifier of the user
 * @param {number} page pages number (default 0)
 * @param {number} limit limit of result return (default 10)
 */
export const getAllVisitsToOneRestaurantByOneUser = async ({
  id,
  restaurantId,
  limit = undefined,
  page = undefined,
}) => {
  const params = [new Parameter("limit", limit), new Parameter("page", page)];

  const response = await fetch(
    `${apiUrl}users/${id}/restaurants/${restaurantId}/visits${searchParamToString(
      params,
    )}`,
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
    "Unable to get all visits to a restaurant by the user",
  );
};
