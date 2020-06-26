import React from 'react';
import { Modal, Button, Divider } from 'semantic-ui-react';
import P5Wrapper from 'react-p5-wrapper';
import Cookies from 'js-cookie';

import stylesheet from './css/App.module.css';

import consts from './js/consts';
import $p5 from './js/p5/global';
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
      errorModalOpen: false,
      errorModalMessage: '',
      instructionsModalOpen: false,
      instructionsOpen: false,
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

  setCanvasMode         = (mode)   => this.setState({ canvasMode: mode });
  setCanvasCreateTool   = (tool)   => this.setState({ canvasCreateTool: tool });
  setCanvasMarkerColour = (colour) => this.setState({ canvasMarkerColour: colour });
  setCanvasSolutionColour   = (colour) => this.setState({ canvasSolutionColour: colour });

  showErrorModal = (msg) => this.setState({ errorModalOpen: true, errorModalMessage: msg });
  hideErrorModal = ()    => this.setState({ errorModalOpen: false });

  showInstructionsModal = () => this.setState({ instructionsModalOpen: true });
  hideInstructionsModal = () => this.setState({ instructionsModalOpen: false });
  toggleInstructions    = () => this.setState((state) => ({ instructionsOpen: !state.instructionsOpen }));

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
  }

  componentDidMount() {
    // Show instructions modal if first time visiting.
    if (!Cookies.get('maze-notepad-js__visited')) {
      this.showInstructionsModal();
      Cookies.set('maze-notepad-js__visited', true);
    }

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
    let { canvasMode, canvasCreateTool, canvasMarkerColour, canvasSolutionColour } = this.state;
    let showMarkerMarkerPicker = canvasMode === consts.CREATE && canvasCreateTool === consts.MARKERS;
    let showSolutionMarkerPicker = canvasMode === consts.SOLVE;
    if (!showMarkerMarkerPicker && !showSolutionMarkerPicker) {
      return null;
    }
    return (
      <div className={stylesheet.wrapper__selectionBar}>
        <MarkerPicker
          text='Marker Colour:'
          show={showMarkerMarkerPicker}
          allowSelectNone={false}
          activeValue={canvasMarkerColour}
          onClickFunc={this.setCanvasMarkerColour}
        />
        <MarkerPicker
          text='Displayed Solution:'
          show={showSolutionMarkerPicker}
          allowSelectNone={true}
          activeValue={canvasSolutionColour}
          onClickFunc={this.setCanvasSolutionColour}
        />
      </div>
    );
  }

  renderInstructions = (theme) => {
    return (
      <>
        <p className={stylesheet[theme]}><em>Middle click + drag</em> or use <em>WASD</em> to pan the camera</p>
        <p className={stylesheet[theme]}><em>Scroll</em> or use <em>E and Q</em> to zoom in / out</p>
        <p className={stylesheet[theme]}><em>Left click</em> to draw</p>
        <p className={stylesheet[theme]}><em>Right click</em> or <em>CTRL + left click</em> to erase</p>
        <p className={stylesheet[theme]}>In some cases, <em>SHIFT + left / right click</em> to draw / erase a contiguous area</p>
      </>
    );
  }

  render() {
    let {
      canvasUseRuler, canvasMode, canvasCreateTool, canvasMarkerColour, canvasSolutionColour,
      openMazeFile, exportMazeData,
      errorModalOpen, errorModalMessage, instructionsModalOpen, instructionsOpen,
      requestOpenMazeFlag, requestSaveMazeFlag, requestExportMazeFlag, requestResetMazePatternFlag, requestResetCameraFlag, requestKeyLoggerClearFlag
    } = this.state;
    return (
      <>
        <div className={stylesheet.wrapper}>
          <div className={stylesheet.wrapper__toolBar}>
            <ToolBar
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
              openMazeFile={openMazeFile}
              requestOpenMazeFlag={requestOpenMazeFlag}
              requestSaveMazeFlag={requestSaveMazeFlag}
              requestResetMazePatternFlag={requestResetMazePatternFlag}
              requestResetCameraFlag={requestResetCameraFlag}
              requestKeyLoggerClearFlag={requestKeyLoggerClearFlag}
            />
          </div>
        </div>
        <div className={stylesheet.instructions}>
          <Button
            className={stylesheet.instructions__infoButton}
            style={{display: instructionsOpen ? 'none' : 'block'}}
            icon='info'
            color='black'
            onClick={this.toggleInstructions}
          >
          </Button>
          <div
            className={stylesheet.instructions__messageBox}
            style={{display: instructionsOpen ? 'block' : 'none'}}
          >
            <Button
              className={stylesheet.instructions__messageBox__closeButton}
              icon='close'
              onClick={this.toggleInstructions}
            />
            {this.renderInstructions('dark')}
          </div>
        </div>
        <Modal
          open={errorModalOpen}
          header='Error!'
          content={{ content: errorModalMessage, style: { fontSize: '16px' } }}
          actions={[{ key: 'confirm', content: 'Got it', color: 'blue', onClick: this.hideErrorModal }]}
        />
        <Modal
          open={instructionsModalOpen}
          header='Welcome to Maze Notepad!'
          content={{
            content: (
              <div>
                {this.renderInstructions('light')}
                <Divider />
                <p className={stylesheet.light}>Click the <i className='fas fa-info fa-fw' /> button in the bottom-right corner to view the instructions later</p>
              </div>
            ),
            style: { fontSize: '16px' }
          }}
          actions={[{ key: 'confirm', content: 'Got it', color: 'blue', onClick: this.hideInstructionsModal }]}
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
