import consts from './../consts';

class Global {

  app__updateExportMazeData = null;
  app_setModeFunc = null;
  app_showErrorMessageFunc = null;

  width = 0;
  height = 0;
  checkMouseInput = true;
  checkKeyInput = true;
  useRuler = true;

  mode = consts.CREATE;
  createTool = consts.SHAPE;
  solveTool = consts.TEST;
  markerColour = 0;
  solutionColour = -1;
  penColour = 0;

  tileSize = 14;
  rulerIncrement = 4;

  dottedLine(p, x1, y1, x2, y2, lineLength, lineToSpaceRatio = 1) {
    // Get important variables.
    let length = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
    let xStep = lineLength * (x2 - x1) / length;
    let yStep = lineLength * (y2 - y1) / length;

    for (let i = 0; i < length / lineLength; i += 1 + 1 / lineToSpaceRatio) {  // Skip every other step.
      let startX = x1 + i * xStep;
      let startY = y1 + i * yStep;
      p.line(Math.round(startX), Math.round(startY), Math.round(startX + xStep), Math.round(startY + yStep));
    }
  }
}

let $ = new Global();
export default $;
