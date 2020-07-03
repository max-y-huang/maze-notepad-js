import React from 'react';
import classnames from 'classnames';

import stylesheet from './css/HelpBar.module.css';

import Accordion from './Accordion';

class HelpBar extends React.Component {

  render() {
    return (
      <div className={stylesheet.wrapper}>
        <button
          className={classnames(stylesheet.wrapper__closeButton, 'transparent-button')}
          onClick={() => this.props.hideFunc()}
        >
          <i className='fas fa-times' />
        </button>
        <div className={stylesheet.wrapper__header}>Help Panel</div>
        <Accordion
          summary='Moving the Canvas'
          details={<>
            <table>
              <tbody>
                <tr>
                  <th>Action</th>
                  <th>Controls</th>
                </tr>
                <tr>
                  <td>Pan</td>
                  <td>Middle click or WASD.</td>
                </tr>
                <tr>
                  <td>Zoom in/out</td>
                  <td>Scroll or E/Q.</td>
                </tr>
              </tbody>
            </table>
          </>}
        />
        <div className='divider' />
        <Accordion
          summary='Edit Mode'
          details={<>
            <p>Create the maze in this mode. Specific controls can be found in other subsections.</p>
          </>}
        />
        <Accordion
          summary={<>Edit Mode <i className='fas fa-angle-right fa-fw' /> Load</>}
          details={<>
            <p>Loads an .mznp file to this program.</p>
          </>}
        />
        <Accordion
          summary={<>Edit Mode <i className='fas fa-angle-right fa-fw' /> Save</>}
          details={<>
            <p>Saves the maze as an .mznp file.</p>
          </>}
        />
        <Accordion
          summary={<>Edit Mode <i className='fas fa-angle-right fa-fw' /> Edit Shape</>}
          details={<>
            <p>Select which cells on the canvas are a part of the maze. The maze must be contiguous and be larger than 1x1.</p>
            <table>
              <tbody>
                <tr>
                  <th>Action</th>
                  <th>Controls</th>
                </tr>
                <tr>
                  <td>Draw shape</td>
                  <td>Left click</td>
                </tr>
                <tr>
                  <td>Erase shape</td>
                  <td>Right click or CTRL + left click</td>
                </tr>
                <tr>
                  <td>Draw/erase an area</td>
                  <td>SHIFT + draw/erase</td>
                </tr>
              </tbody>
            </table>
          </>}
        />
        <Accordion
          summary={<>Edit Mode <i className='fas fa-angle-right fa-fw' /> Edit Paths</>}
          details={<>
            <p>Draw custom maze paths. The maze-generation algorithm will prioritize these paths, but it will not form cycles (even if they are drawn).</p>
            <table>
              <tbody>
                <tr>
                  <th>Action</th>
                  <th>Controls</th>
                </tr>
                <tr>
                  <td>Draw paths</td>
                  <td>Left click + drag</td>
                </tr>
                <tr>
                  <td>Erase paths</td>
                  <td>Right click or CTRL + left click</td>
                </tr>
                <tr>
                  <td>Erase an area</td>
                  <td>SHIFT + erase</td>
                </tr>
              </tbody>
            </table>
          </>}
        />
        <Accordion
          summary={<>Edit Mode <i className='fas fa-angle-right fa-fw' /> Edit Locations</>}
          details={<>
            <p>Locations are mandatory elements that represent sources/destinatons on the maze. Solutions in View Mode are based on location placements.</p>
            <table>
              <tbody>
                <tr>
                  <th>Action</th>
                  <th>Controls</th>
                </tr>
                <tr>
                  <td>Select location type</td>
                  <td>Colour picker</td>
                </tr>
                <tr>
                  <td>Add location</td>
                  <td>Left click</td>
                </tr>
                <tr>
                  <td>Remove location</td>
                  <td>Right click or CTRL + left click</td>
                </tr>
              </tbody>
            </table>
          </>}
        />
        <Accordion
          summary={<>Edit Mode <i className='fas fa-angle-right fa-fw' /> Ruler</>}
          details={<>
            <p>Toggle the ruler. This has no effect on the resulting maze.</p>
          </>}
        />
        <Accordion
          summary={<>Edit Mode <i className='fas fa-angle-right fa-fw' /> Reset Focus</>}
          details={<>
            <p>Move the camera to the starting point. This has no effect on the resulting maze.</p>
          </>}
        />
        <Accordion
          summary={<>Edit Mode <i className='fas fa-angle-right fa-fw' /> New Pattern</>}
          details={<>
            <p>Randomizes maze paths. This does not overwrite custom paths from Edit Paths. This action cannot be undone.</p>
          </>}
        />
        <Accordion
          summary={<>Edit Mode <i className='fas fa-angle-right fa-fw' /> Help</>}
          details={<>
            <p>Toggles this panel. This has no effect on the resulting maze.</p>
          </>}
        />
        <div className='divider' />
        <Accordion
          summary='View Mode'
          details={<>
            <p>Preview, test, and export the maze in this mode.</p>
            <table>
              <tbody>
                <tr>
                  <th>Action</th>
                  <th>Controls</th>
                </tr>
                <tr>
                  <td>Change pen colour</td>
                  <td>Colour picker on the left</td>
                </tr>
                <tr>
                  <td>Draw paths</td>
                  <td>Left click + drag</td>
                </tr>
                <tr>
                  <td>Erase paths</td>
                  <td>Right click or CTRL + left click</td>
                </tr>
                <tr>
                  <td>Erase an area</td>
                  <td>SHIFT + erase</td>
                </tr>
                <tr>
                  <td>View solution</td>
                  <td>Colour picker on the right</td>
                </tr>
              </tbody>
            </table>
          </>}
        />
        <Accordion
          summary={<>View Mode <i className='fas fa-angle-right fa-fw' /> Save</>}
          details={<>
            <p>Saves the maze as an .mznp file.</p>
          </>}
        />
        <Accordion
          summary={<>View Mode <i className='fas fa-angle-right fa-fw' /> Export Image</>}
          details={<>
            <p>Exports the maze and its solutions as .png files.</p>
          </>}
        />
        <Accordion
          summary={<>View Mode <i className='fas fa-angle-right fa-fw' /> Reset Focus</>}
          details={<>
            <p>Move the camera to the starting point. This has no effect on the resulting maze.</p>
          </>}
        />
        <Accordion
          summary={<>View Mode <i className='fas fa-angle-right fa-fw' /> Help</>}
          details={<>
            <p>Toggles this panel. This has no effect on the resulting maze.</p>
          </>}
        />
      </div>
    )
  }
}

export default HelpBar;
