const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const GameSchema = new Schema({
  id: { type: Number, required: true },
  game_title: { type: String, required: true },
  release_date: { type: String },
  platform: { type: Number, required: true },
  quantity: { type: Number, default: 1 },
});

module.exports = mongoose.model("Game", GameSchema);
