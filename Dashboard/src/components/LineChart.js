import React, { Component } from 'react'
import { Line } from 'react-chartjs-2'
import { Header, Card } from 'semantic-ui-react'


export class LineChart extends Component {
  constructor(props){
    super()
    this.state = {
      data: {}
    }
  }

  createData(term, termData) {
    const decades = [
      '196',
      '197',
      '198',
      '199',
      '200'
    ]
    let data = []
    while (data.push([]) < 5);
    Object.keys(termData).map(year => {
      const decade = year.substr(0, 3)
      const index = decades.indexOf(decade)
      if (index != -1) {
        data[index].push(termData[year]['avg_duration'])
      }
    })
    data = data.map(year => {
      return year.filter(a => {
        return a != null
      })
    })
    data = data.map(year => {
      if (year.length > 1) {
        const sum = year.reduce((a, b) => {
          return a + b
        })
        return parseFloat((sum / year.length).toFixed(2))
      }
      return 0
    })
    return data
  }

  getData(props) {
    const term1Data = props.data[props.term1]
    const term2Data = props.data[props.term2]
    let data = {}
    data.labels = ['1960', '1970', '1980', '1990', '2000'],
      data.datasets = []
    let dataset1 = {
      label: props.term1,
      fill: false,
      lineTension: 0.1,
      backgroundColor: 'rgba(75,192,192,0.4)',
      borderColor: 'rgba(75,192,192,1)',
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBorderColor: 'rgba(75,192,192,1)',
      pointBackgroundColor: '#fff',
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: 'rgba(75,192,192,1)',
      pointHoverBorderColor: 'rgba(220,220,220,1)',
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
    }
    dataset1.data = this.createData(props.term1, term1Data)
    data.datasets.push(dataset1)
    let dataset2 = {
      label: props.term2,
      fill: false,
      lineTension: 0.1,
      backgroundColor: 'rgba(192,75,75,0.4)',
      borderColor: 'rgba(192,75,75,1)',
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBorderColor: 'rgba(192,75,75,1)',
      pointBackgroundColor: '#fff',
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: 'rgba(192,75,75,1)',
      pointHoverBorderColor: 'rgba(220,220,220,1)',
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
    }
    dataset2.data = this.createData(props.term2, term2Data)
    data.datasets.push(dataset2)
    return data
  }

  componentWillReceiveProps(nextProps) {
    const data = this.getData(nextProps)
    this.setState({
      data: data
    })
  }

  render() {
    return (
      <Card centered fluid>
        <Card.Content>
          <Card.Header>
            <Header>
              Duração média por década
            </Header>
          </Card.Header>
        </Card.Content>
        <Card.Content>
          <Line data={this.state.data} width={500} height={300} />
        </Card.Content>
      </Card>
    )
  }
} 