import React, { Component } from 'react';
import styled from 'styled-components';
import GoogleMapReact from 'google-map-react';

import logo from './assets/logo.svg';
import './App.css';
import Drone from './components/Drone';
import {
  getDroneInfo,
  parseDroneInfo,
  // createDrones,
  // moveDrone,
} from './services/drone.service';
import { constants } from './constants';

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
      // drones: createDrones(3),
      drones: [],
    };
  }

  componentDidMount() {
    this.startDrone();
  }

  startDrone = () => {
    this.timer = setInterval(() => {
      // this.moveDrones();
      getDroneInfo()
        .then(this.updateDrones);
    }, constants.speed);
  }

  // moveDrones() {
  //   const updatedDrones = this.state.drones.map((drone) => {
  //     return moveDrone(drone);
  //   });
  //   this.setState({
  //     drones: updatedDrones,
  //   });
  // }
  //
  // stopDrone = () => {
  //   clearInterval(this.timer);
  // }

  updateDrones = (data) => {
    // console.log(JSON.stringify(data, null, 2));
    const updateInfo = parseDroneInfo(data);
    // console.log(updateInfo);
    this.setState({
      drones: updateInfo,
    });
  }

  renderDrone(drone) {
    if (drone.latitude && drone.longitude) {
      return (
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
      )
    }
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
              { this.state.drones.map((drone) => this.renderDrone(drone)) }
            </GoogleMapReact>
          </GoogleMapContainer>
        </Section>
        { /*
        <Actions>
          <button onClick={this.stopDrone}>Stop</button>
          <button onClick={this.startDrone}>Start</button>
        </Actions>
        */ }
      </div>
    );
  }
}

export default App;
