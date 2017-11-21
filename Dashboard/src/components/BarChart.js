import React, { Component } from 'react'
import { Bar } from 'react-chartjs-2'
import { Header, Card} from 'semantic-ui-react'

export class BarChart extends Component {
  constructor(props) {
    super()
    this.state = {
      data: {}
    }
  }

  createData(term, termData){
    const decades = [
      '196',
      '197',
      '198',
      '199',
      '200'
    ]
    let data = []
    while(data.push([]) < 5);
    Object.keys(termData).map(year => {
      const decade = year.substr(0,3)
      const index = decades.indexOf(decade)
      if (index != -1){
        data[index].push(termData[year]['avg_loudness'])
      }
    })
    data = data.map(year => {
      return year.filter(a => {
        return a != null
      })
    })
    data = data.map(year => {
      if (year.length > 1){
        const sum = year.reduce((a, b) => {
          return a + b
        })
        return parseFloat((sum / year.length).toFixed(2)) * -1
      }
      return 0
    }) 
    return data
  }

  getData(props){
    const term1Data = props.data[props.term1]
    const term2Data = props.data[props.term2]
    let data = {}
    data.labels = ['1960', '1970', '1980', '1990', '2000'],
    data.datasets = []
    let dataset1 = {
      label : props.term1,
      backgroundColor: 'rgba(99,255,222,0.2)',
      borderColor: 'rgba(99,255,222,1)',
      borderWidth: 1,
      hoverBackgroundColor: 'rgba(99,255,222,0.4)',
      hoverBorderColor: 'rgba(99,255,222,1)',
    }
    dataset1.data = this.createData(props.term1, term1Data)
    data.datasets.push(dataset1)
    let dataset2 = {
      label: props.term2,
      backgroundColor: 'rgba(255,99,132,0.2)',
      borderColor: 'rgba(255,99,132,1)',
      borderWidth: 1,
      hoverBackgroundColor: 'rgba(255,99,132,0.4)',
      hoverBorderColor: 'rgba(255,99,132,1)',
    }
    dataset2.data = this.createData(props.term2, term2Data)
    data.datasets.push(dataset2)
    return data
  }

  componentWillReceiveProps(nextProps){
    const data = this.getData(nextProps)
    this.setState({
      data : data
    })
  }

  render() {
    return (
      <Card centered fluid>
        <Card.Content>
          <Card.Header>
            <Header>
              Loudness médio por década
            </Header>
          </Card.Header>
        </Card.Content>
        <Card.Content>
          <Bar
            data={this.state.data}
            width={500}
            height={300}
          />
        </Card.Content>
      </Card>
    )
  }
} 