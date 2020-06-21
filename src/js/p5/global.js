import consts from './../consts';

class Global {

  mouseOverSketch = false;
  mode = consts.CREATE;
  createTool = consts.SHAPE;
  markerColour = 0;

  tileSize = 14;
}

let $ = new Global();
export default $;
