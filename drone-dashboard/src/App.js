import React, {Component} from 'react';
import styled from 'styled-components';
import GoogleMapReact from 'google-map-react';
import {get} from 'lodash';

import logo from './assets/logo.svg';
import './App.css';
import {COLORS} from './styles/variables';
import Drone from './components/Drone';
import Parcel from './components/Parcel';
import Pin from './components/Pin';
import {
    getDroneInfo,
    getParcelInfo,
    parseDroneInfo,
    parseParcelInfo,
    parseDroneTeamColor,
} from './services/drone.service';
import {
    GAME_PARAMETERS,
} from './constants';

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
  overflow: hidden;
  height: 600px;
  width: 950px;
  border-radius: 15px;
`;

const DroneContainer = styled.div`
  div {  
    svg {
      width: ${GAME_PARAMETERS.drone};
      height: ${GAME_PARAMETERS.drone};
      fill: ${(props) => COLORS[parseDroneTeamColor(props.color)]};
      filter: drop-shadow(2px 4px 4px rgba(0,0,0,0.8));
    }
  }
`;

const ParcelContainer = styled.div`
  div {  
    svg {
      width: ${GAME_PARAMETERS.parcel};
      height: ${GAME_PARAMETERS.parcel};
      fill: ${(props) => COLORS[parseDroneTeamColor(props.color)]};
      filter: drop-shadow(2px 4px 3px rgba(0,0,0,0.8));
    }
  }
`;

const PinContainer = styled.div`
  div {  
    svg {
      width: ${GAME_PARAMETERS.pin};
      height: ${GAME_PARAMETERS.pin};
      fill: ${COLORS['default']};
      filter: drop-shadow(2px 6px 4px rgba(0,0,0,0.8));
    }
  }
`;

const CustomMapElement = styled.div`
  position: relative;
  width: 4px;
  height: 4px;
  ${DroneContainer} {
    position: absolute;
    top: calc(-${GAME_PARAMETERS.drone} / 2);
    left: calc(-${GAME_PARAMETERS.drone} / 2);
  }
  ${ParcelContainer} {
    position: absolute;
    top: calc(-${GAME_PARAMETERS.parcel} / 2);
    left: calc(-${GAME_PARAMETERS.parcel} / 2);
  }
`;

class App extends Component {
    static defaultProps = {
        ...GAME_PARAMETERS.map,
    };

    constructor() {
        super();
        this.state = {
            // drone: {
            //     latitude: 48.855047,
            //     longitude: 2.348426,
            // },
            // drones: createDrones(3),
            drones: [],
            parcels: [],
        };
    }

    componentDidMount() {
        this.startDrone();
    }

    startDrone = () => {
        this.timer = setInterval(async () => {
            // this.moveDrones();
            const droneInfo = await getDroneInfo();
            const parcelInfo = await getParcelInfo();
            this.updateDrones({droneInfo, parcelInfo});
        }, GAME_PARAMETERS.speed);
    };

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

    updateDrones = ({droneInfo, parcelInfo}) => {
        const droneInfoNext = parseDroneInfo(droneInfo || []);
        // const droneInfoNext = parseDroneInfo({"blue":{"team":"blue","data":{"topic":{"url":"projects/modulom-moludom/topics/drone-events"}}},"red":{"team":"red","data":{"location":{"latitude":48.80621744882436,"longitude":2.1723810610753986}}},"yellow":{"team":"yellow","data":{"location":{"latitude":48.805173,"longitude":2.186636},"parcels":[],"topic":{"url":"projects/jbc-some-tests/topics/drone-events-receiver"},"score":300}}});
        const parcelInfoNext = parcelInfo ? parseParcelInfo(parcelInfo) : [];
        // const parcelInfoNext = [
        //     {"score":100,"teamId":"yellow","location":{"pickup":{"latitude":48.804986,"longitude":2.3088396},"delivery":{"longitude":2.171485,"latitude":48.806294}},"parcelId":"136e5a64-2050-4fa7-8cfc-72df26ca164d"},
        //     {"teamId":"yellow","location":{"pickup":{"latitude":48.810123,"longitude":2.190504},"delivery":{"latitude":48.806294,"longitude":2.171485}},"score":200,"parcelId":"481294fc-9cef-4143-9022-815b7777df2d"},
        //     {"teamId":"blue","location":{"pickup":{"latitude":1.1,"longitude":2.3},"delivery":{"latitude":12.1,"longitude":22.3}},"parcelId":"0a24e505-7b0f-4f00-967b-ac7dcdef95ab"},
        //     {"teamId":"blue","location":{"pickup":{"latitude":1.1,"longitude":2.3},"delivery":{"latitude":12.1,"longitude":22.3}},"parcelId":"46cf225a-8726-483c-a56e-284a6beac843"},
        // ];
        this.setState({
            drones: droneInfoNext,
            parcels: parcelInfoNext,
        }, console.log(this.state));
    };

    renderDrone(drone) {
        if (drone.latitude && drone.longitude) {
            return (
                <CustomMapElement
                    key={drone.id}
                    lat={drone.latitude}
                    lng={drone.longitude}
                    text={`${drone.id} is moving`}
                >
                    <DroneContainer {...drone} >
                        <Drone/>
                    </DroneContainer>
                </CustomMapElement>
            )
        }
    }

    renderParcel(parcel) {
        const {parcelId, location, teamId} = parcel;
        return (
            <CustomMapElement
                key={parcelId}
                lat={get(location, 'pickup.latitude')}
                lng={get(location, 'pickup.longitude')}
            >
                <ParcelContainer {...parcel} color={teamId}>
                    <Parcel/>
                </ParcelContainer>
            </CustomMapElement>
        );
    }

    renderBoundaries() {
        return GAME_PARAMETERS.pinBoundaries.map((pin, index) => (
            <CustomMapElement
                key={`boundary-${index}`}
                lat={get(pin, 'latitude')}
                lng={get(pin, 'longitude')}
            >
                <PinContainer>
                    <Pin/>
                </PinContainer>
            </CustomMapElement>
        ))
    }

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo"/>
                    <h1 className="App-title">Google Functions drones race</h1>
                </header>
                <Section>
                    <GoogleMapContainer>
                        <GoogleMapReact
                            bootstrapURLKeys={{key: process.env.REACT_APP_GOOGLE_MAP_KEY}}
                            defaultCenter={this.props.center}
                            defaultZoom={this.props.zoom}
                        >
                            {this.state.drones.map((drone) => this.renderDrone(drone))}
                            {this.state.parcels.map((parcel) => this.renderParcel(parcel))}
                            {this.renderBoundaries()}
                        </GoogleMapReact>
                    </GoogleMapContainer>
                </Section>
                {/*
        <Actions>
          <button onClick={this.stopDrone}>Stop</button>
          <button onClick={this.startDrone}>Start</button>
        </Actions>
        */}
            </div>
        );
    }
}

export default App;
