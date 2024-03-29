import React from 'react';
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

  toggleHelpBar = () => {
    this.props.toggleHelpBarFunc();
  }

  showUploadModal = () => {
    this.props.showUploadModalFunc();
  }

  renderCreateButtons = () => {
    if (this.props.canvasMode !== consts.CREATE) {
      return null;
    }
    return (
      <>
        <div className='divider vertical' />
        <Item text='Load' icon='folder-open' active={false} onClick={() => this.openFileRef.current.click()} />  {/* Run file input from openFileRef. */}
        <Item text='Save' icon='save'        active={false} onClick={this.saveMaze} />
        <div className='divider vertical' />
        <Item text='Edit Shape'     icon='splotch'        active={this.props.canvasCreateTool === consts.SHAPE}   onClick={() => this.setCanvasCreateTool(consts.SHAPE)} />
        <Item text='Edit Paths'     icon='map'            active={this.props.canvasCreateTool === consts.PATHS}   onClick={() => this.setCanvasCreateTool(consts.PATHS)} />
        <Item text='Edit Locations' icon='map-marker-alt' active={this.props.canvasCreateTool === consts.MARKERS} onClick={() => this.setCanvasCreateTool(consts.MARKERS)} />
        <div className='divider vertical' />
        <Item text='Ruler'       icon='ruler'           active={this.props.canvasUseRuler} onClick={this.toggleUseRuler} />
        <Item text='Reset Focus' icon='search-location' active={false}                     onClick={this.resetCamera} />
        <Item text='New Pattern' icon='puzzle-piece'    active={false}                     onClick={this.resetMazePattern} />
        <div className='divider vertical' />
        <Item text='Help' icon='info' active={this.props.helpBarOpen} onClick={this.toggleHelpBar} />
      </>
    );
  }

  renderSolveButtons = () => {
    if (this.props.canvasMode !== consts.SOLVE) {
      return null;
    }
    return (
      <>
      <div className='divider vertical' />
        <Item text='Save'              icon='save'             active={false} onClick={this.saveMaze} />
        <Item text='Export Image'      icon='file-image'       active={false} onClick={this.exportMaze} />
        <Item text='Upload To Gallery' icon='cloud-upload-alt' active={false} onClick={this.showUploadModal} />
        <div className='divider vertical' />
        <Item text='Reset Focus' icon='search-location' active={false} onClick={this.resetCamera} />
        <div className='divider vertical' />
        <Item text='Help' icon='info' active={this.props.helpBarOpen} onClick={this.toggleHelpBar} />
      </>
    );
  }

  render() {
    return (
      <div className={stylesheet.wrapper}>
        <Item text='Edit Mode' icon='wrench' active={this.props.canvasMode === consts.CREATE} onClick={() => this.setCanvasMode(consts.CREATE)} />
        <Item text='View Mode' icon='eye'    active={this.props.canvasMode === consts.SOLVE}  onClick={() => this.setCanvasMode(consts.SOLVE)} />
        {this.renderCreateButtons()}
        {this.renderSolveButtons()}
        <div className='divider vertical' />
        <div style={{ textAlign: 'center', color: '#606060' }}>
          Ver. 08-05-2021-2
        </div>
        {/* Used to import maze. Should not be displayed. */}
        <input style={{display: 'none'}} ref={this.openFileRef} type='file' accept='.mznp' onInput={this.openMaze} />
      </div>
    )
  }
}

class Item extends React.Component {

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
