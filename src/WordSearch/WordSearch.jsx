import { useEffect, useState } from "react";
// import AllWordsPanel from "./AllWordsPanel";
import GameBoard from "./WordBoard";
// import GameWonPanel from "./GameWonPanel";
// import SettingsPanel from "./SettingsPanel";
import { WORDS } from "./words";
import './styles.css';

const NUM_WORDS_TO_FIND = 9;

const randomInt = (limit) => Math.floor(Math.random() * limit);
const weightFactor = 1.6; // higher = more weight for later

function buildWordsToFind(numWords, recency) {
  let wordsToFind = [];
  for (let i = 0; i < numWords; i++) {
    const exponent = Math.abs(recency);
    let wordGroupIndex = Math.pow(
      randomInt(Math.pow(WORDS.length, exponent)),
      1 / exponent
    );

    if (recency > 0) {
      wordGroupIndex = Math.floor(wordGroupIndex);
    } else {
      wordGroupIndex = Math.ceil(numWords - wordGroupIndex);
    }
    console.log({ wordGroupIndex });
    const words = WORDS[wordGroupIndex].filter((w) => !wordsToFind.includes(w));
    const newWord = words[randomInt(words.length)];
    console.log({ newWord });
    wordsToFind.push(newWord);
  }
  return wordsToFind;
}

export default function WordSearch() {
  const [wordListShown, setWordListShown] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [numWords, setNumWords] = useState(NUM_WORDS_TO_FIND);
  const [recency, setRecency] = useState(weightFactor);
  const [wordsToFind, setWordsToFind] = useState(
    buildWordsToFind(numWords, recency)
  );
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [encKey, setEncKey] = useState("");

  useEffect(() => {
    setWordsToFind(buildWordsToFind(numWords, recency));
  }, [numWords, recency]);

  const onDenyAward = () => {
    setWordsToFind(buildWordsToFind(numWords, recency));
    setGameWon(false);
  };

  const onSeeWordList = (e) => {
    e.preventDefault();
    setWordListShown(true);
  };

  return (
    <div className="game">
      {/* <AllWordsPanel
        wordListShown={wordListShown}
        setWordListShown={setWordListShown}
      /> */}
      <div className="game-screen">
        <GameBoard
          wordsToFind={wordsToFind}
          onSeeWordList={onSeeWordList}
          gameWon={gameWon}
          onGameWon={() => setGameWon(true)}
          key={wordsToFind.join(",")}
          onOpenSettings={() => setSettingsOpen(true)}
        />
        {/* {gameWon && (
          <GameWonPanel
            onDenyAward={onDenyAward}
            encKey={encKey}
            setEncKey={setEncKey}
          />
        )} */}
        {/* {settingsOpen && (
          <SettingsPanel
            onClose={() => setSettingsOpen(false)}
            numWords={numWords}
            recency={recency}
            setNumWords={setNumWords}
            setRecency={setRecency}
          />
        )} */}
      </div>
    </div>
  );
}
