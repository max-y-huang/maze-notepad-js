import React from 'react';
import { debounce } from 'debounce';
import P5Wrapper from 'react-p5-wrapper';

import stylesheet from './css/App.module.css';

import sketch from './js/p5/sketch.js';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      canvasWidth: window.innerWidth,
      canvasHeight: window.innerHeight,
      mouseOverCanvas: false
    }
    this.canvasWrapperRef = React.createRef();
  }

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
    let { canvasWidth, canvasHeight, mouseOverCanvas } = this.state;
    return (
      <div className={stylesheet.wrapper}>
        <div className={stylesheet.wrapper__toolbar}>Bar 1</div>
        <div className={stylesheet.wrapper__menubar}>Bar 2</div>
        <div className={stylesheet.wrapper__canvas} ref={this.canvasWrapperRef} onContextMenu={e => e.preventDefault()}> {/* Disable right-click in sketch */}
          <P5Wrapper sketch={sketch} width={canvasWidth} height={canvasHeight} mouseOverCanvas={mouseOverCanvas} />
        </div>
      </div>
    );
  }
}

export default App;
