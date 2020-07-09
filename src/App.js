import React from 'react';
import P5Wrapper from 'react-p5-wrapper';
import classnames from 'classnames';
import queryString from 'query-string';
import axios from 'axios';

import stylesheet from './css/App.module.css';

import consts from './js/consts';
import $p5 from './js/p5/global';
import Modal from './Modal';
import ToolBar from './ToolBar';
import MarkerPicker from './MarkerPicker';
import HelpBar from './HelpBar';
import sketch from './js/p5/sketch';
import helperCanvas from './js/p5/helperCanvas';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      canvasUseRuler: false,
      canvasMode: consts.CREATE,
      canvasCreateTool: consts.SHAPE,
      openMazeFile: null,
      exportMazeData: { mazeImg: null, markersImg: null },
      httpMazeData: null,
      canvasMarkerColour: 0,
      canvasSolutionColour: -1,
      canvasPenColour: 0,
      errorModalOpen: false,
      errorModalMessage: '',
      helpBarOpen: true,
      footerOpen: true,
      requestOpenMazeFlag: 0,
      requestSaveMazeFlag: 0,
      requestExportMazeFlag: 0,
      requestUploadMazeFlag: 0,
      requestResetMazePatternFlag: 0,
      requestResetCameraFlag: 0,
      requestKeyLoggerClearFlag: 0,
      requestOpenMazeHttpFlag: 0
    }
    this.canvasWrapperRef = React.createRef();
  }

  setExportMazeData = (data) => this.setState({ exportMazeData: data });
  setOpenMazeFile   = (file) => this.setState({ openMazeFile: file });
  setHttpMazeData   = (data) => this.setState({ httpMazeData: data });

  requestOpenMaze         = () => this.setState({ requestOpenMazeFlag: Date.now() });
  requestSaveMaze         = () => this.setState({ requestSaveMazeFlag: Date.now() });
  requestExportMaze       = () => this.setState({ requestExportMazeFlag: Date.now() });
  requestUploadMaze       = () => this.setState({ requestUploadMazeFlag: Date.now() });
  requestResetMazePattern = () => this.setState({ requestResetMazePatternFlag: Date.now() });
  requestResetCamera      = () => this.setState({ requestResetCameraFlag: Date.now() });
  requestKeyLoggerClear   = () => this.setState({ requestKeyLoggerClearFlag: Date.now() });
  requestOpenMazeHttp     = () => this.setState({ requestOpenMazeHttpFlag: Date.now() });

  setMouseOverCanvas = (val) => $p5.mouseOverSketch = val;

  toggleUseRuler = () => this.setState((state) => ({ canvasUseRuler: !state.canvasUseRuler }));

  setCanvasMode             = (mode)   => this.setState({ canvasMode: mode });
  setCanvasCreateTool       = (tool)   => this.setState({ canvasCreateTool: tool });
  setCanvasMarkerColour     = (colour) => this.setState({ canvasMarkerColour: colour });
  setCanvasSolutionColour   = (colour) => this.setState({ canvasSolutionColour: colour });
  setCanvasPenColour        = (colour) => this.setState({ canvasPenColour: colour });

  showErrorModal = (msg) => this.setState({ errorModalOpen: true, errorModalMessage: msg });
  hideErrorModal = ()    => this.setState({ errorModalOpen: false });

  hideHelpBar   = () => this.setState({ helpBarOpen: false });
  toggleHelpBar = () => this.setState((state) => ({ helpBarOpen: !state.helpBarOpen }));

  hideFooter = () => this.setState({ footerOpen: false });

  onResize = () => {
    let { offsetWidth, offsetHeight } = this.canvasWrapperRef.current;
    $p5.width = offsetWidth;
    $p5.height = offsetHeight;
  }

  loadHttpMaze = () => {
    let mazeEndpoint = 'https://maze-notepad.s3.us-east-2.amazonaws.com/mazes';
    let getQuery = queryString.parse(window.location.search);
    if (getQuery['maze']) {
      axios.get(`${mazeEndpoint}/${getQuery['maze']}`).then(res => {
        this.setHttpMazeData(res.data);
        this.requestOpenMazeHttp();
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    // Resize on mode change or tool change.
    if (prevState.canvasMode !== this.state.canvasMode || prevState.canvasCreateTool !== this.state.canvasCreateTool) {
      this.onResize();
    }
    // Resize on footer open/close or instructions open/close.
    if (prevState.footerOpen !== this.state.footerOpen || prevState.helpBarOpen !== this.state.helpBarOpen) {
      this.onResize();
    }
  }

  componentDidMount() {
    $p5.app__setExportMazeData = this.setExportMazeData;
    $p5.app_setModeFunc = this.setCanvasMode;
    $p5.app_showErrorMessageFunc = this.showErrorModal;

    this.onResize();
    
    window.addEventListener('resize', this.onResize);
    window.addEventListener('blur', this.requestKeyLoggerClear);
    this.canvasWrapperRef.current.addEventListener('mouseenter', () => this.setMouseOverCanvas(true));
    this.canvasWrapperRef.current.addEventListener('mouseleave', () => this.setMouseOverCanvas(false));

    this.loadHttpMaze();
  }

  renderSelectionBar = () => {
    let { exportMazeData, canvasMode, canvasCreateTool, canvasMarkerColour, canvasSolutionColour, canvasPenColour } = this.state;

    let showMarkerPicker = canvasMode === consts.CREATE && canvasCreateTool === consts.MARKERS;
    let showSolutionPicker = canvasMode === consts.SOLVE;
    let showPenPicker = canvasMode === consts.SOLVE

    if (!showMarkerPicker && !showSolutionPicker) {
      return null;
    }

    let markerPickerVisibleList = [];
    let solutionPickerVisibleList = [];
    let penPickerVisibleList = [];
    for (let i = 0; i < consts.COLOURS.length; i++) {
      markerPickerVisibleList.push(true);
      penPickerVisibleList.push(true);
      // It is possible for the selected solution not to be visible. The null item doesn't change appearance when selected vs not selected,
      // so it will look like the null item is selected (which is good).
      if (exportMazeData.solutions) {
        solutionPickerVisibleList.push(exportMazeData.solutions[i] !== null);
      }
      else {
        solutionPickerVisibleList.push(false);
      }
    }

    return (
      <div className={stylesheet.wrapper__selectionBar}>
        <MarkerPicker
          text='Select location colour:'
          show={showMarkerPicker}
          visibleList={markerPickerVisibleList}
          allowSelectNone={false}
          activeValue={canvasMarkerColour}
          onClickFunc={this.setCanvasMarkerColour}
        />
        <MarkerPicker
          text='Select pen colour:'
          show={showPenPicker}
          visibleList={penPickerVisibleList}
          allowSelectNone={false}
          activeValue={canvasPenColour}
          onClickFunc={this.setCanvasPenColour}
        />
        <MarkerPicker
          text='Select solution to view:'
          show={showSolutionPicker}
          visibleList={solutionPickerVisibleList}
          allowSelectNone={true}
          activeValue={canvasSolutionColour}
          onClickFunc={this.setCanvasSolutionColour}
        />
      </div>
    );
  }

  renderHelpBar = () => {
    if (!this.state.helpBarOpen) {
      return null;
    }

    return (
      <div className={stylesheet.wrapper__helpBar}>
        <HelpBar hideFunc={this.hideHelpBar} />
      </div>
    );
  }

  render() {
    let {
      canvasUseRuler, canvasMode, canvasCreateTool, canvasMarkerColour, canvasSolutionColour, canvasPenColour,
      openMazeFile, exportMazeData, httpMazeData,
      errorModalOpen, errorModalMessage, helpBarOpen, footerOpen,
      requestOpenMazeFlag, requestSaveMazeFlag, requestExportMazeFlag, requestUploadMazeFlag, requestResetMazePatternFlag, requestResetCameraFlag, requestKeyLoggerClearFlag, requestOpenMazeHttpFlag
    } = this.state;

    return (
      <>
        <div className={stylesheet.wrapper}>
          <div className={stylesheet.wrapper__toolBar}>
            <ToolBar
              helpBarOpen={helpBarOpen}
              canvasUseRuler={canvasUseRuler}
              canvasMode={canvasMode}
              canvasCreateTool={canvasCreateTool}
              setCanvasModeFunc={this.setCanvasMode}
              setCanvasCreateToolFunc={this.setCanvasCreateTool}
              setOpenMazeFileFunc={this.setOpenMazeFile}
              requestOpenMazeFunc={this.requestOpenMaze}
              requestSaveMazeFunc={this.requestSaveMaze}
              requestExportMazeFunc={this.requestExportMaze}
              requestUploadMazeFunc={this.requestUploadMaze}
              requestResetMazePatternFunc={this.requestResetMazePattern}
              requestResetCameraFunc={this.requestResetCamera}
              toggleUseRulerFunc={this.toggleUseRuler}
              toggleHelpBarFunc={this.toggleHelpBar}
            />
          </div>
          {this.renderSelectionBar()}
          <div className={stylesheet.wrapper__canvas} ref={this.canvasWrapperRef} onContextMenu={e => e.preventDefault()}> {/* Disable right-click in sketch */}
            <P5Wrapper
              httpMazeData={httpMazeData}
              sketch={sketch}
              useRuler={canvasUseRuler}
              mode={canvasMode}
              createTool={canvasCreateTool}
              markerColour={canvasMarkerColour}
              solutionColour={canvasSolutionColour}
              penColour={canvasPenColour}
              openMazeFile={openMazeFile}
              requestOpenMazeFlag={requestOpenMazeFlag}
              requestSaveMazeFlag={requestSaveMazeFlag}
              requestResetMazePatternFlag={requestResetMazePatternFlag}
              requestResetCameraFlag={requestResetCameraFlag}
              requestKeyLoggerClearFlag={requestKeyLoggerClearFlag}
              requestOpenMazeHttpFlag={requestOpenMazeHttpFlag}
            />
          </div>
          {this.renderHelpBar()}
          <div className={stylesheet.wrapper__footer} style={{display: footerOpen ? 'block' : 'none'}}>
            <button
              className={classnames(stylesheet.wrapper__footer__closeButton, 'transparent-button')}
              onClick={this.hideFooter}
            >
              <i className='fas fa-times' />
            </button>
            <div className={stylesheet.wrapper__footer__message}>
              <span>Made by Max Huang</span>
              <span><a href='https://github.com/max-y-huang/maze-notepad-js' rel='noopener noreferrer' target='_blank'>View on GitHub</a></span>
            </div>
          </div>
        </div>
        <Modal
          open={errorModalOpen}
          header='Error!'
          body={<p>{errorModalMessage}</p>}
          footer={<button onClick={this.hideErrorModal}>Okay</button>}
        />
        {/* Used to export maze image. Should not be displayed. */}
        <div style={{display: 'none'}}>
          <P5Wrapper
            sketch={helperCanvas}
            requestExportMazeFlag={requestExportMazeFlag}
            requestUploadMazeFlag={requestUploadMazeFlag}
            data={exportMazeData}
          />
        </div>
      </>
    );
  }
}

export default App;
