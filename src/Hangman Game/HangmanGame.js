import { Component } from "react";

class HangmanGame extends Component {
    static defaultProps = {
        maxIncorrect: 6,
    }

    constructor(props) {
        super(props);
        this.state = {
            noWrong: 0,
            guessed: new Set(),
            answer: "apple"
        }
    }

    render() {
        return (
            null
        );
    }
}

export default HangmanGame;