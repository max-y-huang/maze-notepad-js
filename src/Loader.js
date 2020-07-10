import React from 'react';

import stylesheet from './css/Loader.module.css';

class Loader extends React.Component {

  render() {

    if (!this.props.active) {
      return null;
    }

    return (
      <div className={stylesheet.wrapper}>
        <div className={stylesheet.wrapper__spinner} />
      </div>
    );
  }
}

export default Loader;
