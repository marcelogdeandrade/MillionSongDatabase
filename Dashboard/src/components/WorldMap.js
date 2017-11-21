import React, { Component } from "react"
import _ from 'underscore'

export class WorldMapChart extends Component {

  constructor(props){
    super()
    this.state = {
      data1 : [],
      data2 : []
    }
  }

  formatDataYear(term, termData, decade){
    const years = Object.keys(termData)
    let result = []
    years.map(year => {
      if(year.toString().substr(0,3) == decade)
        if (termData[year]['songs_country']){
          result = result.concat(termData[year]['songs_country'])
        }
    })
    let resultSorted = result.sort(function (first, second) {
      var a = first['code'];
      var b = second['code'];
      if (a > b) {
        return 1;
      } else if (a < b) {
        return -1;
      } else {
        return 0;
      }
    });
    const endResult = []
    if (resultSorted.length > 1){
      resultSorted = resultSorted.reduce((a, b) => {
        if (a['code'] == b['code']) {
          return {
            code: a['code'],
            z: a['z'] + b['z']
          }
        }
        endResult.push(a)
        return b
      })
    }
    endResult.push(resultSorted || [])
    return endResult
  }

  getData(props){
    const term1Data = props.data[props.term1]
    const term2Data = props.data[props.term2]
    const year = props.year
    const decade = year.toString().substr(0,3)
    const data1 = this.formatDataYear(props.term1, term1Data, decade)
    const data2 = this.formatDataYear(props.term2, term2Data, decade)
    this.setState({
      data1,
      data2
    })
    this.createMap(props.year, props.term1, props.term2, data1, data2)
    
  }

  componentDidMount(){
    if (!_.isEmpty(this.props.data)){
      this.getData(this.props)
      const data1 = this.state.data1
      const data2 = this.state.data2
      this.createMap(this.props.year, this.props.term1, this.props.term2, data1, data2)
    }
  }

  componentWillReceiveProps(nextProps){
    if (!_.isEmpty(nextProps.data)){
      this.getData(nextProps)
    }
  }

  createMap(year, term1, term2, data1, data2){
      // Correct UK to GB in data
      Highcharts.mapChart('container', {
        chart: {
          borderWidth: 1,
          map: 'custom/world'
        },

        title: {
          text: `Número de músicas por país em ${year}`
        },

        legend: {
          enabled: false
        },

        mapNavigation: {
          enabled: true,
          buttonOptions: {
            verticalAlign: 'bottom'
          }
        },      
        series: [{
          name: 'Países',
          color: '#E0E0E0',
          enableMouseTracking: false
        }, {
          type: 'mapbubble',
          name: `${term1}`,
          joinBy: ['iso-a2', 'code'],
          data: data1,
          minSize: 4,
          maxSize: '12%',
          tooltip: {
            pointFormat: '{point.code}: {point.z} músicas'
          },
        }, {
            type: 'mapbubble',
            name: `${term2}`,
            joinBy: ['iso-a2', 'code'],
            data: data2,
            minSize: 0,
            maxSize: '12%',
            tooltip: {
              pointFormat: '{point.code}: {point.z} músicas'
            },
          }
      ]
      });
  }
  render() {
    return (
      <div id="container" style={{"height": "500px", "minWidth": "310px", "maxWidth": "800px", "margin": "0 auto"}}></div>
    )
  }
}