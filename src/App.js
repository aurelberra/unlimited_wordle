import text_answers from "./answers";
import text_allowed from "./allowed";
import React, { Component } from "react";
import "./App.css";
import BackspaceIcon from "@mui/icons-material/Backspace";
import CheckIcon from "@mui/icons-material/Check";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
//import IconButton from "@mui/material/IconButton";

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

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      window_width: 0,
      window_height: 0,
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
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
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
    this.updateWindowDimensions();
    window.addEventListener("resize", this.updateWindowDimensions);
    document.addEventListener("keydown", this.handleOnKeyPress, false);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateWindowDimensions);
  }

  updateWindowDimensions() {
    this.setState({
      window_width: window.innerWidth,
      window_height: window.innerHeight,
    });
  }

  render() {
    console.log("window width = " + this.state.window_width);
    console.log("window width = " + this.state.window_height);
    console.log("rerender");
    console.log(curr_answer);
    return (
      <div className="App">
        <div className="wordle_grid" style={{ marginTop: 10 }}>
          {this.state.value.map((name, index) => {
            var sz_w = Math.floor(this.state.window_width / name.length);
            if (sz_w > 100) {
              sz_w = 100;
            }
            var sz_h = (2 * this.state.window_height) / 24;
            if (sz_h > 100) {
              sz_h = 100;
            }
            return (
              <Stack
                key={index}
                direction="row"
                justifyContent="center"
                alignItems="center"
                spacing={1}
              >
                {name.map((index_value, cindex) => {
                  return (
                    <div
                      key={`${index}${cindex}`}
                      style={{
                        backgroundColor: `${this.state.cell_color[index][cindex]}`,
                        width: sz_h,
                        height: sz_h,
                        margin: 1,
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
                  );
                })}
              </Stack>
            );
          })}
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 0,
            alignContent: "center",
            left: 0,
            right: 0,
          }}
        >
          {OnScreenKeyboard.map((name, index) => {
            var sz_w = Math.floor(this.state.window_width / name.length);
            if (sz_w > 100) {
              sz_w = 100;
            }
            var sz_h = Math.floor(this.state.window_height / 9);
            if (sz_h > 100) {
              sz_h = 100;
            }
            console.log(sz_w);
            console.log(sz_h); //
            return (
              <Stack
                key={index}
                direction="row"
                justifyContent="center"
                alignItems="flex-end"
                spacing={1}
              >
                {name.map((index_value, cindex) => {
                  return (
                    <div key={`${index}${cindex}`} style={{ margin: "1px" }}>
                      {index_value !== "Backspace" && index_value != "Enter" ? (
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
                            maxWidth: sz_w,
                            minWidth: sz_w,
                            maxHeight: sz_h,
                            minHeight: sz_h,
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
                          style={{
                            background: "grey",
                            maxWidth: sz_w,
                            minWidth: sz_w,
                            maxHeight: sz_h,
                            minHeight: sz_h,
                          }}
                          onClick={() => {
                            this.handleKeyboard(index_value);
                          }}
                        >
                          {index_value === "Enter" ? (
                            <CheckIcon
                              fontSize="medium"
                              style={{ color: "white" }}
                            />
                          ) : (
                            <BackspaceIcon
                              fontSize="medium"
                              style={{ color: "white" }}
                            />
                          )}
                        </Button>
                      )}
                    </div>
                  );
                })}
              </Stack>
            );
          })}
        </div>
      </div>
    );
  }
}

export default App;
