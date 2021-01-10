import React from 'react';
import classnames from 'classnames';

import stylesheet from './css/MarkerPicker.module.css';

import consts from './js/consts';

class MarkerPicker extends React.Component {

  renderColourButton = (colourCode) => {
    return (
      <Item
        key={colourCode}
        colourCode={colourCode}
        active={this.props.activeValue === colourCode}
        onClick={() => this.props.onClickFunc(colourCode)}
        show={this.props.visibleList[colourCode]}
      />
    );
  }

  render() {
    if (!this.props.show) {
      return null;
    }

    let nullItem = this.props.allowSelectNone ? (
      <button className={stylesheet.wrapper__nullItem} onClick={() => this.props.onClickFunc(-1)} />
    ): null;

    return (
      <div className={stylesheet.wrapper}>
        <div className={stylesheet.wrapper__title}>{this.props.text}</div>
        <div className={stylesheet.flexWrapper}>
          {nullItem}
          {consts.COLOURS.map((c, i) => this.renderColourButton(i))}
        </div>
      </div>
    )
  }
}

class Item extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      colourString: consts.COLOURS[props.colourCode]
    }
  }

  updateColourString = (props = this.props) => {
    this.setState({
      colourString: consts.COLOURS[props.colourCode]
    });
  }

  componentDidUpdate(prevProps) {
    // Update on colour code change.
    if (prevProps.colourCode !== this.props.colourCode) {
      this.updateColourString();
    }
  }

  render() {
    if (!this.props.show) {
      return null;
    }

    return (
      <button
        className={classnames(stylesheet.wrapper__item, this.props.active ? stylesheet.active : stylesheet.inactive)}
        style={{backgroundColor: this.state.colourString, borderColor: this.state.colourString}}
        onClick={() => this.props.onClick()}
      />
    );
  }
}

export default MarkerPicker;
