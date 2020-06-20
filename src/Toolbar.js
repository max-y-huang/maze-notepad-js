import React from 'react';
import { Button, Divider } from 'semantic-ui-react';

import stylesheet from './css/Toolbar.module.css';

import consts from './js/consts';

class Toolbar extends React.Component {

  setCanvasMode = (mode) => this.props.setCanvasModeFunc(mode);

  render() {
    return (
      <div className={stylesheet.wrapper}>
        <Button className={stylesheet.wrapper__item} basic size='huge' icon='wrench'
          color={this.props.canvasMode === consts.CREATE ? 'blue' : 'black'}
          onClick={() => this.setCanvasMode(consts.CREATE)}
        />
        <Button className={stylesheet.wrapper__item} basic size='huge' icon='pencil'
          color={this.props.canvasMode === consts.SOLVE ? 'blue' : 'black'}
          onClick={() => this.setCanvasMode(consts.SOLVE)}
        />
        <Divider />
        <Button className={stylesheet.wrapper__item} basic color='black' size='huge' icon='square' />
        <Button className={stylesheet.wrapper__item} basic color='black' size='huge' icon='map' />
        <Button className={stylesheet.wrapper__item} basic color='black' size='huge' icon='map marker alternate' />
        <Button className={stylesheet.wrapper__item} basic color='black' size='huge' icon='rocket' />
      </div>
    )
  }
}

export default Toolbar;
