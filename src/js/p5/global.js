import consts from './../consts';

class Global {

  app__setExportMazeData = null;
  app_setModeFunc = null;
  app_showErrorMessageFunc = null;

  width = 0;
  height = 0;
  mouseOverSketch = false;
  useRuler = true;

  mode = consts.CREATE;
  createTool = consts.SHAPE;
  solveTool = consts.TEST;
  markerColour = 0;
  solutionColour = -1;
  penColour = 0;

  tileSize = 14;
  rulerIncrement = 4;
}

let $ = new Global();
export default $;
