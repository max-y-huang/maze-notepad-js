import React from 'react';
import { Modal } from 'semantic-ui-react';
import P5Wrapper from 'react-p5-wrapper';

import stylesheet from './css/App.module.css';

import consts from './js/consts';
import $p5 from './js/p5/global';
import Toolbar from './Toolbar';
import ColourPicker from './ColourPicker';
import sketch from './js/p5/sketch';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      canvasMode: consts.CREATE,
      canvasCreateTool: consts.SHAPE,
      canvasMarkerColour: 0,
      errorModalOpen: false,
      errorModalMessage: ''
    }
    this.canvasWrapperRef = React.createRef();
  }

  setMouseOverCanvas = (val) => $p5.mouseOverSketch = val;

  setCanvasMode = (mode) => this.setState({ canvasMode: mode });
  setCanvasCreateTool = (tool) => this.setState({ canvasCreateTool: tool });
  setCanvasMarkerColour = (colour) => this.setState({ canvasMarkerColour: colour });

  showErrorModal = (msg) => this.setState({ errorModalOpen: true, errorModalMessage: msg });
  hideErrorModal = () => this.setState({ errorModalOpen: false });

  onResize = () => {
    let { offsetWidth, offsetHeight } = this.canvasWrapperRef.current;
    $p5.width = offsetWidth;
    $p5.height = offsetHeight;
  }

  componentDidMount() {
    $p5.setModeFunc = this.setCanvasMode;
    $p5.showErrorMessageFunc = this.showErrorModal;
    this.onResize();
    window.addEventListener('resize', this.onResize);
    this.canvasWrapperRef.current.addEventListener('mouseenter', () => this.setMouseOverCanvas(true));
    this.canvasWrapperRef.current.addEventListener('mouseleave', () => this.setMouseOverCanvas(false));
  }

  render() {
    let { canvasMode, canvasCreateTool, canvasMarkerColour, errorModalOpen, errorModalMessage } = this.state;
    let showColourPicker = canvasMode === consts.CREATE && canvasCreateTool === consts.MARKERS;
    return (
      <>
        <div className={stylesheet.wrapper}>
          <div className={stylesheet.wrapper__toolbar}>
            <Toolbar
              canvasMode={canvasMode}
              canvasCreateTool={canvasCreateTool}
              canvasMarkerColour={canvasMarkerColour}
              setCanvasModeFunc={this.setCanvasMode}
              setCanvasCreateToolFunc={this.setCanvasCreateTool}
            />
          </div>
          <div className={stylesheet.wrapper__colourPicker} style={{height: showColourPicker ? 'calc(4em + 16px + 16px + 4px)' : 0 }}>  {/* Set max-height to the expected height */}
            <ColourPicker
              show={showColourPicker}
              canvasMarkerColour={canvasMarkerColour}
              setCanvasMarkerColourFunc={this.setCanvasMarkerColour}
            />
          </div>
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
      </>
    );
  }
}

export default App;
