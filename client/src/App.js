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
  const rootUrl =
    process.env.NODE_ENV === "development" ? "http://localhost:4000" : "";

  const getParoles = async () => {
    setArtist("");
    setTrack("");
    setError("");

    const resp = await fetch(`${rootUrl}/api/get-lyrics`, {
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
        <h1 className="mb-4">Révises tes classiques</h1>
        <form onSubmit={handleSubmit}>
          <div className="d-flex justify-content-center align-content-center flex-wrap mb-4">
            <div>
              <label htmlFor="artiste" className="mx-2">
                Artiste
              </label>
              <input
                name="artiste"
                id="artiste"
                type="text"
                placeholder="Artiste"
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="chanson" className="mx-2">
                Chanson
              </label>
              <input
                name="chanson"
                id="chanson"
                type="text"
                placeholder="Chanson"
                onChange={handleChange}
              />
            </div>
          </div>
          <button type="submit" className="btn btn-primary mb-4">
            Chercher
          </button>
        </form>
        {error && <p>{error}</p>}
        {track ? (
          <div className="mb-4">
            <div
              style={{ border: "1px dotted black" }}
              className="px-4 py-4 mb-4"
            >
              <h3 className="mb-3">
                {artist.name} {track.name}
              </h3>
              [...] {sliceLyrics(track)}
            </div>
            <form onSubmit={handleSumbitAnswer}>
              <div class="mb-2">
                <label htmlFor="reponse">
                  Quel est le mot manquant dans ces paroles ? (a la place de
                  ???????)
                </label>
              </div>
              <div
                style={{ gap: "15px" }}
                className="d-flex justify-content-center"
              >
                <input
                  name="reponse"
                  type="text"
                  placeholder="Réponse"
                  onChange={(e) => (answer = e.target.value)}
                />
                <button type="submit" class="btn btn-primary">
                  Vérifier
                </button>
              </div>
            </form>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

export default App;
