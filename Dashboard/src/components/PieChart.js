import React, { Component } from 'react'
import { Pie } from 'react-chartjs-2'
import { Header, Card } from 'semantic-ui-react'


export class PieChart extends Component {
  constructor(props) {
    super()
    this.state = {
      data: {}
    }
  }

  formatDataYear(term, termData, decade) {
    const years = Object.keys(termData)
    let result = []
    years.map(year => {
      if (year.toString().substr(0, 3) === decade)
        if (termData[year]['subgenero']) {
          result = result.concat(termData[year]['subgenero'])
        }
      return year
    })
    let resultSorted = result.sort(function (first, second) {
      var a = first[0];
      var b = second[0];
      if (a > b) {
        return 1;
      } else if (a < b) {
        return -1;
      } else {
        return 0;
      }
    });
    let endResult = []
    if (resultSorted.length > 1) {
      resultSorted = resultSorted.reduce((a, b) => {
        if (a[0] === b[0]) {
          return [
            a[0],
            (a[1] + b[1])
          ]
        }
        endResult.push(a)
        return b
      })
    }
    endResult.push(resultSorted || [])
    endResult = endResult.sort((a,b) => {
      return a[1] < b[1]
    })
    return endResult.slice(0,5)
  }

  getData(props) {
    const termData = props.data[props.term]
    const year = props.year
    const decade = year.toString().substr(0, 3)
    const data1 = this.formatDataYear(props.term, termData, decade)
    let labels = []
    let formattedData = []
    data1.map(data => {
      labels.push(data[0])
      formattedData.push(data[1])
      return data
    })
    let data = {}
    data.labels = labels
    let dataset = [{}]
    dataset[0].data = formattedData
    dataset[0].backgroundColor = [
      '#FF6384',
      '#36A2EB',
      '#FFCE56',
      '#77dd77',
      '#63ffde'
    ]
    dataset[0].hoverBackgroundColor = [
      '#FF6384',
      '#36A2EB',
      '#FFCE56',
      '#77dd77',
      '#63ffde'
    ]
    data.datasets = dataset
    this.setState({
      data,
    })
  }


  componentWillReceiveProps(nextProps){
    this.getData(nextProps)
  }

  render() {
    return (
      <Card centered fluid>
        <Card.Content>
          <Card.Header>
            <Header>
              Subgêneros do {this.props.term} em {this.props.year} (nº de músicas)
            </Header>
          </Card.Header>
        </Card.Content>
        <Card.Content>
          <Pie data={this.state.data} width={100} height={30}  />
        </Card.Content>
      </Card>
    )
  }
} 