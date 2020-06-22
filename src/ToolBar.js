import React from 'react';
import { Divider } from 'semantic-ui-react';
import classnames from 'classnames';

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
        <ToolbarItem value={consts.SHAPE}   text='Shape Tool'  icon='square'  currentValue={this.props.canvasCreateTool} runFunc={this.setCanvasCreateTool} />
        <ToolbarItem value={consts.PATHS}   text='Path Tool'   icon='map'     currentValue={this.props.canvasCreateTool} runFunc={this.setCanvasCreateTool} />
        <ToolbarItem value={consts.MARKERS} text='Marker Tool' icon='map-pin' currentValue={this.props.canvasCreateTool} runFunc={this.setCanvasCreateTool} />
      </>
    );
  }

  render() {
    return (
      <div className={stylesheet.wrapper}>
        <ToolbarItem value={consts.CREATE} text='Edit Maze' icon='wrench' currentValue={this.props.canvasMode} runFunc={this.setCanvasMode} />
        <ToolbarItem value={consts.SOLVE}  text='View Maze' icon='eye'    currentValue={this.props.canvasMode} runFunc={this.setCanvasMode} />
        <Divider />
        <ToolbarItem value={consts.CREATE} text='Open'   icon='folder-open' currentValue={this.props.canvasMode} runFunc={this.setCanvasMode} disabled />
        <ToolbarItem value={consts.SOLVE}  text='Save'   icon='save'        currentValue={this.props.canvasMode} runFunc={this.setCanvasMode} disabled />
        {this.renderCreateToolsButtons()}
      </div>
    )
  }
}

class ToolbarItem extends React.Component {

  render() {
    return (
      <button
        className={classnames(stylesheet.wrapper__item, this.props.currentValue === this.props.value ? stylesheet.active : stylesheet.inactive)}
        onClick={() => this.props.runFunc(this.props.value)}
        disabled={this.props.disabled}
      >
        <div className={stylesheet.wrapper__item__icon}>
          <i className={classnames('fas', `fa-${this.props.icon}`, 'fa-fw')} />
        </div>
        <div className={stylesheet.wrapper__item__text}>
          {this.props.text}
        </div>
      </button>
    );
  }
}

export default ToolBar;
