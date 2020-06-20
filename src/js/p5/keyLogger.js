class KeyLogger {

  keyDown = {};
  keyCodeDown = {};

  constructor (p) {
    this.p = p;
  }

  isKeyPressed = (key) => {
    return this.keyDown[key.toLowerCase()] ? true : false;
  }

  isKeyCodePressed = (keyCode) => {
    return this.keyCodeDown[keyCode.toString()] ? true : false;
  }

  onKeyDown = (key) => {
    this.keyDown[key.toLowerCase()] = true;
  }

  onKeyCodeDown = (keyCode) => {
    this.keyCodeDown[keyCode.toString()] = true;
  }

  onKeyUp = (key) => {
    this.keyDown[key.toLowerCase()] = false;
  }

  onKeyCodeUp = (keyCode) => {
    this.keyCodeDown[keyCode.toString()] = false;
  }
}

export { KeyLogger };
