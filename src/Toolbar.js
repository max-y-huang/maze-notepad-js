import React from 'react';
import { Button, Divider } from 'semantic-ui-react';

import stylesheet from './css/Toolbar.module.css';

import consts from './js/consts';

class Toolbar extends React.Component {

  setCanvasMode = (mode) => this.props.setCanvasModeFunc(mode);
  setCanvasCreateTool = (tool) => this.props.setCanvasCreateToolFunc(tool);

  renderCreateToolsButtons = () => {
    if (this.props.canvasMode !== consts.CREATE) {
      return null;
    }
    return (
      <>
        <Divider />
        <Button className={stylesheet.wrapper__item} basic size='huge'
          icon='square'
          color={this.props.canvasCreateTool === consts.SHAPE ? 'blue' : 'black'}
          onClick={() => this.setCanvasCreateTool(consts.SHAPE)}
        />
        <Button className={stylesheet.wrapper__item} basic size='huge' disabled
          icon='map'
          color={this.props.canvasCreateTool === consts.PATHS ? 'blue' : 'black'}
          onClick={() => this.setCanvasCreateTool(consts.PATHS)}
        />
        <Button className={stylesheet.wrapper__item} basic size='huge'
          icon='map marker alternate'
          color={this.props.canvasCreateTool === consts.MARKERS ? 'blue' : 'black'}
          onClick={() => this.setCanvasCreateTool(consts.MARKERS)}
        />
        <Button className={stylesheet.wrapper__item} basic size='huge' disabled
          icon='rocket'
          color={this.props.canvasCreateTool === consts.PORTALS ? 'blue' : 'black'}
          onClick={() => this.setCanvasCreateTool(consts.PORTALS)}
        />
      </>
    );
  }

  render() {
    return (
      <div className={stylesheet.wrapper}>
        <Button className={stylesheet.wrapper__item} basic size='huge'
          icon='wrench'
          color={this.props.canvasMode === consts.CREATE ? 'blue' : 'black'}
          onClick={() => this.setCanvasMode(consts.CREATE)}
        />
        <Button className={stylesheet.wrapper__item} basic size='huge'
          icon='pencil'
          color={this.props.canvasMode === consts.SOLVE ? 'blue' : 'black'}
          onClick={() => this.setCanvasMode(consts.SOLVE)}
        />
        {this.renderCreateToolsButtons()}
      </div>
    )
  }
}

export default Toolbar;
