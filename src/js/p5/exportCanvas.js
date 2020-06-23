const exportCanvas = p => {

  let requestExportMazeFlag = 0;

  p.setup = () => {
    p.createCanvas(100, 100);
  }

  p.myCustomRedrawAccordingToNewPropsHandler = (props) => {
    if (props.requestExportMazeFlag !== requestExportMazeFlag) {
      exportImage(props.exportImgs.mazeImg, props.exportImgs.markersImg);
      requestExportMazeFlag = props.requestExportMazeFlag;
    }
  };

  const exportImage = (mazeImg, markersImg) => {
    p.resizeCanvas(mazeImg.width, mazeImg.height);
    p.image(mazeImg, 0, 0);
    p.image(markersImg, 0, 0);
    p.saveCanvas('maze', 'png');
  }
}

export default exportCanvas;
