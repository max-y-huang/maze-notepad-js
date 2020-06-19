import React from 'react';
import { debounce } from 'debounce';
import P5Wrapper from 'react-p5-wrapper';

import stylesheet from './css/App.module.css';

import sketch from './p5/sketch.js';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      canvasWidth: window.innerWidth,
      canvasHeight: window.innerHeight
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
  }

  render() {
    let { canvasWidth, canvasHeight } = this.state;
    return (
      <div className={stylesheet.wrapper}>
        <div className={stylesheet.wrapper__toolbar}>Bar 1</div>
        <div className={stylesheet.wrapper__menubar}>Bar 2</div>
        <div className={stylesheet.wrapper__canvas} ref={this.canvasWrapperRef}>
          <P5Wrapper sketch={sketch} width={canvasWidth} height={canvasHeight} />
        </div>
      </div>
    );
  }
}

export default App;
