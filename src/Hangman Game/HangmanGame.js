import { Component } from "react";

// Styling
import "./HangmanStyle.css";

// Resources
import img0 from "./images/0.png";
import img1 from "./images/1.png";
import img2 from "./images/2.png";
import img3 from "./images/3.png";
import img4 from "./images/4.png";
import img5 from "./images/5.png";
import img6 from "./images/6.png";

class HangmanGame extends Component {
  static defaultProps = {
    maxIncorrect: 6,
    imgs: [img0, img1, img2, img3, img4, img5, img6],
  };

  constructor(props) {
    super(props);
    let random = { hint: "It is a fruit", answer: "apple" };
    this.state = {
      noWrong: 0,
      guessed: new Set(),
      hint: random.hint,
      answer: random.answer,
    };
    this.letters = new Set(
      this.state.answer.concat(this.randomStr()).split("").sort()
    );
    this.handleGuess = this.handleGuess.bind(this);
    this.reset = this.reset.bind(this);
  }

  // Methods
  reset() {
    this.setState({
      noWrong: 0,
      guessed: new Set(),
      answer: "apple",
    });
  }
  /** guessedWord: show current-state of word:
        if guessed letters are {a,p,e}, show "app_e" for "apple"
      */
  guessedWord() {
    return this.state.answer
      .split("")
      .map((ltr) => (this.state.guessed.has(ltr) ? ltr : "_"));
  }

  /** handleGuest: handle a guessed letter:
        - add to guessed letters
        - if not in answer, increase number-wrong guesses
      */
  handleGuess(evt) {
    let ltr = evt.target.value;
    this.setState((st) => ({
      guessed: st.guessed.add(ltr),
      noWrong: st.noWrong + (st.answer.includes(ltr) ? 0 : 1),
    }));
  }

  randomStr() {
    const alpha = "abcdefghijklmnopqrstuvwxyz";
    let result = "";

    for (let i = 0; i < 10; i++) {
      result += alpha[Math.floor(Math.random() * alpha.length)];
    }

    return result;
  }

  /** generateButtons: return array of letter buttons to render */
  generateButtons() {
    return Array.from(this.letters).map((ltr) => (
      <button
        key={ltr}
        value={ltr}
        onClick={this.handleGuess}
        disabled={this.state.guessed.has(ltr)}
      >
        {ltr}
      </button>
    ));
  }

  render() {
    const gameOver = this.state.noWrong >= this.props.maxIncorrect;
    const isWinner = this.guessedWord().join("") === this.state.answer;
    const altText = `${this.state.noWrong} / ${this.props.maxIncorrect}`;
    let gameState = this.generateButtons();
    let button = "Restart?";
    if (isWinner) {
      gameState = "You Win!!";
      button = "Next word \u2192";
    }
    if (gameOver) gameState = "You Loose!!";
    return (
      <div className="Hangman">
        <h1>Hangman</h1>
        <p className="hint">Hint: {this.state.hint}</p>
        <img src={this.props.imgs[this.state.noWrong]} alt={altText} />
        <p>Wrong guesses: {this.state.noWrong}</p>
        <p className="Hangman-word">
          {!gameOver ? this.guessedWord() : this.state.answer}
        </p>
        <p className="Hangman-btns">{gameState}</p>
        <button id="reset" onClick={this.reset}>
          {button}
        </button>
      </div>
    );
  }
}

export default HangmanGame;
