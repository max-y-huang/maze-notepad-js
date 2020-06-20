import consts from './../consts';

class Global {

  mouseOverSketch = false;
  mode = consts.CREATE;
  tileSize = 14;
}

let $ = new Global();
export default $;
