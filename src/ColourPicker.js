import React from 'react';
import classnames from 'classnames';

import stylesheet from './css/ColourPicker.module.css';

import consts from './js/consts';

class ColourPicker extends React.Component {

  setCanvasMarkerColour = (colour) => this.props.setCanvasMarkerColourFunc(colour);

  renderColourButton = (colourCode) => {
    return (
      <ColourPickerItem key={colourCode} value={colourCode} currentValue={this.props.canvasMarkerColour} runFunc={this.setCanvasMarkerColour} />
    );
  }

  render() {
    if (!this.props.show) {
      return null;
    }
    return (
      <div className={stylesheet.wrapper}>
        <div className={stylesheet.wrapper__title}>Pick Marker Colour:</div>
        {consts.COLOURS.map((c, i) => this.renderColourButton(i))}
      </div>
    )
  }
}

class ColourPickerItem extends React.Component {

  constructor(props) {
    super(props);
    let c = consts.COLOURS[props.value];
    this.state = {
      colourString: `rgb(${c[0]}, ${c[1]}, ${c[2]})`
    }
  }

  updateColourString = (props = this.props) => {
    let c = consts.COLOURS[props.value];
    this.setState({
      colourString: `rgb(${c[0]}, ${c[1]}, ${c[2]})`
    });
  }

  componentDidUpdate(prevProps) {
    // Resize on mode change or tool change.
    if (prevProps.value !== this.props.value) {
      this.updateColourString();
    }
  }

  render() {
    return (
      <button
        className={classnames(stylesheet.wrapper__item, this.props.currentValue === this.props.value ? stylesheet.active : stylesheet.inactive)}
        style={{backgroundColor: this.state.colourString, borderColor: this.state.colourString}}
        onClick={() => this.props.runFunc(this.props.value)}
      />
    );
  }
}

export default ColourPicker;
