function Console(text, value) {
  text && value && console.log(text, value);
  text && console.log(text);
  value && console.log(value);
}

export default Console;
