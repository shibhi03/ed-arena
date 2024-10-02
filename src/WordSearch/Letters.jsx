import LetterBox from "./LetterBox";
import { NUM_COLS, NUM_ROWS } from "./BoadUtils";

export const LETTER_WIDTH = 38;

export default function Letters({ board, onStart, onMove, onEnd }) {
  const onTouchMove = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const viewportOffset = e.currentTarget.getBoundingClientRect();
    let col, row;

    if (e.touches && e.touches[0]) {
      col = Math.floor(
        (e.touches[0].clientX - viewportOffset.left) / LETTER_WIDTH
      );
      row = Math.floor(
        (e.touches[0].clientY - viewportOffset.top) / LETTER_WIDTH
      );
    } else {
      col = Math.floor((e.clientX - viewportOffset.left) / LETTER_WIDTH);
      row = Math.floor((e.clientY - viewportOffset.top) / LETTER_WIDTH);
    }

    col = Math.min(col, NUM_COLS - 1);
    row = Math.min(row, NUM_ROWS - 1);

    onMove(row, col);

    return false;
  };

  return (
    <div onTouchMove={onTouchMove} onMouseMove={onTouchMove}>
      {board.map((row, rowIndex) => (
        <div className="game-board_row" key={`row${rowIndex}`}>
          {row.map((col, colIndex) => (
            <LetterBox
              letter={col?.letter}
              row={rowIndex}
              col={colIndex}
              key={`letter${rowIndex}-${colIndex}`}
              onStart={onStart}
              onEnd={onEnd}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
