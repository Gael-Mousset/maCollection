import React, { useEffect, useState } from "react";
import axios from "axios";
import { PlatformDetails, getPlatformById } from "../../enum/platforms";
import "./MaCollectionComponents.css";
import { toast } from "react-toastify";

const MyCollection = () => {
  const [collection, setCollection] = useState([]);
  const [duplicates, setDuplicates] = useState([]);
  const [query, setQuery] = useState("");
  const [platform, setPlatform] = useState("");

  useEffect(() => {
    const fetchCollection = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/games", {
          params: { platform },
        });
        const sortedGames = response.data.sort((a, b) =>
          a.game_title.localeCompare(b.game_title)
        );
        setCollection(response.data);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération de la collection :",
          error
        );
        toast.error("Erreur lors de la récupération de la collection");
      }
    };

    fetchCollection();
  }, [platform]);

  const fetchDuplicates = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/games/duplicates"
      );
      setDuplicates(response.data);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des jeux en grande quantité :",
        error
      );
      toast.error("Erreur lors de la récupération des jeux en grande quantité");
    }
  };

  const removeFromCollection = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/games/${id}`
      );
      if (response.data.game) {
        setCollection(
          collection.map((game) =>
            game._id === id ? { ...game, quantity: game.quantity - 1 } : game
          )
        );
        toast.success("Quantité décrémentée avec succès");
      } else {
        setCollection(collection.filter((game) => game._id !== id));
        toast.success("Jeu supprimé de la collection avec succès");
      }
    } catch (error) {
      console.error(
        "Erreur lors de la suppression ou de la décrémentation du jeu :",
        error
      );
      toast.error(
        "Erreur lors de la suppression ou de la décrémentation du jeu"
      );
    }
  };

  return (
    <div>
      <h1>Ma Collection de Jeux</h1>
      <div className="collection-filter">
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
        <button onClick={fetchDuplicates}>Afficher les Doublons</button>{" "}
      </div>
      {collection.length === 0 ? (
        <p>Aucun jeu dans la collection.</p>
      ) : collection.filter((f) => f.game_title.includes(query)).length ===
        0 ? (
        <p>le jeu chercher n'est pas dans la collection</p>
      ) : (
        <div className="game-grid-collection">
          {collection
            .filter((f) => f.game_title.includes(query))
            .map((game) => {
              const platformInfo = getPlatformById(game.platform);
              console.log();
              return (
                <div key={game._id} className="game-card-collection">
                  <h2>{game.game_title}</h2>
                  <p>{game.release_date}</p>
                  <img
                    src={`https://cdn.thegamesdb.net/images/thumb/boxart/front/${game.id}-1.jpg`}
                    alt={game.game_title}
                  />
                  {platformInfo && <p> {platformInfo.name}</p>}
                  <p>Quantité: {game.quantity}</p>
                  <button
                    className="delete-button-collection"
                    onClick={() => removeFromCollection(game._id)}
                  >
                    Supprimer
                  </button>
                </div>
              );
            })}
        </div>
      )}
      {duplicates.length > 0 && (
        <div>
          <h2>Jeux en Grande Quantité</h2>
          <div className="game-grid">
            {duplicates.map((game) => {
              const platformInfo = getPlatformById(game.platform);
              return (
                <div key={game._id} className="game-card">
                  <h2>{game.game_title}</h2>
                  <p>{game.release_date}</p>
                  <img
                    src={`https://cdn.thegamesdb.net/images/thumb/boxart/front/${game.id}-1.jpg`}
                    alt={game.game_title}
                  />
                  {platformInfo ? (
                    <p>Plateforme: {platformInfo.name}</p>
                  ) : (
                    <p>Plateforme inconnue</p>
                  )}
                  <p>Quantité: {game.quantity}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyCollection;
