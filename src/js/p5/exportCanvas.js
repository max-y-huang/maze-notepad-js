import $ from './global';

const exportCanvas = p => {

  let requestExportMazeFlag = 0;

  p.setup = () => {
    p.createCanvas(100, 100);
  }

  p.myCustomRedrawAccordingToNewPropsHandler = (props) => {
    if (props.requestExportMazeFlag !== requestExportMazeFlag) {
      exportImage(props.data);
      requestExportMazeFlag = props.requestExportMazeFlag;
    }
  };

  const exportImage = (data) => {
    // Variables for cropping offset and dimensions.
    let x = data.cropX1 * $.tileSize;  // No offset from maze stroke weight.
    let y = data.cropY1 * $.tileSize;
    let width = (data.cropX2 - data.cropX1 + 1) * $.tileSize + 2;  // + 2 comes from maze stroke weight.
    let height = (data.cropY2 - data.cropY1 + 1) * $.tileSize + 2;

    p.resizeCanvas(width, height);
    p.image(data.mazeImg, -x, -y);
    p.image(data.markersImg, -x, -y);
    p.saveCanvas('maze', 'png');
  }
}

export default exportCanvas;
