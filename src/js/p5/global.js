import consts from './../consts';

class Global {

  setModeFunc = null;
  showErrorMessageFunc = null;

  width = 0;
  height = 0;
  mouseOverSketch = false;

  mouseOverSketch = false;
  mode = consts.CREATE;
  createTool = consts.SHAPE;
  markerColour = 0;

  tileSize = 14;
}

let $ = new Global();
export default $;
