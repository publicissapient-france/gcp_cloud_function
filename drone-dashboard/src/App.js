import React, {Component} from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import styled from 'styled-components';
import {get} from 'lodash';

import logo from './assets/logo.svg';
import { Admin } from './containers/Admin';
import { GameDashboard } from './containers/GameDashboard';
import {
    getDronesAndParcels,
    parseDroneInfo,
    parseParcelInfo,
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
      padding-top: 30px;
      padding-bottom: 20px;
    }

    .App-title {
      color: #2C374A;
      font-size: 1.5em;
    }

    .App-intro {
      font-size: large;
    }
`;

class App extends Component {
    static defaultProps = {
        ...GAME_PARAMETERS,
        // data for polyline test
        // markers: [
        //     {lat: 53.42728, lng: -6.24357},
        //     {lat: 43.681583, lng: -79.61146}
        // ],
    };

    render() {
        return (
            <Router>
                <AppContainer>
                    <header className="App-header">
                        <img src={logo} className="App-logo" alt="logo"/>
                        <h1 className="App-title">Google Cloud Functions ‡ DDD (drones dash delivery)</h1>
                    </header>
                    <Route
                        exact path="/"
                        component={GameDashboard}
                    />
                    <Route exact path="/admin" component={Admin} />
                </AppContainer>
            </Router>
        );
    }
}

export default App;


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
