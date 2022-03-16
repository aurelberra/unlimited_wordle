import text_answers from "./answers";
import text_allowed from "./allowed";
import React, { Component } from "react";
//import Grid from "@material-ui/core/Grid";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "bootstrap/dist/css/bootstrap.css";
//import Item from "@material-ui/core/Item";
//import Input from "@material-ui/core/Input";
// import RICIBs from "react-individual-character-input-boxes";
// import default_value from "./default";
import "./App.css";

var mx = text_answers.split("\n").length - 1;
var answers_strings = text_answers.split("\n");
var allowed_strings = text_allowed.split("\n");
var combined_strings_set = new Set([
  ...text_allowed.split("\n"),
  ...text_answers.split("\n"),
]);

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      random_key: Math.floor(Math.random() * mx),
      game_over: false,
      prevrow: 0,
      prevcol: -1,
      value: Array(6)
        .fill(0)
        .map((row) => new Array(5).fill("")),
      cell_color: Array(6)
        .fill(0)
        .map((row) => new Array(5).fill("black")),
    };
  }

  handleOnKeyPress = async (e) => {
    console.log(e.key);
    if (this.state.game_over) {
      return;
    }
    if (e.keyCode >= 65 && e.keyCode <= 90 && !e.ctrlKey) {
      let temp_currow = this.state.prevrow;
      let temp_currcol = this.state.prevcol;
      if (temp_currcol <= 3) {
        temp_currcol++;
        let temp_value = this.state.value;
        temp_value[temp_currow][temp_currcol] = e.key.toLowerCase();
        this.setState({
          prevrow: temp_currow,
          prevcol: temp_currcol,
          value: temp_value,
        });
      }
    } else if (e.keyCode === 8) {
      //backspace
      let temp_prevrow = this.state.prevrow;
      let temp_prevcol = this.state.prevcol;
      let temp_value = this.state.value;
      temp_value[temp_prevrow][temp_prevcol] = "";
      if (temp_prevcol >= 0) {
        temp_prevcol--;
      } else {
        return;
      }
      this.setState({
        prevrow: temp_prevrow,
        prevcol: temp_prevcol,
        value: temp_value,
      });
    } else if (e.keyCode === 13) {
      //enter
      let curr_row = this.state.prevrow;
      let curr_col = this.state.prevcol;
      if (curr_col === 4) {
        let word = "";
        for (let i = 0; i < 5; ++i) {
          word += this.state.value[curr_row][i];
        }
        if (combined_strings_set.has(word)) {
          let temp_cell_color = this.state.cell_color;
          let extra_1 = [];
          let extra_2 = new Set();
          for (let i = 0; i < 5; ++i) {
            if (word[i] === answers_strings[this.state.random_key][i]) {
              temp_cell_color[curr_row][i] = "#6aaa64";
            } else {
              extra_1.push(i);
              extra_2.add(answers_strings[this.state.random_key][i]);
            }
          }
          for (let i = 0; i < extra_1.length; ++i) {
            let character = word[extra_1[i]];
            console.log(character);
            if (extra_2.has(character)) {
              console.log("Has this character");
              temp_cell_color[curr_row][extra_1[i]] = "#c9b458";
              extra_2.delete(character);
            }
          }
          if (curr_row <= 4) {
            curr_row++;
            curr_col = -1;
          } else {
            console.log("curr_row = " + curr_row);
            this.setState({
              game_over: true,
            });
            console.log("Game Over");
          }
          this.setState({
            cell_color: temp_cell_color,
            prevrow: curr_row,
            prevcol: curr_col,
          });
        } else {
          console.log("word = " + word);
          console.log("Not a valid word");
        }
      } else {
        console.log("curr_col = " + curr_col);
        console.log("word size must be 5");
      }
    }
  };

  componentDidMount() {
    document.addEventListener("keydown", this.handleOnKeyPress, false);
  }

  render() {
    return (
      <div className="App">
        <p>{answers_strings[this.state.random_key]}</p>
        <div className="wordle_grid">
          {this.state.value.map((name, index) => {
            return (
              <Row key={index}>
                {name.map((index_value, cindex) => {
                  return (
                    <Col key={`${index}${cindex}`}>
                      <div
                        style={{
                          backgroundColor: `${this.state.cell_color[index][cindex]}`,
                        }}
                      >
                        <p
                          style={{
                            color: "white",
                            textAlign: "center",
                            fontWeight: "bold",
                          }}
                        >
                          {index_value.toUpperCase()}
                        </p>
                      </div>
                    </Col>
                  );
                })}
              </Row>
            );
          })}
        </div>
      </div>
    );
  }
}

export default App;
