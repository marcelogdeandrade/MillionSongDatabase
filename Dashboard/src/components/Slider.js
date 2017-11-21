import React, { Component } from 'react'
import { Header } from 'semantic-ui-react'
import Slider, { Range } from 'rc-slider';
import 'rc-slider/assets/index.css';

const marks = {
  1960: '1960',
  1970: '1970',
  1980: '1980',
  1990: '1990',
  2000: '2000'
};

export class SlideBar extends Component {
  constructor(props) {
    super()
  }

  render() {
    return (
      <div>
        <Header as='h2'> Década </Header>
        <Slider
          min={1960}
          max={2000}
          step={10}
          dots
          marks={marks}
          onChange={this.props.valueChange}
         />
      </div>
    )
  }
} 