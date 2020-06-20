class KeyLogger {

  keyDown = {};
  keyCodeDown = {};

  isKeyPressed = (key) => this.keyDown[key.toLowerCase()] ? true : false;
  isKeyCodePressed = (keyCode) => this.keyCodeDown[keyCode.toString()] ? true : false;

  onKeyDown = (key) => this.keyDown[key.toLowerCase()] = true;
  onKeyCodeDown = (keyCode) => this.keyCodeDown[keyCode.toString()] = true;

  onKeyUp = (key) => this.keyDown[key.toLowerCase()] = false;
  onKeyCodeUp = (keyCode) => this.keyCodeDown[keyCode.toString()] = false;
}

let keyLogger = new KeyLogger();
export default keyLogger;
