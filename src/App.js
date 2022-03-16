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
import BackspaceIcon from "@mui/icons-material/Backspace";
//import ArrowBackIcon from "@material-ui/icons/ArrowBack";
//import { Button } from "bootstrap";
import Button from "@material-ui/core/Button";

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
      OnScreenKeyboard: [
        ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
        ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
        ["Enter", "Z", "X", "C", "V", "B", "N", "M", "Backspace"],
      ],
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
          let temp_keyboardKeyColor = this.state.KeyboardKeyColor;
          for (let i = 0; i < 5; ++i) {
            if (word[i] === answers_strings[this.state.random_key][i]) {
              temp_cell_color[curr_row][i] = "#6aaa64"; //green color
              var temp_keyCode = word[i].toUpperCase().charCodeAt(0) - 65;
              // console.log(word[i].toUpperCase());
              // console.log(word[i].toUpperCase().charCodeAt(0));
              temp_keyboardKeyColor[temp_keyCode] = "#6aaa64";
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
              var temp_keyCode = character.toUpperCase().charCodeAt(0) - 65;
              temp_keyboardKeyColor[temp_keyCode] = "#c9b458";
              temp_cell_color[curr_row][extra_1[i]] = "#c9b458"; //yellow color
              extra_2.delete(character);
            } else {
              var temp_keyCode = character.toUpperCase().charCodeAt(0) - 65;
              temp_keyboardKeyColor[temp_keyCode] = "black";
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
            game_over: word === answers_strings[this.state.random_key],
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
    var temp_key = value;
    var temp_keyCode;
    if (value === "Backspace") {
      temp_keyCode = 8;
    } else if (value === "Enter") {
      temp_keyCode = 13;
    } else {
      temp_keyCode = value.charCodeAt(0);
    }
    var spaceEvnt = new KeyboardEvent("keydown", {
      key: temp_key,
      keyCode: temp_keyCode,
      which: temp_keyCode,
    });
    document.dispatchEvent(spaceEvnt);
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
        <div className="onscreenkeyboard">
          {this.state.OnScreenKeyboard.map((name, index) => {
            return (
              <Row key={index} xs="auto" className="justify-content-center">
                {name.map((index_value, cindex) => {
                  return (
                    <Col key={`${index}${cindex}`}>
                      <div
                        style={{
                          backgroundColor:
                            index_value !== "Enter" &&
                            index_value !== "Backspace"
                              ? this.state.KeyboardKeyColor[
                                  index_value.charCodeAt(0) - 65
                                ]
                              : "grey",
                        }}
                      >
                        {index_value !== "Backspace" ? (
                          <Button
                            style={{
                              color: "white",
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
                            startIcon={
                              <BackspaceIcon style={{ color: "white" }} />
                            }
                            onClick={() => {
                              this.handleKeyboard(index_value);
                            }}
                          ></Button>
                        )}
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
