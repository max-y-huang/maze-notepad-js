import React from 'react';
import { Modal } from 'semantic-ui-react';
import { debounce } from 'debounce';
import P5Wrapper from 'react-p5-wrapper';

import stylesheet from './css/App.module.css';

import Toolbar from './Toolbar';
import sketch from './js/p5/sketch';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      canvasWidth: window.innerWidth,
      canvasHeight: window.innerHeight,
      mouseOverCanvas: false,
      canvasMode: 0,
      canvasCreateTool: 0,
      errorModalOpen: false,
      errorModalMessage: ''
    }
    this.canvasWrapperRef = React.createRef();
  }

  setMouseOverCanvas = (val) => this.setState({ mouseOverCanvas: val });

  setCanvasMode = (mode) => this.setState({ canvasMode: mode });
  setCanvasCreateTool = (mode) => this.setState({ canvasCreateTool: mode });

  showErrorModal = (msg) => this.setState({ errorModalOpen: true, errorModalMessage: msg });
  hideErrorModal = () => this.setState({ errorModalOpen: false });

  onResize = () => {
    let { offsetWidth, offsetHeight } = this.canvasWrapperRef.current;
    this.setState({
      canvasWidth: offsetWidth,
      canvasHeight: offsetHeight
    });
  }

  componentDidMount() {
    this.onResize();
    window.addEventListener('resize', debounce(this.onResize, 200));
    this.canvasWrapperRef.current.addEventListener('mouseenter', () => this.setState({ mouseOverCanvas: true }));
    this.canvasWrapperRef.current.addEventListener('mouseleave', () => this.setState({ mouseOverCanvas: false }));
  }

  render() {
    let { canvasWidth, canvasHeight, mouseOverCanvas, canvasMode, canvasCreateTool, errorModalOpen, errorModalMessage } = this.state;
    return (
      <>
        <div className={stylesheet.wrapper}>
          <div className={stylesheet.wrapper__toolbar}>
            <Toolbar
              canvasMode={canvasMode}
              canvasCreateTool={canvasCreateTool}
              setCanvasModeFunc={this.setCanvasMode}
              setCanvasCreateToolFunc={this.setCanvasCreateTool}
            />
          </div>
          <div className={stylesheet.wrapper__canvas} ref={this.canvasWrapperRef} onContextMenu={e => e.preventDefault()}> {/* Disable right-click in sketch */}
            <P5Wrapper
              sketch={sketch}
              width={canvasWidth}
              height={canvasHeight}
              mouseOverCanvas={mouseOverCanvas}
              mode={canvasMode}
              createTool={canvasCreateTool}
              setModeFunc={this.setCanvasMode}
              showErrorMessageFunc={this.showErrorModal}
            />
          </div>
        </div>
        <Modal
          open={errorModalOpen}
          header='Error!'
          content={{ content: errorModalMessage, style: { fontSize: '16px' } }}
          actions={[{ key: 'confirm', content: 'Got it', positive: true, onClick: this.hideErrorModal }]}
        />
      </>
    );
  }
}

export default App;
