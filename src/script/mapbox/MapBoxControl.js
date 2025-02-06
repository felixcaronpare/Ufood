import mapboxgl from "mapbox-gl/dist/mapbox-gl.js";
import { getPosition } from "@/script/useLocation";

let markers = [];
export const accessToken =
  "pk.eyJ1IjoiZWJ1ZGR5IiwiYSI6ImNsbnZ6Nmx5MzAzd28ybnBjYjZ5andscHgifQ.SaFY8m8juAtAoNDg20NPSw";

export const addPopup = (description) => {
  return new mapboxgl.Popup({ offset: 25 }).setHTML(description);
};

export const addMarkerWithPopup = async (map, lng, lat, description) => {
  const marker = await new mapboxgl.Marker()
    .setLngLat([lng, lat])
    .setPopup(addPopup(description))
    .addTo(map.value);

  markers.push(marker);
  return marker;
};

export const addMarker = async (map, lng, lat) => {
  const marker = await new mapboxgl.Marker()
    .setLngLat([lng, lat])
    .addTo(map.value);

  markers.push(marker);
  return marker;
};

export const clearMarker = async () => {
  markers.forEach((marker) => marker.remove());
  markers = [];
};

export const getDirection = async (mapboxItem, end) => {
  const position = await getPosition();
  return await directionSuccess(position, mapboxItem, end);
};

const directionSuccess = async (start, map, end) => {
  const query = await fetch(
    `https://api.mapbox.com/directions/v5/mapbox/driving/${start.coords.longitude},${start.coords.latitude};${end.coordinates[0]},${end.coordinates[1]}?alternatives=true&geometries=geojson&language=en&overview=full&steps=true&access_token=${mapboxgl.accessToken}`,
    { method: "GET" },
  );

  const json = await query.json();
  const data = json.routes[0];
  const route = data.geometry.coordinates;

  const geojson = {
    type: "Feature",
    properties: {},
    geometry: {
      type: "LineString",
      coordinates: route,
    },
  };

  if (map.value.getSource("route")) {
    map.value.getSource("route").setData(data);
  } else {
    map.value.addLayer({
      id: "route",
      type: "line",
      source: {
        type: "geojson",
        data: geojson,
      },
      layout: {
        "line-join": "round",
        "line-cap": "round",
      },
      paint: {
        "line-color": "#3887be",
        "line-width": 5,
        "line-opacity": 0.75,
      },
    });
  }

  await setBound(map, [
    [start.coords.longitude, start.coords.latitude],
    end.coordinates,
  ]);
  await addMarker(map, start.coords.longitude, start.coords.latitude);

  return {
    duration: data.duration,
    steps: data.legs[0].steps,
    distance: data.distance,
  };
};

/**
 *
 * @param map Object containing the map
 * @param {Array} coordinates Array of coordinates
 */
export const setBound = async (map, coordinates) => {
  if (coordinates.length >= 1) {
    //Set the zoom on the map
    let bounds = new mapboxgl.LngLatBounds();

    for (let i = 0; i < coordinates.length; i++) bounds.extend(coordinates[i]);
    await map.value.fitBounds(bounds, { padding: 40, maxZoom: 13 });
  }
};
