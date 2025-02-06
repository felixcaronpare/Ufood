import { apiUrl, searchParamToString } from "@/script/api/apiUrl";
import { Parameter } from "@/script/api/objects/Parameter";
import Cookies from "js-cookie";
import { generateException } from "@/script/api/objects/Exception";

/**
 * Get all restaurants
 * @param {number} limit number of results limit (default: 10)
 * @param {number} page pages number (default: 0)
 * @param {string} q search query
 * @param {[string]} genres genres list filter
 * @param {[number]} price_range price range list filter
 * @param {number} lon longitude
 * @param {number} lat latitude
 * @returns list of restaurants
 */
export const getRestaurants = async ({
  limit = undefined,
  page = undefined,
  q = undefined,
  genres = undefined,
  price_range = undefined,
  lon = undefined,
  lat = undefined,
}) => {
  const params = [
    new Parameter("limit", limit),
    new Parameter("page", page),
    new Parameter("q", q),
    new Parameter("genres", genres),
    new Parameter("price_range", price_range),
    new Parameter("lon", lon),
    new Parameter("lat", lat),
  ];

  const response = await fetch(
    `${apiUrl}restaurants${searchParamToString(params)}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${Cookies.get("token")}`,
      },
    },
  );

  if (response.ok) return await response.json();

  await generateException(response.status, "Unable to get restaurants");
};

/**
 * Get restaurant by id
 * @param {string} id restaurant's id
 * @returns restaurant details
 */
export const getRestaurant = async (id) => {
  const response = await fetch(`${apiUrl}restaurants/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${Cookies.get("token")}`,
    },
  });

  if (response.ok) return await response.json();

  await generateException(response.status, "Invalid restaurant id");
};

/**
 * Get restaurant's visits
 * @param {string} id
 * @param {number} limit number of results limit (default: 10)
 * @param {number} page pages number (default: 0)
 * @returns list of restaurant's visits
 */
export const getRestaurantVisits = async (
  id,
  limit = undefined,
  page = undefined,
) => {
  const params = [new Parameter("limit", limit), new Parameter("page", page)];

  const response = await fetch(
    `${apiUrl}restaurants/${id}/visits${searchParamToString(params)}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    },
  );

  if (!response.ok) throw new Error("Unable to get restaurant's visits");
  return await response.json();
};
