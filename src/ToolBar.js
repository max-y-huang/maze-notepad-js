import React from 'react';
import { Divider } from 'semantic-ui-react';
import classnames from 'classnames';

import stylesheet from './css/ToolBar.module.css';

import consts from './js/consts';

class ToolBar extends React.Component {

  setCanvasMode = (mode) => this.props.setCanvasModeFunc(mode);
  setCanvasCreateTool = (tool) => this.props.setCanvasCreateToolFunc(tool);

  renderCreateButtons = () => {
    if (this.props.canvasMode !== consts.CREATE) {
      return null;
    }
    return (
      <>
        <Divider />
        <ToolbarItem text='Edit Shape'   icon='splotch' active={this.props.canvasCreateTool === consts.SHAPE}   onClick={() => this.setCanvasCreateTool(consts.SHAPE)} />
        <ToolbarItem text='Edit Paths'   icon='map'     active={this.props.canvasCreateTool === consts.PATHS}   onClick={() => this.setCanvasCreateTool(consts.PATHS)} />
        <ToolbarItem text='Edit Markers' icon='map-pin' active={this.props.canvasCreateTool === consts.MARKERS} onClick={() => this.setCanvasCreateTool(consts.MARKERS)} />
      </>
    );
  }

  renderSolveButtons = () => {
    if (this.props.canvasMode !== consts.SOLVE) {
      return null;
    }
    return (
      <>
        <Divider />
        <ToolbarItem text='Export Image' icon='file-export' active={false} onClick={this.setCanvasCreateTool} />
      </>
    );
  }

  render() {
    return (
      <div className={stylesheet.wrapper}>
        <ToolbarItem text='Edit Mode' icon='wrench' active={this.props.canvasMode === consts.CREATE} onClick={() => this.setCanvasMode(consts.CREATE)} />
        <ToolbarItem text='View Mode' icon='eye'    active={this.props.canvasMode === consts.SOLVE}  onClick={() => this.setCanvasMode(consts.SOLVE)} />
        <Divider />
        <ToolbarItem disabled text='Open' icon='folder-open' active={this.props.canvasMode === consts.CREATE} onClick={() => this.setCanvasMode(consts.CREATE)} />
        <ToolbarItem disabled text='Save' icon='save'        active={this.props.canvasMode === consts.SOLVE}  onClick={() => this.setCanvasMode(consts.SOLVE)} />
        {this.renderCreateButtons()}
        {this.renderSolveButtons()}
      </div>
    )
  }
}

class ToolbarItem extends React.Component {

  render() {
    return (
      <button
        className={classnames(stylesheet.wrapper__item, this.props.active ? stylesheet.active : stylesheet.inactive)}
        onClick={() => this.props.onClick()}
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
