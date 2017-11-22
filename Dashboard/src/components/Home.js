import React, { Component } from 'react'
import {Grid, Image, Segment, Header, Icon, Container } from 'semantic-ui-react'
import { LineChart } from './LineChart'
import { BarChart } from './BarChart'
import { PieChart } from './PieChart'
import { SlideBar } from './Slider'
import { Summary } from './Summary'
import { WorldMapChart } from './WorldMap'
import $ from 'jquery'

// JSON GRANDE = https://api.myjson.com/bins/m6pg7
// JSON PEQUENO = https://api.myjson.com/bins/181akv

class Home extends Component {
  constructor(props){
    super()
    this.state = {
      year:  1960,
      term1 : 'pop',
      term2: 'rock'
    }
    this.sliderChange = this.sliderChange.bind(this)
    this.changeState = this.changeState.bind(this)
  }
  sliderChange(value){
    this.setState({
      year : value
    })
  }

  readData(){
    const component = this
    $.getJSON('https://api.myjson.com/bins/m6pg7', function (data) {
      component.setState({
        data: data
      })
    })
  }

  componentDidMount(){
    this.readData()
  }

  changeState(state, value){
    this.setState({
      [state]: value
    })
  }


  render() {
    const data = this.state.data || {}
    return (
      <div>
      <Segment clearing>
          <Header as='h2' textAlign='center'>
            Million Song
        </Header>
      </Segment>
        <Grid>
          {/* Primeira linha */}
          <Grid.Row>
            <Grid.Column width={8} textAlign='center' stretched>
              <Summary
                data = {data}
                stateName = 'term1'
                defaultValue = {this.state.term1}
                changeTerm = {this.changeState}
              />
            </Grid.Column>
            <Grid.Column width={8} verticalAlign='middle' textAlign='center'>
              <Summary
                data = {data}
                stateName='term2'
                defaultValue = {this.state.term2}
                changeTerm = {this.changeState}
              />
            </Grid.Column>
          </Grid.Row>

          {/* Segunda linha */}
          <Grid.Row>
            <Grid.Column width={4} verticalAlign='middle' textAlign='center'>
              <BarChart 
                data = {data}
                term1 = {this.state.term1}
                term2 = {this.state.term2}
              />
            </Grid.Column>
            <Grid.Column width={8}>
              <Grid>
                <Grid.Row>
                  <Grid.Column width={16} verticalAlign='middle' textAlign='center'>
                    <SlideBar
                      valueChange = {this.sliderChange}
                    />
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                  <Grid.Column width={16} verticalAlign='middle' textAlign='center'>
                    <WorldMapChart
                      term1 = {this.state.term1}
                      term2 = {this.state.term2}
                      data = {data}
                      year = {this.state.year}
                    />
=                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Grid.Column>
            <Grid.Column width={4} verticalAlign='middle' textAlign='center'>
              <LineChart 
                data={data}
                term1={this.state.term1}
                term2={this.state.term2}
              />
            </Grid.Column>
          </Grid.Row>

          {/* Terceira linha */}
          <Grid.Row centered>
            <Grid.Column width={8} verticalAlign='middle' textAlign='center'>
              <PieChart 
                data={data}
                term={this.state.term1}
                year={this.state.year}
              />
            </Grid.Column>
            <Grid.Column width={8} verticalAlign='middle' textAlign='center'>
              <PieChart
                data={data}
                term={this.state.term2}
                year={this.state.year}
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>

      </div>
    )
  }
}


export default Home
