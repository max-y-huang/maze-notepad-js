const exportCanvas = p => {

  let requestFlag = 0;

  p.setup = () => {
    p.createCanvas(100, 100);
  }

  p.myCustomRedrawAccordingToNewPropsHandler = (props) => {
    if (props.requestFlag !== requestFlag) {
      exportImage(props.mazeImg);
      requestFlag = props.requestFlag;
    }
  };

  const exportImage = (img) => {
    p.resizeCanvas(img.width, img.height);
    p.image(img, 0, 0);
    p.saveCanvas('test.png');
  }
}

export default exportCanvas;
