const exportCanvas = p => {

  let requestFlag = 0;

  p.setup = () => {
    p.createCanvas(100, 100);
  }

  p.myCustomRedrawAccordingToNewPropsHandler = (props) => {
    if (props.requestFlag !== requestFlag) {
      exportImage(props.exportImgs.mazeImg, props.exportImgs.markersImg);
      requestFlag = props.requestFlag;
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
