const express = require("express");
const router = express.Router();
const Game = require("../models/Game");

// @route   GET /api/games
// @desc    Get all games
router.get("/", async (req, res) => {
  try {
    const platform = req.query.platform;
    let games;
    if (platform) {
      games = await Game.find({ platform });
    } else {
      games = await Game.find();
    }
    res.json(games);
  } catch (err) {
    console.error("Erreur lors de la récupération des jeux :", err);
    res.status(500).json({ message: err.message });
  }
});

// @route   GET /api/games/duplicates
// @desc    Get games with quantity greater than 1
router.get("/duplicates", async (req, res) => {
  try {
    const games = await Game.find({ quantity: { $gt: 1 } });
    res.json(games);
  } catch (err) {
    console.error(
      "Erreur lors de la récupération des jeux en grande quantité :",
      err
    );
    res.status(500).json({ message: err.message });
  }
});

// @route   POST /api/games
// @desc    Add a new game
router.post("/", async (req, res) => {
  const { id, game_title, release_date, platform } = req.body;

  try {
    let game = await Game.findOne({ game_title, platform });
    if (game) {
      game.quantity += 1;
    } else {
      game = new Game({
        id,
        game_title,
        release_date,
        platform,
        quantity: 1,
      });
    }
    const savedGame = await game.save();
    res.json(savedGame);
  } catch (err) {
    console.error(
      "Erreur lors de l'ajout ou de l'incrémentation du jeu :",
      err
    );
    res.status(400).json({ message: err.message });
  }
});

// @route   DELETE /api/games/:id
// @desc    Delete a game
router.delete("/:id", async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    console.log(game);
    if (!game) {
      return res.status(404).json({ message: "Jeu non trouvé" });
    }

    if (game.quantity > 1) {
      game.quantity -= 1;
      await game.save();
      res.json({ message: "Quantité décrémentée", game });
    } else {
      await game.deleteOne();
      res.json({ message: "Jeu supprimé" });
    }
  } catch (err) {
    console.error(
      "Erreur lors de la suppression ou de la décrémentation du jeu :",
      err
    ); // Ajout de logs d'erreur
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
