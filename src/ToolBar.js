import React from 'react';
import { Divider } from 'semantic-ui-react';
import classnames from 'classnames';

import stylesheet from './css/ToolBar.module.css';

import consts from './js/consts';

class ToolBar extends React.Component {

  constructor(props) {
    super(props);
    this.openFileRef = React.createRef();
  }

  setCanvasMode = (mode) => this.props.setCanvasModeFunc(mode);
  setCanvasCreateTool = (tool) => this.props.setCanvasCreateToolFunc(tool);

  openMaze = () => {
    if (this.openFileRef.current.files.length > 0) {
      this.openFileRef.current.files[0].text().then(text => {
        this.props.setOpenMazeFileFunc(JSON.parse(text));
        this.props.requestOpenMazeFunc();
      });
    }
  }

  saveMaze = () => {
    this.props.requestSaveMazeFunc();
  }

  exportMaze = () => {
    this.props.requestExportMazeFunc();
  }

  resetMazePattern = () => {
    this.props.requestResetMazePatternFunc();
  }

  resetCamera = () => {
    this.props.requestResetCameraFunc();
  }

  toggleUseRuler = () => {
    this.props.toggleUseRulerFunc();
  }

  renderCreateButtons = () => {
    if (this.props.canvasMode !== consts.CREATE) {
      return null;
    }
    return (
      <>
      <Divider />
        <ToolbarItem text='Load' icon='folder-open' active={false} onClick={() => this.openFileRef.current.click()} />  {/* Run file input from openFileRef. */}
        <ToolbarItem text='Save' icon='save'        active={false} onClick={this.saveMaze} />
        <Divider />
        <ToolbarItem text='Edit Shape'   icon='splotch' active={this.props.canvasCreateTool === consts.SHAPE}   onClick={() => this.setCanvasCreateTool(consts.SHAPE)} />
        <ToolbarItem text='Edit Paths'   icon='map'     active={this.props.canvasCreateTool === consts.PATHS}   onClick={() => this.setCanvasCreateTool(consts.PATHS)} />
        <ToolbarItem text='Edit Markers' icon='map-pin' active={this.props.canvasCreateTool === consts.MARKERS} onClick={() => this.setCanvasCreateTool(consts.MARKERS)} />
        <Divider />
        <ToolbarItem text='Ruler'       icon='ruler'           active={this.props.canvasUseRuler} onClick={this.toggleUseRuler} />
        <ToolbarItem text='Reset Focus' icon='search-location' active={false}                     onClick={this.resetCamera} />
        <ToolbarItem text='New Pattern' icon='puzzle-piece'    active={false}                     onClick={this.resetMazePattern} />
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
        <ToolbarItem text='Save'         icon='save'       active={false} onClick={this.saveMaze} />
        <ToolbarItem text='Export Image' icon='file-image' active={false} onClick={this.exportMaze} />
        <Divider />
        <ToolbarItem text='Solutions'   icon='lightbulb'       active={false} onClick={this.resetCamera} disabled />
        <ToolbarItem text='Reset Focus' icon='search-location' active={false} onClick={this.resetCamera} />
      </>
    );
  }

  render() {
    return (
      <div className={stylesheet.wrapper}>
        <ToolbarItem text='Edit Mode' icon='wrench' active={this.props.canvasMode === consts.CREATE} onClick={() => this.setCanvasMode(consts.CREATE)} />
        <ToolbarItem text='View Mode' icon='eye'    active={this.props.canvasMode === consts.SOLVE}  onClick={() => this.setCanvasMode(consts.SOLVE)} />
        {this.renderCreateButtons()}
        {this.renderSolveButtons()}
        {/* Used to import maze. Should not be displayed. */}
        <input style={{display: 'none'}} ref={this.openFileRef} type='file' accept='.mznp' onInput={this.openMaze} />
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
