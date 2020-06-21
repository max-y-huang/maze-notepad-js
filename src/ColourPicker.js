import React from 'react';
import classnames from 'classnames';

import stylesheet from './css/ColourPicker.module.css';

import consts from './js/consts';

class ColourPicker extends React.Component {

  setCanvasMarkerColour = (colour) => this.props.setCanvasMarkerColourFunc(colour);

  renderColourButton = (colourCode) => {
    let colour = consts.COLOURS[colourCode];
    let colourString = `rgb(${colour[0]}, ${colour[1]}, ${colour[2]})`;
    return (
      <button
        key={colourCode}
        className={classnames(stylesheet.wrapper__item, this.props.canvasMarkerColour === colourCode ? stylesheet.active : stylesheet.inactive)}
        style={{backgroundColor: colourString, borderColor: colourString}}
        onClick={() => this.setCanvasMarkerColour(colourCode)}
      />
    );
  }

  render() {
    if (!this.props.show) {
      return null;
    }
    return (
      <div className={stylesheet.wrapper}>
        {consts.COLOURS.map((c, i) => this.renderColourButton(i))}
      </div>
    )
  }
}

export default ColourPicker;
