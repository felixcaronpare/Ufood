import { onMounted, reactive, ref } from "vue";
import { getUserFavoritesResto } from "@/script/api/users";

/**
 * A composable to fetch Lists of Favorites Restaurant based on a user id
 * @param {string} id unique identifier of a user
 * @returns isLoading boolean, favoriteLists null
 */
export function useUserFavoriteResto(id) {
  const favoriteLists = reactive({ lists: [] });
  const isLoading = ref(false);

  onMounted(async () => {
    isLoading.value = true;
    await getUserFavoritesResto(id)
      .then((response) => (favoriteLists.lists = response.items))
      .catch((err) => {
        //TODO throw Error(err);
      });
  });
  return { favoriteLists, isLoading };
}
