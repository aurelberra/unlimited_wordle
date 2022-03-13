import text_answers from "./answers";
import text_allowed from "./allowed";
import { Component } from "react";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      answers_strings: text_answers.split("\n"),
      allowed_strings: text_allowed.split("\n"),
      combined_strings_set: new Set([
        ...text_allowed.split("\n"),
        ...text_answers.split("\n"),
      ]),
    };
  }

  render() {
    console.log(this.state.answers_strings.length);
    console.log(this.state.allowed_strings.length);
    console.log(this.state.combined_strings_set.size);
    return (
      <div className="App">
        <p>Hello World 3</p>
      </div>
    );
  }
}

export default App;
