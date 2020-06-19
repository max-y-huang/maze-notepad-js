class KeyLogger {

  keyDown = {};

  isKeyPressed = (key) => {
    return this.keyDown[key.toLowerCase()];
  }

  onKeyDown = (key) => {
    this.keyDown[key.toLowerCase()] = true;
  }

  onKeyUp = (key) => {
    this.keyDown[key.toLowerCase()] = false;
  }
}

export { KeyLogger };
