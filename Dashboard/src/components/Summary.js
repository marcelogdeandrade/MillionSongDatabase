import React, { Component } from 'react'
import { Card, Statistic, Dropdown } from 'semantic-ui-react'
import _ from 'underscore'

export class Summary extends Component {
  constructor(props) {
    super()
    this.state = {
      value : props.defaultValue,
      options: [],
      numSongs: 0,
      avgDuration: 0,
      avgTempo: 0,
      avgLoudness: 0
    }
  }

  getOptions(props){
    const terms = Object.keys(props.data)
    const options = terms.map(term => {
      return {
        text: term,
        value : term
      }
    })
    this.setState({
      options: options
    })
  }

  componentWillReceiveProps(nextProps, value){
    if (_.isEmpty(value)){
      value = nextProps.defaultValue
    }
    this.getOptions(nextProps)
    this.getData(nextProps, value)

  }

  handleChange = (e, { value }) => {
    this.setState({ value: value }) 
    this.props.changeTerm(this.props.stateName, value)  
    this.componentWillReceiveProps(this.props, value)
  }

  getData(props, value){
    const termData = props.data[value]
    let numSongs = 0
    let avgDuration = 0
    let avgTempo = 0
    let avgLoudness = 0
    if (termData){
      const keys = Object.keys(termData)
      keys.map(year => {
        const data = termData[year]
        numSongs += data['num_songs'] || 0
        avgDuration += data['avg_duration'] || 0
        avgTempo += data['avg_tempo'] || 0
        avgLoudness += data['avg_loudness'] || 0
        return year
      })
      avgDuration = (avgDuration / keys.length).toFixed(2)
      avgTempo = (avgTempo / keys.length).toFixed(2)
      avgLoudness = (avgLoudness / keys.length).toFixed(2)
      this.setState({
        numSongs: numSongs,
        avgDuration: avgDuration,
        avgTempo: avgTempo,
        avgLoudness: avgLoudness
      })
    }
  }
  
  render() {
    return (
      <Card centered fluid raised>
        <Card.Content>
          <Card.Header>
            <Dropdown 
              options={this.state.options}
              value={this.state.value}
              onChange={this.handleChange}
            />
        </Card.Header>
        </Card.Content>
        <Card.Content>
          <Statistic color='red' size='mini'>
            <Statistic.Label>Número de músicas</Statistic.Label>
            <Statistic.Value>{this.state.numSongs}</Statistic.Value>
          </Statistic>
          <Statistic color='orange' size='mini'>
            <Statistic.Label>Duração média(s)</Statistic.Label>
            <Statistic.Value>{this.state.avgDuration}</Statistic.Value>
          </Statistic>
          <Statistic color='blue' size='mini'>
            <Statistic.Label>Frequência média(bpm)</Statistic.Label>
            <Statistic.Value>{this.state.avgTempo}</Statistic.Value>
          </Statistic>
          <Statistic color='green'size='mini'>
            <Statistic.Label>Loudness médio</Statistic.Label>
            <Statistic.Value>{this.state.avgLoudness}</Statistic.Value>
          </Statistic>
        </Card.Content>
      </Card>
    )
  }
}