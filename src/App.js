import text_answers from "./answers";
import text_allowed from "./allowed";
import React, { Component } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import BackspaceIcon from "@mui/icons-material/Backspace";
import Button from "@mui/material/Button";

const mx = text_answers.split("\n").length - 1;
const answers_strings = text_answers.split("\n");
const combined_strings_set = new Set([
  ...text_allowed.split("\n"),
  ...text_answers.split("\n"),
]);
const OnScreenKeyboard = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["Enter", "Z", "X", "C", "V", "B", "N", "M", "Backspace"],
];

const random_key = Math.floor(Math.random() * mx);
const curr_answer = answers_strings[random_key];
//const curr_answer = ;
class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      game_over: false,
      prevrow: 0,
      prevcol: -1,
      value: Array(6)
        .fill(0)
        .map((row) => new Array(5).fill("")),
      cell_color: Array(6)
        .fill(0)
        .map((row) => new Array(5).fill("black")),

      KeyboardKeyColor: Array(26).fill("grey"),
    };
  }

  handleOnKeyPress = async (e) => {
    console.log(e.key);
    if (e.ctrlKey) {
      return;
    }
    if (e.altKey) {
      return;
    }
    if (this.state.game_over) {
      return;
    }
    if (e.keyCode >= 65 && e.keyCode <= 90) {
      let temp_currow = this.state.prevrow.valueOf();
      console.log(this.state.prevrow);
      let temp_currcol = this.state.prevcol.valueOf();
      console.log(temp_currow);
      console.log(temp_currcol);
      if (temp_currcol <= 3) {
        temp_currcol++;
        let temp_value = [...this.state.value];
        console.log(temp_value);
        temp_value[temp_currow][temp_currcol] = e.key.toLowerCase();
        this.setState({
          prevrow: temp_currow,
          prevcol: temp_currcol,
          value: temp_value,
        });
      }
    } else if (e.keyCode === 8) {
      //backspace
      let temp_prevrow = this.state.prevrow.valueOf();
      let temp_prevcol = this.state.prevcol.valueOf();
      let temp_value = [...this.state.value];
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
      let curr_row = this.state.prevrow.valueOf();
      let curr_col = this.state.prevcol.valueOf();
      if (curr_col === 4) {
        let word = "";
        for (let i = 0; i < 5; ++i) {
          word += this.state.value[curr_row][i].valueOf();
        }
        if (combined_strings_set.has(word)) {
          let temp_cell_color = [...this.state.cell_color];
          let extra_1 = [];
          let extra_2 = new Set();
          let temp_keyboardKeyColor = [...this.state.KeyboardKeyColor];
          for (let i = 0; i < 5; ++i) {
            if (word[i] === curr_answer[i]) {
              temp_cell_color[curr_row][i] = "#6aaa64"; //green color
              const temp_keyCode = word[i].toUpperCase().charCodeAt(0) - 65;
              temp_keyboardKeyColor[temp_keyCode] = "#6aaa64";
            } else {
              extra_1.push(i);
              extra_2.add(curr_answer[i]);
            }
          }
          for (let i = 0; i < extra_1.length; ++i) {
            const character = word[extra_1[i]];
            //console.log(character);
            if (extra_2.has(character)) {
              //console.log("Has this character");
              const temp_keyCode = character.toUpperCase().charCodeAt(0) - 65;
              if (temp_keyboardKeyColor[temp_keyCode] !== "#6aaa64") {
                temp_keyboardKeyColor[temp_keyCode] = "#c9b458";
              }
              temp_cell_color[curr_row][extra_1[i]] = "#c9b458"; //yellow color
              extra_2.delete(character);
            } else {
              const temp_keyCode = character.toUpperCase().charCodeAt(0) - 65;
              if (temp_keyboardKeyColor[temp_keyCode] !== "#6aaa64") {
                temp_keyboardKeyColor[temp_keyCode] = "black";
              }
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
            KeyboardKeyColor: temp_keyboardKeyColor,
            game_over: word === curr_answer,
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

  handleKeyboard = (value) => {
    var temp_keyCode;
    if (value === "Backspace") {
      temp_keyCode = 8;
    } else if (value === "Enter") {
      temp_keyCode = 13;
    } else {
      temp_keyCode = value.charCodeAt(0);
    }
    const spaceEvnt = new KeyboardEvent("keydown", {
      key: value,
      keyCode: temp_keyCode,
      which: temp_keyCode,
    });
    document.dispatchEvent(spaceEvnt);
  };

  componentDidMount() {
    document.addEventListener("keydown", this.handleOnKeyPress, false);
  }

  render() {
    console.log("rerender");
    return (
      <div className="App">
        <p>{curr_answer}</p>
        <div className="wordle_grid">
          <Container>
            {this.state.value.map((name, index) => {
              return (
                <Row key={index} lg={5} md={5} sm={5} xl={5} xs={5} xxl={5}>
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
          </Container>
        </div>
        <div className="onscreenkeyboard">
          <Container>
            {OnScreenKeyboard.map((name, index) => {
              console.log(name.length);
              const len = name.length;
              return (
                <Row key={index} xs={len}>
                  {name.map((index_value, cindex) => {
                    return (
                      <Col key={`${index}${cindex}`}>
                        {index_value !== "Backspace" ? (
                          <Button
                            variant="contained"
                            style={{
                              backgroundColor:
                                index_value !== "Enter" &&
                                index_value !== "Backspace"
                                  ? this.state.KeyboardKeyColor[
                                      index_value.charCodeAt(0) - 65
                                    ]
                                  : "grey",
                              textAlign: "center",
                              fontWeight: "bold",
                            }}
                            onClick={() => {
                              this.handleKeyboard(index_value);
                            }}
                          >
                            {index_value}
                          </Button>
                        ) : (
                          <Button
                            variant="contained"
                            style={{ background: "grey" }}
                            startIcon={
                              <BackspaceIcon style={{ color: "white" }} />
                            }
                            onClick={() => {
                              this.handleKeyboard(index_value);
                            }}
                          />
                        )}
                      </Col>
                    );
                  })}
                </Row>
              );
            })}
          </Container>
        </div>
      </div>
    );
  }
}

export default App;
