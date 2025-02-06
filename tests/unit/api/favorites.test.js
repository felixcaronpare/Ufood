import {createFavoriteList, deleteFavoritesList, getFavorites} from "@/script/api/favorites";


test('addFavoriteList', async () =>
{
  const fav = {
    name : "My fav list",
    owner : "asasa@asasa.sa"
  };
  return await createFavoriteList(fav).then(data =>
  {
    expect(data).not.toBeNull();
    expect(data.id).not.toBeNull();
    expect(data.name).toBe("My fav list");
  });
});

test('getFavoritesTest default',  async () =>
{
  return await getFavorites().then(data =>
  {
    expect(data).not.toBeNull();
    expect(data.length).toBe(10)
  });
});

test('getFavoritesTest one result',  async () =>
{
  return await getFavorites(1).then(data =>
  {
    expect(data).not.toBeNull();
    expect(data.length).toBe(1)
  });
});


test('deleteFavorite without param', async () =>
{
  return await deleteFavoritesList().then(data =>
  {
    expect(data).not.toBeNull();
    expect(data).toBe('Favorite list undefined was not found')
  });
})

test('deleteFavorite wrong id', async () =>
{
  return await deleteFavoritesList("myNotId").then(data =>
  {
    expect(data).not.toBeNull();
    expect(data).toBe('Favorite list myNotId was not found')
  });
})

test('deleteFavorite', async () =>
{
  const fav = {
    name : "My fav list",
    owner : "asasa@asasa.sa"
  };
  const favorite = await createFavoriteList(fav);

  return await deleteFavoritesList(favorite.id).then(data =>
  {
    expect(data).not.toBeNull();
    expect(data).toBe(200)
  });


});
