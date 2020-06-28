import React from 'react';

import stylesheet from './css/Modal.module.css';

class Modal extends React.Component {

  render() {

    if (!this.props.open) {
      return null;
    }

    return (
      <div className={stylesheet.wrapper}>
        <div className={stylesheet.wrapper__content}>
          <div className={stylesheet.wrapper__content__header}>{this.props.header}</div>
          <div className={stylesheet.wrapper__content__body}>{this.props.body}</div>
          <div className={stylesheet.wrapper__content__footer}>{this.props.footer}</div>
        </div>
      </div>
    );
  }
}

export default Modal;
