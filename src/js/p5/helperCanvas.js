import axios from 'axios';

import urls from './../urls';

import consts from '../consts';
import $ from './global';

const exportCanvas = p => {

  let requestExportMazeFlag = 0;
  let requestUploadMazeFlag = 0;

  p.setup = () => {
    p.createCanvas(100, 100);
  }

  p.myCustomRedrawAccordingToNewPropsHandler = (props) => {
    if (props.requestExportMazeFlag !== requestExportMazeFlag) {
      onExport(props.data);
      requestExportMazeFlag = props.requestExportMazeFlag;
    }
    if (props.requestUploadMazeFlag !== requestUploadMazeFlag) {
      onUpload(props.data);
      requestUploadMazeFlag = props.requestUploadMazeFlag;
    }
  };

  const onExport = (data) => {
    exportImage(data, 'maze', false);
    for (let i = 0; i < data.solutions.length; i++) {
      exportImage(data, `maze - solution ${consts.COLOUR_NAMES[i]}`, true, i);
    }
  }

  const exportImage = (data, name, drawSolution, solutionIndex = 0) => {
    // Check run condition.
    if (drawSolution && data.solutions[solutionIndex] === null) {
      return;
    }
    // Variables for cropping offset and dimensions.
    let x = data.cropX1 * $.tileSize;  // No offset from maze stroke weight.
    let y = data.cropY1 * $.tileSize;
    let width = (data.cropX2 - data.cropX1 + 1) * $.tileSize + 2;  // + 2 comes from maze stroke weight.
    let height = (data.cropY2 - data.cropY1 + 1) * $.tileSize + 2;

    p.resizeCanvas(width, height);
    p.image(data.mazeImg, -x, -y);
    p.image(data.markersImg, -x, -y);
    if (drawSolution) {
      p.image(data.solutionsImgs[solutionIndex], -x, -y);
    }
    p.saveCanvas(name, 'png');
  }

  const onUpload = (data) => {
    // Variables for cropping offset and dimensions.
    let x = data.cropX1 * $.tileSize;  // No offset from maze stroke weight.
    let y = data.cropY1 * $.tileSize;
    let width = (data.cropX2 - data.cropX1 + 1) * $.tileSize + 2;  // + 2 comes from maze stroke weight.
    let height = (data.cropY2 - data.cropY1 + 1) * $.tileSize + 2;

    p.resizeCanvas(width, height);
    p.image(data.mazeImg, -x, -y);
    p.image(data.markersImg, -x, -y);

    p.canvas.toBlob((blob) => {
      // Create form data.
      let formData = new FormData();
      formData.append('maze-file', data.mazeFile);
      formData.append('image-file', blob);
      formData.append('name', 'Test');
      formData.append('tags', 'A,B,C');
      // Upload maze request.
      axios({
        method: 'post',
        url: `${urls.mazeNotepadApi}/maze/upload`,
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' }
      }).then((req) => {
        // TODO: Confirm success.
      });
    }, 'image/png');
  }
}

export default exportCanvas;
