import React, {Component} from 'react';
import styled from 'styled-components';
import GoogleMapReact from 'google-map-react';
import {get} from 'lodash';

import logo from './assets/logo.svg';
import {COLORS} from './styles/variables';
import Drone from './components/Drone';
import Parcel from './components/Parcel';
import Pin from './components/Pin';
import {
    getDronesAndParcels,
    parseDroneInfo,
    parseParcelInfo,
    parseDroneTeamColor,
    parseScores,
} from './services/drone.service';
import {
    GAME_PARAMETERS,
} from './constants';

const AppContainer = styled.div`
    text-align: center;
    padding: 0 40px;
    .App-logo {
      height: 40px;
    }

    .App-header {
      display: flex;
      flex: 1 1 950px;
      height: 60px;
      padding-top: 20px;
      padding-bottom: 20px;
      color: #333;
    }

    .App-title {
      font-size: 1.5em;
    }

    .App-intro {
      font-size: large;
    }
`;

const Section = styled.div`
  display: flex;
  flex: 1 1 auto;
  justify-content: center;
  align-items: flex-start;
`;

const Actions = Section.extend`
  height: 50px;
`;

const GoogleMapContainer = styled.div`
  display: flex;
  flex: 1 1 950px;
  overflow: hidden;
  height: 600px;
  border-radius: 15px;
`;

const DroneContainer = styled.div`
  div {  
    svg {
      width: ${GAME_PARAMETERS.drone};
      height: ${GAME_PARAMETERS.drone};
      fill: ${(props) => COLORS[parseDroneTeamColor(props.teamId)]};
      filter: drop-shadow(2px 4px 4px rgba(0,0,0,0.8));
    }
  }
`;

const ScoreItem = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 50px;
  font-size: 30px;
  font-weight: bold;
  color: ${(props) => COLORS[parseDroneTeamColor(props.teamId)]};
  border: 1px solid ${(props) => COLORS[parseDroneTeamColor(props.teamId)]};
  border-left: 20px solid ${(props) => COLORS[parseDroneTeamColor(props.teamId)]};
  border-radius: 5px;
`;

const ScoresContainer = styled.div`
  display: flex;
  flex: 0 1 200px;
  flex-flow: column nowrap;
  align-items: flex-start;
  //background: deepskyblue;
  padding: 0 15px;
  ${ScoreItem}:not(:last-of-type) {
    margin-bottom: 10px;
  }
`;

const ParcelContainer = styled.div`
  div {  
    svg {
      width: ${GAME_PARAMETERS.parcel};
      height: ${GAME_PARAMETERS.parcel};
      fill: ${(props) => COLORS[parseDroneTeamColor(props.teamId)]};
      filter: drop-shadow(2px 4px 3px rgba(0,0,0,0.8));
    }
  }
`;

const PinContainer = styled.div`
  div {  
    svg {
      width: ${GAME_PARAMETERS.pin};
      height: ${GAME_PARAMETERS.pin};
      fill: ${(props) => COLORS[parseDroneTeamColor(props.teamId)]};
      filter: drop-shadow(2px 6px 4px rgba(0,0,0,0.8));
    }
  }
