export default function ActualWordsList({ actualWords, foundWords }) {
    const isWordFound = (word) => foundWords.includes(word);
  
    return (
      <div className="words-list">
        {actualWords.map((word) => (
          <div
            className={`words-list_word ${
              isWordFound(word) ? "words-list_word--found" : null
            }`}
            key={word}
          >
            {word}
          </div>
        ))}
      </div>
    );
  }
  