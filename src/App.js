import React from 'react';
import { Modal } from 'semantic-ui-react';
import { debounce } from 'debounce';
import P5Wrapper from 'react-p5-wrapper';

import stylesheet from './css/App.module.css';

import sketch from './js/p5/sketch';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      canvasWidth: window.innerWidth,
      canvasHeight: window.innerHeight,
      mouseOverCanvas: false,
      errorModalOpen: false,
      errorModalMessage: ''
    }
    this.canvasWrapperRef = React.createRef();
  }

  setMouseOverCanvas = (val) => this.setState({ mouseOverCanvas: val });

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
    let { canvasWidth, canvasHeight, mouseOverCanvas, errorModalOpen, errorModalMessage } = this.state;
    return (
      <>
        <div className={stylesheet.wrapper}>
          <div className={stylesheet.wrapper__toolbar}>Bar 1</div>
          <div className={stylesheet.wrapper__menubar}>Bar 2</div>
          <div className={stylesheet.wrapper__canvas} ref={this.canvasWrapperRef} onContextMenu={e => e.preventDefault()}> {/* Disable right-click in sketch */}
            <P5Wrapper
              sketch={sketch}
              width={canvasWidth}
              height={canvasHeight}
              mouseOverCanvas={mouseOverCanvas}
              showErrorMessageFunc={this.showErrorModal}
            />
          </div>
        </div>
        <Modal
          open={errorModalOpen}
          header='Error!'
          content={{ content: errorModalMessage, style: { fontSize: '16px' } }}
          actions={[{ content: 'Got it', positive: true, onClick: this.hideErrorModal }]}
        />
      </>
    );
  }
}

export default App;
