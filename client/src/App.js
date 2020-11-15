import { useState } from "react";
import "./App.css";
import Chance from "chance";

function App() {
  const [search, setSearch] = useState({});
  const [artist, setArtist] = useState("");
  const [track, setTrack] = useState("");
  const [error, setError] = useState("");
  // const [randomNumber, setRandomNumber] = useState(null);
  const chance = new Chance();
  let randomNumber;
  let answer;

  const getParoles = async () => {
    setArtist("");
    setTrack("");
    setError("");

    const resp = await fetch("/api/get-lyrics", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ artist: search.artiste, track: search.chanson }),
    });
    const {
      success,
      error: fetchedError,
      artist: fetchedArtist,
      track: fetchedTrack,
    } = await resp.json();
    if (success === false)
      return setError(
        fetchedError ? fetchedError : "Erreur lors du fetch... désolé :("
      );
    setArtist(fetchedArtist);
    setTrack(fetchedTrack);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await getParoles();
  };

  const handleChange = ({ target: { name, value } }) => {
    setSearch({
      ...search,
      [name]: value,
    });
  };

  const handleSumbitAnswer = (e) => {
    e.preventDefault();
    return alert(
      answer.trim().toLowerCase() ===
        track.text.split(" ")[randomNumber].trim().toLowerCase()
        ? "Bien joué!!"
        : `Non :(. La réponse était ==> ${track.text.split(" ")[randomNumber]})`
    );
  };

  const sliceLyrics = ({ text }) => {
    const split = text.split(" ");
    const numberOfWords = split.length;
    const randomWordIndex = chance.integer({ min: 0, max: numberOfWords });
    randomNumber = randomWordIndex;
    const sliced = [];
    for (let i = randomWordIndex - 50; i < randomWordIndex + 50; i++) {
      if (i === randomWordIndex) {
        sliced.push("???????");
      } else {
        sliced.push(split[i]);
      }
    }
    return sliced.join(" ");
  };

  return (
    <div className="App">
      <div class="container">
        <h1>Jeu des paroles</h1>
        <form onSubmit={handleSubmit}>
          <label style={{ marginRight: "0.2 rem" }} htmlFor="artiste">
            Artiste
          </label>
          <input
            name="artiste"
            type="text"
            placeholder="Artiste"
            onChange={handleChange}
            style={{ marginRight: "1.5rem" }}
          />
          <label style={{ marginRight: "0.2 rem" }} htmlFor="chanson">
            Chanson
          </label>
          <input
            name="chanson"
            type="text"
            placeholder="Chanson"
            onChange={handleChange}
            style={{ marginRight: "1.5rem" }}
          />
          <button type="submit">Chercher</button>
        </form>
        {error && <p>{error}</p>}
        <div>
          {artist && <p>{artist.name}</p>}
          {track && <p>{track.name}</p>}
        </div>
        {track && (
          <>
            <p style={{ border: "2px solid black", padding: "2rem" }}>
              [...] {sliceLyrics(track)}
            </p>
            <form onSubmit={handleSumbitAnswer}>
              <label htmlFor="reponse">
                Quel est le mot manquant dans ces paroles ? (a la place de
                ???????)
              </label>
              <input
                name="reponse"
                type="text"
                placeholder="Réponse"
                onChange={(e) => (answer = e.target.value)}
              />
              <button type="submit">Vérifier</button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
