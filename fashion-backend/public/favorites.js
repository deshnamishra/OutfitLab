const FavoriteManager = {
  getFavorites: () => {
    const data = localStorage.getItem('favorites');
    return data ? JSON.parse(data) : [];
  },

  saveFavorites: (favorites) => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
    document.dispatchEvent(new Event('favoritesUpdated'));
  },

  toggleFavorite: (item) => {
    let favorites = FavoriteManager.getFavorites();
    const exists = favorites.some(fav => fav.id === item.id);
    if (exists) {
      favorites = favorites.filter(fav => fav.id !== item.id);
    } else {
      favorites.push(item);
    }
    FavoriteManager.saveFavorites(favorites);
  }
};
