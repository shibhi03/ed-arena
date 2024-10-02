export const NUM_COLS = 8;
export const NUM_ROWS = 10;

export function buildBoard(wordsToFind) {
  let board = [];
  for (let i = 0; i < NUM_ROWS; i++) {
    for (let j = 0; j < NUM_COLS; j++) {
      board[i] = board[i] || [];
      board[i][j] = null;
    }
  }

  wordsToFind.sort((a, b) => b.length - a.length);
  const actualWords = [];
  wordsToFind.forEach((word) => {
    const directedWord =
      Math.floor(Math.random() * 2) === 0
        ? word
        : word.split("").reverse().join("");
    if (tryInsertWord(board, directedWord, actualWords.length)) {
      actualWords.push(word);
    }
  });

  fillEmptySpace(board);

  return [board, actualWords];
}

function tryInsertWord(board, word, currentWordCount) {
  if (currentWordCount !== 0) {
    const inserted = insertWord(board, word, true);
    if (inserted) return true;
  }
  return insertWord(board, word, false);
}

let nextDirection = 0;

function insertWord(board, word, overlap, direction = null, tries = 1000) {
  if (tries === 0) {
    return false;
  }

  direction = Math.floor(Math.random() * 4);

  const rowStart = Math.floor(Math.random() * NUM_ROWS);
  const colStart = Math.floor(Math.random() * NUM_COLS);

  const letters = word.split("");

  if (direction === 0) {
    // across
    if (fitsAcross(board, letters, rowStart, colStart, overlap)) {
      for (let i = 0; i < letters.length; i++) {
        let col = colStart + i;
        board[rowStart][col] = { letter: letters[i], found: false };
      }
    } else {
      return insertWord(board, word, overlap, direction, tries - 1);
    }
  } else if (direction === 1) {
    // down
    if (fitsDown(board, letters, rowStart, colStart, overlap)) {
      for (let i = 0; i < letters.length; i++) {
        let row = rowStart + i;
        board[row][colStart] = { letter: letters[i], found: false };
      }
    } else {
      return insertWord(board, word, overlap, direction, tries - 1);
    }
  } else if (direction === 2) {
    // diagonal down-right
    if (fitsDiagonalDownRight(board, letters, rowStart, colStart, overlap)) {
      for (let i = 0; i < letters.length; i++) {
        let row = rowStart + i;
        let col = colStart + i;
        board[row][col] = { letter: letters[i], found: false };
      }
    } else {
      return insertWord(board, word, overlap, direction, tries - 1);
    }
  } else {
    // diagonal up-right
    if (fitsDiagonalUpRight(board, letters, rowStart, colStart, overlap)) {
      for (let i = 0; i < letters.length; i++) {
        let row = rowStart - i;
        let col = colStart - i;
        board[row][col] = { letter: letters[i], found: false };
      }
    } else {
      return insertWord(board, word, overlap, direction, tries - 1);
    }
  }

  return true;
}

function fitsAcross(board, letters, rowStart, colStart, overlap) {
  if (colStart + letters.length > NUM_COLS) {
    return false;
  }

  let anyOverlap = false;
  for (let i = 0; i < letters.length; i++) {
    let col = colStart + i;
    let currentLetter = board[rowStart][col]?.letter || null;
    anyOverlap =
      anyOverlap || (currentLetter !== null && currentLetter === letters[i]);
    if (currentLetter !== null && currentLetter !== letters[i]) {
      return false;
    }
  }
  return overlap ? anyOverlap : true;
}

function fitsDown(board, letters, rowStart, colStart, overlap) {
  if (rowStart + letters.length > NUM_ROWS) {
    return false;
  }

  let anyOverlap = false;
  for (let i = 0; i < letters.length; i++) {
    let row = rowStart + i;
    let currentLetter = board[row][colStart]?.letter || null;
    anyOverlap =
      anyOverlap || (currentLetter !== null && currentLetter === letters[i]);
    if (currentLetter !== null && currentLetter !== letters[i]) {
      return false;
    }
  }
  return overlap ? anyOverlap : true;
}

function fitsDiagonalDownRight(board, letters, rowStart, colStart, overlap) {
  if (
    rowStart + letters.length > NUM_ROWS ||
    colStart + letters.length > NUM_COLS
  ) {
    return false;
  }

  let anyOverlap = false;
  for (let i = 0; i < letters.length; i++) {
    let row = rowStart + i;
    let col = colStart + i;
    let currentLetter = board[row][col]?.letter || null;
    anyOverlap =
      anyOverlap || (currentLetter !== null && currentLetter === letters[i]);
    if (currentLetter !== null && currentLetter !== letters[i]) {
      return false;
    }
  }
  return overlap ? anyOverlap : true;
}

function fitsDiagonalUpRight(board, letters, rowStart, colStart, overlap) {
  if (
    rowStart + letters.length > NUM_ROWS ||
    colStart + letters.length > NUM_COLS
  ) {
    return false;
  }

  let anyOverlap = false;
  for (let i = 0; i < letters.length; i++) {
    let row = rowStart - i;
    let col = colStart - i;
    if (row < 0 || col < 0) return false;
    let currentLetter = board[row][col]?.letter || null;
    anyOverlap =
      anyOverlap || (currentLetter !== null && currentLetter === letters[i]);
    if (currentLetter !== null && currentLetter !== letters[i]) {
      return false;
    }
  }
  return overlap ? anyOverlap : true;
}

function fillEmptySpace(board) {
  const alphabet = "abcdefghijklmnopqrstuvwxyz";
  const randomLetter = () =>
    alphabet[Math.floor(Math.random() * alphabet.length)];

  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      if (!board[i][j]) {
        board[i][j] = { letter: randomLetter(), found: false };
      }
    }
  }
}
