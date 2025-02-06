import { onMounted, ref } from "vue";

const useLocation = () => {
  const location = ref({ lng: Number, lat: Number });
  const error = ref("");

  onMounted(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          location.value.lat = position.coords.latitude;
          location.value.lng = position.coords.longitude;
        },
        (err) => {
          error.value = `User location not accessed: ${err.message}`;
        },
      );
    } else {
      error.value = "Geolocation is not supported by this browser.";
    }
  });
  return { location, error };
};

const getPosition = async (options) => {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject, options);
  });
};

export { useLocation, getPosition };
