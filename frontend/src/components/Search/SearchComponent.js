import React, { useState } from "react";
import axios from "axios";
import "./SearchComponent.css";
import { PlatformDetails, getPlatformById } from "../../enum/platforms";
import { toast } from "react-toastify";

const SearchComponent = ({ addToCollection }) => {
  const [query, setQuery] = useState("");
  const [games, setGames] = useState([]);
  const [platform, setPlatform] = useState(""); // Nouvel état pour le filtre de plateforme

  const searchGames = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`http://localhost:5000/proxy`, {
        params: {
          name: query,
          platform: platform,
        },
      });
      setGames(response.data.data.games);
    } catch (error) {
      console.error("Erreur lors de la recherche des jeux :", error);
      toast.error("Erreur lors de la recherche des jeux");
    }
  };

  const addToDatabase = async (game) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/games",
        game
      );
      addToCollection(response.data);
      toast.success("Jeu ajouté à la collection avec succès");
    } catch (error) {
      console.error("Erreur lors de l'ajout du jeu à la collection :", error);
      toast.error("Erreur lors de l'ajout du jeu à la collection");
    }
  };

  return (
    <div>
      <h1>Recherche de Jeux Vidéo</h1>
      <form onSubmit={searchGames} className="search-filter">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Recherchez un jeu vidéo"
        />
        <select value={platform} onChange={(e) => setPlatform(e.target.value)}>
          <option value="">Toutes les plateformes</option>
          {Object.values(PlatformDetails).map((platform) => (
            <option key={platform.id} value={platform.id}>
              {platform.name}
            </option>
          ))}
        </select>
        <button type="submit">Rechercher</button>
      </form>
      <div className="game-grid">
        {games &&
          games.map((game) => {
            const platformInfo = getPlatformById(game.platform);
            console.log(platformInfo);
            return (
              <div key={game.id} className="game-card">
                <h2>{game.game_title}</h2>
                <p>{game.release_date}</p>
                <img
                  src={`https://cdn.thegamesdb.net/images/thumb/boxart/front/${game.id}-1.jpg`}
                  alt={game.game_title}
                />
                {platformInfo ? (
                  <p>{platformInfo.name}</p>
                ) : (
                  <p>Plateforme inconnue</p>
                )}
                <button onClick={() => addToDatabase(game)}>
                  Ajouter à la collection
                </button>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default SearchComponent;
