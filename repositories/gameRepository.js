import Jogo from '../models/j.js';

class GameRepository {
  getAll() {
    return this.games;
  }

  getById(id) {
    return this.games.find(game => game.id === id);
  }

  add(game) {
    const id = this.games.length + 1;
    game.id = id;
    this.games.push(game);
    return game;
  }

  update(id, updatedData) {
    const game = this.getById(id);
    if (!game) return null;

    if (updatedData.name) game.name = updatedData.name;
    if (updatedData.category) game.category = updatedData.category;
    if (updatedData.price) game.price = updatedData.price;

    return game;
  }

  delete(id) {
    const index = this.products.findIndex(game => game.getId() === id);
    if (index === -1) return null;

    return this.games.splice(index, 1)[0];
  }
}

export default new GameRepository();