`;

const CounterBubble = styled.div`
  position: relative;
  color: #fff;
  font-weight: bold;
  font-size: 12px;
  padding: 2px;
  //border: #fff solid 1px;
  margin-top: -45px;
  background: ${(props) => COLORS[parseDroneTeamColor(props.teamId)]};
  &:before {
    position: absolute;
    top: -23px;
    left: 50px;
    width: 0; 
    height: 0; 
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-bottom: 5px solid ${(props) => COLORS[parseDroneTeamColor(props.teamId)]};
    z-index: 200;
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
  ${PinContainer} {
    position: absolute;
    top: calc(-${GAME_PARAMETERS.pin} / 2);
    left: calc(-${GAME_PARAMETERS.pin} / 2);
  }
`;

class App extends Component {
    static defaultProps = {
        ...GAME_PARAMETERS.map,
        markers: [
            {lat: 53.42728, lng: -6.24357},
            {lat: 43.681583, lng: -79.61146}
        ],
    };

    constructor() {
        super();
        this.state = {
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
            const {drones, parcels} = await getDronesAndParcels();
            this.updateDrones({drones, parcels});
        }, this.props.speed);
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

    updateDrones = ({drones, parcels}) => {
        const dronesNext = parseDroneInfo(drones || []);
        const parcelsNext = parcels ? parseParcelInfo(parcels) : [];
        this.setState({
            drones: dronesNext,
            parcels: parcelsNext,
        }, console.log(this.state));
    };

    // renderPolylines(map, maps) {
    //     /** Example of rendering geodesic polyline */
    //     let geodesicPolyline = new maps.Polyline({
    //         path: this.props.markers,
    //         geodesic: true,
    //         strokeColor: '#00a1e1',
    //         strokeOpacity: 1.0,
    //         strokeWeight: 4
    //     })
    //     geodesicPolyline.setMap(map)
    //
    //     /** Example of rendering non geodesic polyline (straight line) */
    //     let nonGeodesicPolyline = new maps.Polyline({
    //         path: this.props.markers,
    //         geodesic: false,
    //         strokeColor: '#e4e4e4',
    //         strokeOpacity: 0.7,
    //         strokeWeight: 3
    //     })
    //     nonGeodesicPolyline.setMap(map)
    //
    //     this.fitBounds(map, maps)
    // }
    //
    // fitBounds(map, maps) {
    //     var bounds = new maps.LatLngBounds()
    //     for (let marker of this.props.markers) {
    //         bounds.extend(
    //             new maps.LatLng(marker.lat, marker.lng)
    //         )
    //     }
    //     map.fitBounds(bounds)
    // }

    renderDrone(drone) {
        if (drone.latitude && drone.longitude) {
            return (
                <CustomMapElement
                    key={drone.teamId}
                    lat={drone.latitude}
                    lng={drone.longitude}
                    text={`${drone.teamId} is moving`}
                >
                    <DroneContainer {...drone} >
                        <Drone/>
                        {this.renderDroneParcelsCounter(drone)}
                    </DroneContainer>
                </CustomMapElement>
            )
        }
    }

    renderDroneParcelsCounter(drone) {
        return (
            drone.parcels &&
            drone.parcels.length > 0 &&
            <CounterBubble {...drone}>
                {drone.parcels.length}
            </CounterBubble>
        );
    }

    renderParcelScoreCounter(parcel) {
        return (
            parcel.score &&
            <CounterBubble {...parcel}>
                {parcel.score}
            </CounterBubble>
        );
    }

    renderParcel(parcel, index) {
        const {location, teamId} = parcel;
        return (
            <CustomMapElement
                key={`parcel-${teamId}-${index}`}
                lat={get(location, 'pickup.latitude')}
                lng={get(location, 'pickup.longitude')}
            >
                <ParcelContainer {...parcel}>
                    <Parcel/>
                </ParcelContainer>
            </CustomMapElement>
        );
    }

    renderDeliveryPin(parcel, index) {
        const {location, teamId, status} = parcel;
        return (
            status && status === 'grabbed' &&
            <CustomMapElement
                key={`delivery-pin-${teamId}-${index}`}
                lat={get(location, 'delivery.latitude')}
                lng={get(location, 'delivery.longitude')}
            >
                <PinContainer teamId={teamId}>
                    <Pin/>
                    {this.renderParcelScoreCounter(parcel)}
                </PinContainer>
            </CustomMapElement>
        );
    }

    renderBoundaries() {
        return this.props.pinBoundaries.map((pin, index) => (
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
            <AppContainer>
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
                            // onGoogleApiLoaded={({map, maps}) => this.renderPolylines(map, maps)}
                        >
                            {this.state.drones.map((drone) => this.renderDrone(drone))}
                            {this.state.parcels.map((parcel, index) => [
                                    this.renderParcel(parcel, index),
                                    this.renderDeliveryPin(parcel, index)
                                ]
                            )}
                            {this.props.showBoundaries ? this.renderBoundaries() : null}
                        </GoogleMapReact>
                    </GoogleMapContainer>
                    <ScoresContainer>
                        {parseScores(this.state.drones).map((drone, index) => (
                            <ScoreItem {...drone}>
                                {drone.score}
                            </ScoreItem>
                        ))}
                    </ScoresContainer>
                </Section>
                {/*
                <Actions>
                  <button onClick={this.stopDrone}>Stop</button>
                  <button onClick={this.startDrone}>Start</button>
                </Actions>
                */}
            </AppContainer>
        );
    }
}

export default App;
