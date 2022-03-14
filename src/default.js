const default_value_row = {
  autoFocus: false,
  inputProps: [
    {
      disabled: true,
      style: {
        backgroundColor: "#3a3a3c",
        borderColor: "white",
        color: "white",
      },
    },
    {
      disabled: true,
      style: {
        backgroundColor: "#3a3a3c",
        borderColor: "white",
        color: "white",
      },
    },
    {
      disabled: true,
      style: {
        backgroundColor: "#3a3a3c",
        borderColor: "white",
        color: "white",
      },
    },
    {
      disabled: true,
      style: {
        backgroundColor: "#3a3a3c",
        borderColor: "white",
        color: "white",
      },
    },
    {
      disabled: true,
      style: {
        backgroundColor: "#3a3a3c",
        borderColor: "white",
        color: "white",
      },
    },
  ],
};
var default_value = [];
for (var i = 0; i < 6; ++i) {
  default_value.push(JSON.parse(JSON.stringify(default_value_row)));
}
for (i = 0; i < 5; ++i) {
  default_value[0].inputProps[i].disabled = false;
}

default_value[0].autoFocus = true;
console.log(default_value_row.inputProps[0].disabled);
console.log(default_value[0].inputProps[0].disabled);
console.log(default_value[1].inputProps[0].disabled);
export default default_value;
