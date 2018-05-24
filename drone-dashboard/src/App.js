import React, { Component } from 'react';
import styled from 'styled-components';
import GoogleMapReact from 'google-map-react';

import logo from './assets/logo.svg';
import './App.css';
import Drone from './components/Drone';

const constants = {
  step: 0.0004,
  speed: 3000,
  drone: '20px',
  map: {
    center: {
      lat: 48.86,
      lng: 2.340,
    },
    zoom: 13,
  },
  boundaries: {
    minLatitude: 48.816000,
    maxLatitude: 48.900000,
    minLongitude: 2.25000,
    maxLongitude: 2.42000,
  },
  operators: ['-', '+'],
};
const getRandomFloat = (min, max) => Math.random() * (max - min) + min;
const getRandomInteger = (min, max) => Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + 1)) + Math.ceil(min);
const getRandomColor = () => `hsla(${Math.random() * 360}, 100%, 42%, 1)`;
const getRandomOperator = () => constants.operators[getRandomInteger(0,1)]

const createDrones = (quantity) => Array
  .from(Array(quantity).keys())
  .map((value) => (
    {
      id: value,
      latitude: getRandomFloat(constants.boundaries.minLatitude, constants.boundaries.maxLatitude),
      longitude: getRandomFloat(constants.boundaries.minLongitude, constants.boundaries.maxLongitude),
      color: getRandomColor(),
      latitudeOperator: getRandomOperator(),
      longitudeOperator: getRandomOperator(),
    }
  ))

const Section = styled.div`
  display: flex;
  flex: 1 1 auto;
  justify-content: center;
  align-items: center;
`;

const Actions = Section.extend`
  height: 50px;
`;

const GoogleMapContainer = styled.div`
  height: 600px;
  width: 950px;
`;

const DroneContainer = styled.div`
  div {  
    svg {
      width: ${constants.drone};
      height: ${constants.drone};
      fill: ${(props) => props.color};
    }
  }
`;

const MyDrone = styled.div`
  position: relative;
  width: 4px;
  height: 4px;
  ${DroneContainer} {
    position: absolute;
    top: calc(-${constants.drone} / 2);
    left: calc(-${constants.drone} / 2);
  }
`;

class App extends Component {
  static defaultProps = {
    ...constants.map,
  };

  constructor() {
    super()
    this.state = {
      drone: {
        latitude: 48.855047,
        longitude: 2.348426,
      },
      drones: createDrones(3),
    };
  }

  componentDidMount() {
    this.startDrone();
  }

  startDrone = () => {
    this.timer = setInterval(() => {
      this.moveDrones();
    }, constants.speed);
  }

  moveDrones() {
    const updatedDrones = this.state.drones.map((drone) => {
      return {
        ...drone,
        latitude: eval(`${drone.latitude} ${drone.latitudeOperator} ${constants.step} * ${getRandomFloat(1.5, 2)}`),
        longitude: eval(`${drone.longitude} ${drone.longitudeOperator} ${constants.step} * ${getRandomFloat(1.5, 2)}`),
      }
    });
    this.setState({
      drones: updatedDrones,
    });
  }

  stopDrone = () => {
    clearInterval(this.timer);
  }

  renderDrones() {
    return this.state.drones.map((drone) =>
      <MyDrone
        key={drone.id}
        lat={drone.latitude}
        lng={drone.longitude}
        text={`${drone.id} is moving`}
      >
        <DroneContainer {...drone} >
          <Drone />
        </DroneContainer>
      </MyDrone>
    );
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Google Functions drones race</h1>
        </header>
        <Section>
          <GoogleMapContainer>
            <GoogleMapReact
              bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_MAP_KEY}}
              defaultCenter={this.props.center}
              defaultZoom={this.props.zoom}
            >
              { this.renderDrones() }
            </GoogleMapReact>
          </GoogleMapContainer>
        </Section>
        <Actions>
          <button onClick={this.stopDrone}>Stop</button>
          <button onClick={this.startDrone}>Start</button>
        </Actions>
      </div>
    );
  }
}

export default App;
