class KeyLogger {

  keyDown = {};
  keyCodeDown = {};

  clear() {
    this.keyDown = {};
    this.keyCodeDown = {};
  }

  isKeyPressed(key) {
    return this.keyDown[key.toLowerCase()] ? true : false;  // Force true or false to be returned (no undefined).
  }
  isKeyCodePressed(keyCode) {
    return this.keyCodeDown[keyCode.toString()] ? true : false;  // Force true or false to be returned (no undefined).
  }

  onKeyDown(key) {
    this.keyDown[key.toLowerCase()] = true;
  }
  onKeyCodeDown(keyCode) {
    this.keyCodeDown[keyCode.toString()] = true;
  }

  onKeyUp(key) {
    this.keyDown[key.toLowerCase()] = false;
  }
  onKeyCodeUp(keyCode) {
    this.keyCodeDown[keyCode.toString()] = false;
  }
}

let keyLogger = new KeyLogger();
export default keyLogger;
