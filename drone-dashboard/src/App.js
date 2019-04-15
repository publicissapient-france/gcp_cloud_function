import React, {Component} from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import styled from 'styled-components';
import {get} from 'lodash';

import logo from './assets/logo.svg';
import { Admin } from './containers/Admin';
import { GameDashboard } from './containers/GameDashboard';
import {
    GAME_PARAMETERS,
} from './constants';

const AppContainer = styled.div`
    text-align: center;
    padding: 0 10px 0 15px;
    .App-logo {
      height: 40px;
    }

    .App-header {
      display: flex;
      flex: 1 1 950px;
      //height: 60px;
      //padding-top: 30px;
      //padding-bottom: 20px;
      height: 20px;
      //padding-top: 30px;
      //padding-bottom: 20px;
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
        console.log('DOCKER', process.env.REACT_APP_BUILD)
        console.log('KEY', process.env.REACT_APP_GOOGLE_MAP_KEY)
        return (
            <Router>
                <AppContainer>
                    <header className="App-header">
                        {/*<img src={logo} className="App-logo" alt="logo"/>*/}
                        {/*<h1 className="App-title">Google Cloud Functions ‡ DDD (drones dash delivery) - beta</h1>*/}
                    </header>
                    <Switch>
                        <Route
                            exact path="/"
                            component={GameDashboard}
                            build={process.env.REACT_APP_BUILD}
                        />
                        <Route
                            exact path="/admin"
                            component={Admin}
                        />
                    </Switch>
                </AppContainer>
            </Router>
        );
    }
}


// { process.env.REACT_APP_BUILD === 'admin'
//     ? <Route
//         exact path="/admin"
//         component={Admin}
//     />
//     : null
// }

export default App;
