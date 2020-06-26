import React from 'react';
import classnames from 'classnames';

import stylesheet from './css/MarkerPicker.module.css';

import consts from './js/consts';

class MarkerPicker extends React.Component {

  setCanvasMarkerColour = (colour) => this.props.setCanvasMarkerColourFunc(colour);

  renderColourButton = (colourCode) => {
    return (
      <Item
        key={colourCode}
        colourCode={colourCode}
        active={this.props.canvasMarkerColour === colourCode}
        onClick={() => this.setCanvasMarkerColour(colourCode)}
      />
    );
  }

  render() {
    if (!this.props.show) {
      return null;
    }

    let nullItem = this.props.allowSelectNone ? (
      <NullItem
        active={this.props.canvasMarkerColour === -1}
        onClick={() => this.setCanvasMarkerColour(-1)}
      />
    ): null;

    return (
      <div className={stylesheet.wrapper}>
        <div className={stylesheet.wrapper__title}>Marker Colour:</div>
        {nullItem}
        {consts.COLOURS.map((c, i) => this.renderColourButton(i))}
      </div>
    )
  }
}

class Item extends React.Component {

  constructor(props) {
    super(props);
    let c = consts.COLOURS[props.colourCode];
    this.state = {
      colourString: `rgb(${c[0]}, ${c[1]}, ${c[2]})`
    }
  }

  updateColourString = (props = this.props) => {
    let c = consts.COLOURS[props.colourCode];
    this.setState({
      colourString: `rgb(${c[0]}, ${c[1]}, ${c[2]})`
    });
  }

  componentDidUpdate(prevProps) {
    // Update on colour code change.
    if (prevProps.colourCode !== this.props.colourCode) {
      this.updateColourString();
    }
  }

  render() {
    return (
      <button
        className={classnames(stylesheet.wrapper__item, this.props.active ? stylesheet.active : stylesheet.inactive)}
        style={{backgroundColor: this.state.colourString, borderColor: this.state.colourString}}
        onClick={() => this.props.onClick()}
      />
    );
  }
}

class NullItem extends React.Component {

  render() {
    return (
      <button
        className={classnames(stylesheet.wrapper__nullItem, this.props.active ? stylesheet.active : stylesheet.inactive)}
        onClick={() => this.props.onClick()}
      />
    );
  }
}

export default MarkerPicker;
