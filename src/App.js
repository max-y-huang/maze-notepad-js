import React from 'react';
import P5Wrapper from 'react-p5-wrapper';
import classnames from 'classnames';

import stylesheet from './css/App.module.css';

import consts from './js/consts';
import $p5 from './js/p5/global';
import Accordion from './Accordion';
import Modal from './Modal';
import ToolBar from './ToolBar';
import MarkerPicker from './MarkerPicker';
import sketch from './js/p5/sketch';
import exportCanvas from './js/p5/exportCanvas';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      canvasUseRuler: false,
      canvasMode: consts.CREATE,
      canvasCreateTool: consts.SHAPE,
      openMazeFile: null,
      exportMazeData: { mazeImg: null, markersImg: null },
      canvasMarkerColour: 0,
      canvasSolutionColour: -1,
      canvasPenColour: 0,
      errorModalOpen: false,
      errorModalMessage: '',
      instructionsOpen: false,
      footerOpen: true,
      requestOpenMazeFlag: 0,
      requestSaveMazeFlag: 0,
      requestExportMazeFlag: 0,
      requestResetMazePatternFlag: 0,
      requestResetCameraFlag: 0,
      requestKeyLoggerClearFlag: 0
    }
    this.canvasWrapperRef = React.createRef();
  }

  setExportMazeData = (data) => this.setState({ exportMazeData: data });
  setOpenMazeFile   = (file) => this.setState({ openMazeFile: file });

  requestOpenMaze         = () => this.setState({ requestOpenMazeFlag: Date.now() });
  requestSaveMaze         = () => this.setState({ requestSaveMazeFlag: Date.now() });
  requestExportMaze       = () => this.setState({ requestExportMazeFlag: Date.now() });
  requestResetMazePattern = () => this.setState({ requestResetMazePatternFlag: Date.now() });
  requestResetCamera      = () => this.setState({ requestResetCameraFlag: Date.now() });
  requestKeyLoggerClear   = () => this.setState({ requestKeyLoggerClearFlag: Date.now() });

  setMouseOverCanvas = (val) => $p5.mouseOverSketch = val;

  toggleUseRuler = () => this.setState((state) => ({ canvasUseRuler: !state.canvasUseRuler }));

  setCanvasMode             = (mode)   => this.setState({ canvasMode: mode });
  setCanvasCreateTool       = (tool)   => this.setState({ canvasCreateTool: tool });
  setCanvasMarkerColour     = (colour) => this.setState({ canvasMarkerColour: colour });
  setCanvasSolutionColour   = (colour) => this.setState({ canvasSolutionColour: colour });
  setCanvasPenColour        = (colour) => this.setState({ canvasPenColour: colour });

  showErrorModal = (msg) => this.setState({ errorModalOpen: true, errorModalMessage: msg });
  hideErrorModal = ()    => this.setState({ errorModalOpen: false });

  hideInstructions   = () => this.setState({ instructionsOpen: false });
  toggleInstructions = () => this.setState((state) => ({ instructionsOpen: !state.instructionsOpen }));

  hideFooter = () => this.setState({ footerOpen: false });

  onResize = () => {
    let { offsetWidth, offsetHeight } = this.canvasWrapperRef.current;
    $p5.width = offsetWidth;
    $p5.height = offsetHeight;
  }

  componentDidUpdate(prevProps, prevState) {
    // Resize on mode change or tool change.
    if (prevState.canvasMode !== this.state.canvasMode || prevState.canvasCreateTool !== this.state.canvasCreateTool) {
      this.onResize();
    }
    // Resize on footer open/close.
    if (prevState.footerOpen !== this.state.footerOpen) {
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

  render() {
    let {
      canvasUseRuler, canvasMode, canvasCreateTool, canvasMarkerColour, canvasSolutionColour, canvasPenColour,
      openMazeFile, exportMazeData,
      errorModalOpen, errorModalMessage, instructionsOpen, footerOpen,
      requestOpenMazeFlag, requestSaveMazeFlag, requestExportMazeFlag, requestResetMazePatternFlag, requestResetCameraFlag, requestKeyLoggerClearFlag
    } = this.state;

    return (
      <>
        <div className={stylesheet.wrapper}>
          <div className={stylesheet.wrapper__toolBar}>
            <ToolBar
              instructionsOpen={instructionsOpen}
              canvasUseRuler={canvasUseRuler}
              canvasMode={canvasMode}
              canvasCreateTool={canvasCreateTool}
              setCanvasModeFunc={this.setCanvasMode}
              setCanvasCreateToolFunc={this.setCanvasCreateTool}
              setOpenMazeFileFunc={this.setOpenMazeFile}
              requestOpenMazeFunc={this.requestOpenMaze}
              requestSaveMazeFunc={this.requestSaveMaze}
              requestExportMazeFunc={this.requestExportMaze}
              requestResetMazePatternFunc={this.requestResetMazePattern}
              requestResetCameraFunc={this.requestResetCamera}
              toggleUseRulerFunc={this.toggleUseRuler}
              toggleInstructionsFunc={this.toggleInstructions}
            />
          </div>
          {this.renderSelectionBar()}
          <div className={stylesheet.wrapper__canvas} ref={this.canvasWrapperRef} onContextMenu={e => e.preventDefault()}> {/* Disable right-click in sketch */}
            <P5Wrapper
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
            />
          </div>
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
        <div className={stylesheet.instructions} style={{display: instructionsOpen ? 'block' : 'none'}}>
          <button
            className={classnames(stylesheet.instructions__closeButton, 'transparent-button')}
            onClick={this.hideInstructions}
          >
            <i className='fas fa-times' />
          </button>
          <div className={stylesheet.instructions__messageBox}>
            <Accordion
              summary='In General...'
              details={<>
                <p><em>Middle click + drag</em> or use <em>WASD</em> to pan the camera</p>
                <p><em>Scroll</em> or use <em>E and Q</em> to zoom in / out</p>
              </>}
            />
            <Accordion
              summary='In Edit Mode...'
              details={<>
                <p><em>Left click</em> to draw</p>
                <p><em>Right click</em> or <em>CTRL + left click</em> to erase</p>
                <p>With certain tools, <em>SHIFT + left / right click</em> to draw / erase a contiguous area</p>
              </>}
            />
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
            className={stylesheet.exportCanvas}
            sketch={exportCanvas}
            requestExportMazeFlag={requestExportMazeFlag}
            data={exportMazeData}
          />
        </div>
      </>
    );
  }
}

export default App;
