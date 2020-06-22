import React from 'react';
import { Button, Divider } from 'semantic-ui-react';

import stylesheet from './css/Toolbar.module.css';

import consts from './js/consts';

class ToolBar extends React.Component {

  setCanvasMode = (mode) => this.props.setCanvasModeFunc(mode);
  setCanvasCreateTool = (tool) => this.props.setCanvasCreateToolFunc(tool);

  renderCreateToolsButtons = () => {
    if (this.props.canvasMode !== consts.CREATE) {
      return null;
    }
    return (
      <>
        <Divider />
        <ToolbarButton value={consts.SHAPE}   icon='square'               currentValue={this.props.canvasCreateTool} runFunc={this.setCanvasCreateTool} />
        <ToolbarButton value={consts.PATHS}   icon='map'                  currentValue={this.props.canvasCreateTool} runFunc={this.setCanvasCreateTool} />
        <ToolbarButton value={consts.MARKERS} icon='map marker alternate' currentValue={this.props.canvasCreateTool} runFunc={this.setCanvasCreateTool} />
      </>
    );
  }

  render() {
    return (
      <div className={stylesheet.wrapper}>
        <ToolbarButton value={consts.CREATE} icon='wrench' currentValue={this.props.canvasMode} runFunc={this.setCanvasMode} />
        <ToolbarButton value={consts.SOLVE}  icon='eye'    currentValue={this.props.canvasMode} runFunc={this.setCanvasMode} />
        {this.renderCreateToolsButtons()}
      </div>
    )
  }
}

class ToolbarButton extends React.Component {

  render() {
    return (
      <Button className={stylesheet.wrapper__item} inverted size='huge'
        icon={this.props.icon}
        color={this.props.currentValue === this.props.value ? 'blue' : 'black'}
        onClick={() => this.props.runFunc(this.props.value)}
      />
    );
  }
}

export default ToolBar;
