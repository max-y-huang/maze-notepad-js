import React from 'react';
import { Modal } from 'semantic-ui-react';
import P5Wrapper from 'react-p5-wrapper';

import stylesheet from './css/App.module.css';

import consts from './js/consts';
import $p5 from './js/p5/global';
import ToolBar from './ToolBar';
import ColourPicker from './ColourPicker';
import sketch from './js/p5/sketch';
import exportCanvas from './js/p5/exportCanvas';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      canvasMode: consts.CREATE,
      canvasCreateTool: consts.SHAPE,
      canvasMarkerColour: 0,
      errorModalOpen: false,
      errorModalMessage: '',
      exportMazeRequestFlag: 0,
      exportMazeImg: null
    }
    this.canvasWrapperRef = React.createRef();
  }

  setMazeImg        = (img) => this.setState({ exportMazeImg: img });
  requestExportMaze = ()    => this.setState((state) => ({ exportMazeRequestFlag: state.exportMazeRequestFlag + 1 }));

  setMouseOverCanvas = (val) => $p5.mouseOverSketch = val;

  setCanvasMode         = (mode)   => this.setState({ canvasMode: mode });
  setCanvasCreateTool   = (tool)   => this.setState({ canvasCreateTool: tool });
  setCanvasMarkerColour = (colour) => this.setState({ canvasMarkerColour: colour });

  showErrorModal = (msg) => this.setState({ errorModalOpen: true, errorModalMessage: msg });
  hideErrorModal = ()    => this.setState({ errorModalOpen: false });

  onResize = () => {
    let { offsetWidth, offsetHeight } = this.canvasWrapperRef.current;
    $p5.width = offsetWidth;
    $p5.height = offsetHeight;
  }

  componentDidUpdate(prevProps, prevState) {
    // Resize on mode change or tool change.
    if (prevState.canvasMode !== this.state.canvasMode || prevState.canvasCreateTool !== this.state.canvasCreateTool) {
      this.onResize();
    }
  }

  componentDidMount() {
    $p5.app_setMazeImgFunc = this.setMazeImg;
    $p5.app_setModeFunc = this.setCanvasMode;
    $p5.app_showErrorMessageFunc = this.showErrorModal;

    this.onResize();
    
    window.addEventListener('resize', this.onResize);
    this.canvasWrapperRef.current.addEventListener('mouseenter', () => this.setMouseOverCanvas(true));
    this.canvasWrapperRef.current.addEventListener('mouseleave', () => this.setMouseOverCanvas(false));
  }

  renderSelectionBar = () => {
    let { canvasMode, canvasCreateTool, canvasMarkerColour } = this.state;
    let showColourPicker = canvasMode === consts.CREATE && canvasCreateTool === consts.MARKERS;
    if (!showColourPicker) {
      return null;
    }
    return (
      <div className={stylesheet.wrapper__selectionBar}>
        <ColourPicker
          show={showColourPicker}
          canvasMarkerColour={canvasMarkerColour}
          setCanvasMarkerColourFunc={this.setCanvasMarkerColour}
        />
      </div>
    );
  }

  render() {
    let { canvasMode, canvasCreateTool, canvasMarkerColour, errorModalOpen, errorModalMessage } = this.state;
    return (
      <>
        <div className={stylesheet.wrapper}>
          <div className={stylesheet.wrapper__toolBar}>
            <ToolBar
              canvasMode={canvasMode}
              canvasCreateTool={canvasCreateTool}
              setCanvasModeFunc={this.setCanvasMode}
              setCanvasCreateToolFunc={this.setCanvasCreateTool}
              requestExportMazeFunc={this.requestExportMaze}
            />
          </div>
          {this.renderSelectionBar()}
          <div className={stylesheet.wrapper__canvas} ref={this.canvasWrapperRef} onContextMenu={e => e.preventDefault()}> {/* Disable right-click in sketch */}
            <P5Wrapper
              sketch={sketch}
              mode={canvasMode}
              createTool={canvasCreateTool}
              markerColour={canvasMarkerColour}
            />
          </div>
        </div>
        <Modal
          open={errorModalOpen}
          header='Error!'
          content={{ content: errorModalMessage, style: { fontSize: '16px' } }}
          actions={[{ key: 'confirm', content: 'Got it', color: 'blue', onClick: this.hideErrorModal }]}
        />
        {/* Used to export maze image. Should not be displayed. */}
        <div style={{display: 'none'}}>
          <P5Wrapper className={stylesheet.exportCanvas} sketch={exportCanvas} requestFlag={this.state.exportMazeRequestFlag} mazeImg={this.state.exportMazeImg} />
        </div>
      </>
    );
  }
}

export default App;
