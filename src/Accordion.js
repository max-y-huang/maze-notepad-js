import React from 'react';
import classnames from 'classnames';

import stylesheet from './css/Accordion.module.css';

class Accordion extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      open: props.open 
    };
  }

  onClick = () => {
    this.setState((state) => ({
      open: !state.open
    }));
  }

  render() {
    return (
      <div className={classnames(stylesheet.wrapper, this.state.open ? stylesheet.show : stylesheet.hide)}>
        <div className={stylesheet.wrapper__summary} onClick={this.onClick}>
          {this.props.summary}
        </div>
        <div className={stylesheet.wrapper__details}>
          {this.props.details}
        </div>
      </div>
    );
  }
}

export default Accordion;
