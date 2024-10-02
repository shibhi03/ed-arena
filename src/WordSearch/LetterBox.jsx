export default function LetterBox({
    letter,
    row,
    col,
    onStart,
    onMove,
    onEnd
  }) {
    const onTouchStart = () => {
      onStart(row, col);
    };
    const onTouchMove = (e) => {
      // e.preventDefault();
      // e.stopPropagation();
      // onMove(row, col);
      // return false;
    };
    const onTouchEnd = () => {
      onEnd(row, col);
    };
  
    return (
      <div
        className="game-board_letter"
        onTouchStart={onTouchStart}
        onMouseDown={onTouchStart}
        onTouchMove={onTouchMove}
        onMouseMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onMouseUp={onTouchEnd}
      >
        {letter || "·"}
      </div>
    );
  }
  