import { useEffect, useState } from "react";
import { buildBoard } from "./BoadUtils";
import Letters, { LETTER_WIDTH } from "./Letters";
import ActualWordsList from "./ActualWordsList";

export default function GameBoard({
  wordsToFind,
  onSeeWordList,
  onGameWon,
  onOpenSettings
}) {
  let board, actualWords;
  [[board, actualWords]] = useState(buildBoard(wordsToFind));

  const [selecting, setSelecting] = useState(false);
  const [startPosition, setStartPosition] = useState(null);
  const [currentPosition, setCurrentPosition] = useState(null);
  const [selectedWord, setSelectedWord] = useState(null);
  const [foundWords, setFoundWords] = useState([]);
  const [selectionCoords, setSelectionCoords] = useState({});
  const [foundOutlines, setFoundOutlines] = useState([]);

  const localOnOpenSettings = (e) => {
    e.preventDefault();
    onOpenSettings();
  };

  const onStart = (row, col) => {
    setSelecting(true);
    setStartPosition({ row, col });
    setCurrentPosition({ row, col });
  };

  const onMove = (row, col) => {
    if (!selecting) return;

    ({ row, col } = alignRowAndColumn({ row, col, startPosition }));
    setCurrentPosition({ row, col });
    //    console.log(`${startPosition.col},${startPosition.row} -> ${col},${row}`);
    setSelectedWord(readWord({ startPosition, col, row, board }));
  };

  const onEnd = (row, col) => {
    setSelecting(false);

    // only touched one letter
    if (!selectedWord) {
      return;
    }

    const reversedWord = selectedWord.split("").reverse().join("");

    //    console.log({ actualWords, selectedWord });
    if (
      actualWords.includes(selectedWord) ||
      actualWords.includes(reversedWord)
    ) {
      setFoundWords([
        ...foundWords,
        actualWords.includes(selectedWord) ? selectedWord : reversedWord
      ]);
      setFoundOutlines([...foundOutlines, selectionCoords]);
      setStartPosition(null);
      setCurrentPosition(null);
      setSelectedWord(null);
    } else {
      ({ row, col } = alignRowAndColumn({ row, col, startPosition }));
      setCurrentPosition({ row, col });
    }
  };

  useEffect(() => {
    setSelectionCoords(calcSelectionCoords(startPosition, currentPosition));
  }, [startPosition, currentPosition]);

  useEffect(() => {
    if (foundWords.length === actualWords.length) {
      onGameWon();
    }
  }, [foundWords, actualWords, onGameWon]);

  return (
    <>
      <div className="selected-word">{selectedWord}</div>
      <div className="game-board">
        <div
          className="letter-selection"
          style={{
            display: startPosition ? "block" : "none",
            ...selectionCoords
          }}
        ></div>
        {foundOutlines.map((coords, index) => (
          <div className="word-found-outline" key={index} style={{ ...coords }}>
            <div className="word-found-outline_inner"></div>
          </div>
        ))}
        <Letters
          board={board}
          onStart={onStart}
          onMove={onMove}
          onEnd={onEnd}
        />
      </div>
      <div className="footer">
        <div className="words-left">
          <a href="#" onClick={localOnOpenSettings}>
            {actualWords.length - foundWords.length} words left
          </a>
        </div>
        <a href="#" onClick={onSeeWordList}>
          See word list
        </a>
      </div>
      <ActualWordsList actualWords={actualWords} foundWords={foundWords} />
    </>
  );
}

function calcSelectionCoords(start, current) {
  if (!start || !current) {
    return { top: 0, left: 0, width: 0, height: 0 };
  }

  // return {
  //   left: start.col * LETTER_WIDTH,
  //   top: start.row * LETTER_WIDTH,
  //   width: LETTER_WIDTH,
  //   height: LETTER_WIDTH
  // };
  // return {
  //   left: current.col * LETTER_WIDTH,
  //   top: current.row * LETTER_WIDTH,
  //   width: LETTER_WIDTH,
  //   height: LETTER_WIDTH
  // };

  const diffX = current.col - start.col;
  const diffY = current.row - start.row;
  const diffXabs = Math.abs(diffX);
  const diffYabs = Math.abs(diffY);

  if (Math.abs(1 - diffXabs / diffYabs) < 0.75) {
    const startRow = start.row;
    const startCol = start.col;

    const shortSide = Math.min(diffXabs, diffYabs);
    const length = Math.sqrt(2 * shortSide * shortSide);
    const left = startCol * LETTER_WIDTH;
    const top = startRow * LETTER_WIDTH;
    const [width, height] =
      diffXabs > diffYabs
        ? [length * LETTER_WIDTH + LETTER_WIDTH, LETTER_WIDTH]
        : [LETTER_WIDTH, length * LETTER_WIDTH + LETTER_WIDTH];

    const originX = left + LETTER_WIDTH / 2;
    const originY = top + LETTER_WIDTH / 2;
    const angle = diffX < 0 ? (diffY < 0 ? 135 : 45) : diffY < 0 ? 225 : -45;

    // console.log({ left, top, originX, originY });

    return {
      left: 0,
      top: 0,
      width,
      height,
      transform: `rotate(${angle}deg) translate(${left}px,${top}px)`,
      transformOrigin: `${originX}px ${originY}px`
    };
  } else {
    const startRow = diffY < 0 ? start.row + diffY : start.row;
    const startCol = diffX < 0 ? start.col + diffX : start.col;

    return {
      left: startCol * LETTER_WIDTH,
      top: startRow * LETTER_WIDTH,
      width: diffXabs * LETTER_WIDTH + LETTER_WIDTH,
      height: diffYabs * LETTER_WIDTH + LETTER_WIDTH
    };
  }
}

function readWord({ startPosition, col, row, board }) {
  let word = "";

  const colSign = startPosition.col < col ? 1 : -1;
  const rowSign = startPosition.row < row ? 1 : -1;

  const diffX = col - startPosition.col;
  const diffY = row - startPosition.row;

  if (startPosition.row === row) {
    for (let j = 0; j <= Math.abs(diffX); j++) {
      word += board[row][startPosition.col + j * colSign]?.letter;
    }
  } else if (startPosition.col === col) {
    for (let i = 0; i <= Math.abs(diffY); i++) {
      word += board[startPosition.row + i * rowSign][col]?.letter;
    }
  } else {
    for (let i = 0; i <= Math.min(Math.abs(diffX), Math.abs(diffY)); i++) {
      word +=
        board[startPosition.row + i * rowSign][startPosition.col + i * colSign]
          ?.letter;
    }
  }
  return word;
}

function alignRowAndColumn({ row, col, startPosition }) {
  const diffX = col - startPosition.col;
  const diffY = row - startPosition.row;
  const diffXabs = Math.abs(diffX);
  const diffYabs = Math.abs(diffY);

  if (Math.abs(1 - diffXabs / diffYabs) < 0.75) {
    const minSide = Math.min(diffXabs, diffYabs);
    row = startPosition.row + minSide * (diffY / diffYabs);
    col = startPosition.col + minSide * (diffX / diffXabs);

    const tooMuch = Math.min(row, col); // most negative number
    if (tooMuch < 0) {
      console.log({ tooMuch, row, col });
      row = row + tooMuch * (diffY / diffYabs);
      col = col + tooMuch * (diffX / diffXabs);
    }
  } else if (diffXabs > diffYabs) {
    row = startPosition.row;
  } else {
    col = startPosition.col;
  }
  return { row: Math.max(row, 0), col: Math.max(col, 0) };
}
