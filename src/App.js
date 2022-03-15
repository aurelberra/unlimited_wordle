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

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      answers_strings: text_answers.split("\n"),
      allowed_strings: text_allowed.split("\n"),
      random_key: Math.floor(Math.random() * mx),
      combined_strings_set: new Set([
        ...text_allowed.split("\n"),
        ...text_answers.split("\n"),
      ]),
      // matrix: [
      //   [false, true, true, true, true],
      //   [true, true, true, true, true],
      //   [true, true, true, true, true],
      //   [true, true, true, true, true],
      //   [true, true, true, true, true],
      //   [true, true, true, true, true],
      // ],
      prevrow: 0,
      prevcol: -1,
      value: Array(6)
        .fill(0)
        .map((row) => new Array(5).fill("")),
      //props_matrix: default_value,
    };
  }

  // async handleKeyDown(e, row, col) {
  //   var temp_value = await this.state.value;
  //   temp_value[row][col] = await e.target.value;
  //   await this.setState({
  //     value: temp_value,
  //   });
  //   console.log(this.state.value);
  //   if (e.keyCode === 8) {
  //     if (e.target.value.length === 0) {
  //       var prevrow = await row;
  //       var prevcol = await col;
  //       if (prevcol > 0) {
  //         prevcol--;
  //       } else {
  //         if (prevrow > 0) {
  //           prevrow--;
  //           prevcol = 4;
  //         }
  //       }
  //       if (prevrow >= 0 && prevcol >= 0) {
  //         var temp_matrix = await this.state.matrix;
  //         if (row !== 0 || col !== 0) {
  //           temp_matrix[row][col] = await true;
  //         }
  //         const prevfield = await document.querySelector(
  //           `input[name=field-${prevrow}${prevcol}]`
  //         );
  //         console.log("prevrow" + prevrow);
  //         console.log("prevcol" + prevcol);
  //         if (row !== 0 || col !== 0) {
  //           await this.setState({
  //             matrix: temp_matrix,
  //           });
  //         }

  //         if (prevfield !== null) {
  //           prevfield.value = "";
  //           prevfield.focus();
  //         }
  //       }
  //     }
  //   }
  // }

  // async handlechange(e, row, col) {
  //   console.log(row);
  //   console.log(col);
  //   console.log("here");
  //   var temp_value = await this.state.value;
  //   temp_value[row][col] = await e.target.value;
  //   await this.setState({
  //     value: temp_value,
  //   });
  //   console.log(this.state.value);
  //   console.log(typeof e.target.value);
  //   var curr = e.target.value;
  //   if (curr.length === 1) {
  //     var temp_matrix = await this.state.matrix;
  //     var nextrow = row;
  //     var nextcol = col;
  //     if (col <= 3) {
  //       nextcol = col + 1;
  //     } else {
  //       if (row <= 4) {
  //         nextrow = row + 1;
  //         nextcol = 0;
  //       }
  //     }
  //     if (nextrow <= 5 && nextcol <= 4) {
  //       temp_matrix[nextrow][nextcol] = false;
  //       console.log(nextrow);
  //       console.log(nextcol);
  //       const nextfield = await document.querySelector(
  //         `input[name=field-${nextrow}${nextcol}]`
  //       );

  //       await this.setState({
  //         matrix: temp_matrix,
  //       });

  //       if (nextfield !== null) {
  //         console.log(nextfield);
  //         nextfield.focus();
  //       }
  //     }
  //   }
  // }

  handleOnKeyPress = (e) => {
    console.log(e.key);
    if (e.keyCode >= 65 && e.keyCode <= 90) {
      let temp_currow = this.state.prevrow;
      let temp_currcol = this.state.prevcol;
      if (temp_currcol <= 3) {
        temp_currcol++;
      } else {
        if (temp_currow <= 4) {
          temp_currcol = 0;
          temp_currow++;
        } else {
          return;
        }
      }
      let temp_value = this.state.value;
      temp_value[temp_currow][temp_currcol] = e.key;
      this.setState({
        prevrow: temp_currow,
        prevcol: temp_currcol,
        value: temp_value,
      });
    } else if (e.keyCode === 8) {
      let temp_prevrow = this.state.prevrow;
      let temp_prevcol = this.state.prevcol;
      console.log(e.keyCode);
      console.log(temp_prevcol);
      console.log(temp_prevrow);
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
    }
  };
  componentDidMount() {
    document.addEventListener("keydown", this.handleOnKeyPress, false);
  }

  render() {
    // const input_props_2 = {
    //   maxLength: 1,
    // };
    // const input_props = {
    //   amount: 5,

    //   inputRegExp: /^[A-Z]$/,
    // };

    return (
      <div className="App">
        <p>{this.state.answers_strings[this.state.random_key]}</p>

        <div className="wordle_grid">
          {this.state.value.map((name, index) => {
            return (
              <Row>
                {name.map((index_value, cindex) => {
                  return (
                    <Col>
                      <p>{index_value.toUpperCase()}</p>
                    </Col>
                  );
                })}
              </Row>
            );
          })}
        </div>

        {/* <div className="wordle_table">
          {this.state.props_matrix.map((name, index) => {
            return (
              <div key={index}>
                <input
                  name={`field-${index}${0}`}
                  {...input_props_2}
                  //ref={this[`inputRef${index + 1}1`]}
                  disabled={this.state.matrix[index][0]}
                  onKeyDown={(e) => {
                    this.handleKeyDown(e, index, 0);
                  }}
                  onChange={(e) => {
                    this.handlechange(e, index, 0);
                  }}
                ></input>
                <input
                  name={`field-${index}${1}`}
                  {...input_props_2}
                  //ref={this[`inputRef${index + 1}2`]}
                  onKeyDown={(e) => {
                    this.handleKeyDown(e, index, 1);
                  }}
                  disabled={this.state.matrix[index][1]}
                  onChange={(e) => {
                    this.handlechange(e, index, 1);
                  }}
                ></input>
                <input
                  name={`field-${index}${2}`}
                  {...input_props_2}
                  //ref={this[`inputRef${index + 1}3`]}
                  onKeyDown={(e) => {
                    this.handleKeyDown(e, index, 2);
                  }}
                  disabled={this.state.matrix[index][2]}
                  onChange={(e) => {
                    this.handlechange(e, index, 2);
                  }}
                ></input>
                <input
                  name={`field-${index}${3}`}
                  {...input_props_2}
                  //ref={this[`inputRef${index + 1}4`]}
                  onKeyDown={(e) => {
                    this.handleKeyDown(e, index, 3);
                  }}
                  disabled={this.state.matrix[index][3]}
                  onChange={(e) => {
                    this.handlechange(e, index, 3);
                  }}
                ></input>
                <input
                  name={`field-${index}${4}`}
                  {...input_props_2}
                  //ref={this[`inputRef${index}5`]}
                  onKeyDown={(e) => {
                    this.handleKeyDown(e, index, 4);
                  }}
                  disabled={this.state.matrix[index][4]}
                  onChange={(e) => {
                    this.handlechange(e, index, 4);
                  }}
                ></input>
              </div>
            );
          })}
        </div> */}
      </div>
    );
  }
}

export default App;
