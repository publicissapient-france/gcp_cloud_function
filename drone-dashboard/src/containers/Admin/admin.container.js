import React, {Component} from 'react';
import styled from 'styled-components';
import {get} from 'lodash';
import {
    bbox,
    coordAll,
    buffer,
    point,
    randomPoint,
} from '@turf/turf';

import {
    GAME_PARAMETERS,
    TEAMS,
} from '../../constants';
import {getRandomInteger} from '../../services/drone.service';

const AdminContainer = styled.div`
  display: flex;
  flex: 1 1 auto;
  justify-content: center;
  align-items: center;
  flex-flow: column wrap;
`;

const Input = styled.input`
  height: 20px;
  border: #333333 1px dotted;
`;

const Button = styled.button`
  height: 30px;
  min-width: 100px;
  border: #333333 1px solid;
`;

const Line = styled.div`
  width: 100%;
  padding: 10px;
`;

export class Admin extends Component {
    static defaultProps = {
        ...GAME_PARAMETERS,
    };

    constructor() {
        super();
        this.state = {
            numberOfTeams: 3,
        };
        this.startingBBox = {};
        this.startingPoints = [];
    }

    submitInitTeams = (event) => {
        event.preventDefault();
        this.createTeams()
    };

    handleFormChange = (inputId, event) => {
        event.preventDefault();
        this.setState({
            [inputId]: event.target.value,
        });
    };

    setStartingBBox() {
        const center = point([this.props.center.lat, this.props.center.lng]);
        const distance = this.props.startingAreaDistance || 3;
        const options = {steps: 10, units: 'kilometers'};
        const startingBuffer = buffer(center, distance, options);
        this.startingBBox = bbox(startingBuffer);
    }

    setTeamStartingPoint() {
        this.setStartingBBox();
        this.startingPoints = coordAll(randomPoint(this.state.numberOfTeams, {bbox: this.startingBBox}));
        console.log(this.startingPoints);
    }

    generateTeamId() {
        return getRandomInteger(1, 999);
    }

    createTeams() {
        this.setTeamStartingPoint();
        let usedIds = [];
        const iterate = Array.from(Array(this.state.numberOfTeams));
        const teams = iterate.map((value, index) => {
            let id;
            let goodId = null;
            const teamColor = TEAMS[index];
            while (!goodId) {
                id = this.generateTeamId();
                goodId = usedIds.some(usedId => usedId === id) ? null : id;
            }
            usedIds = [
                ...usedIds,
                goodId,
            ];
            console.log(this.startingPoints, index)
            const lat = this.startingPoints[index][0] || this.props.center.lat;
            const lng = this.startingPoints[index][1] || this.props.center.lng;
            if (this.state.numberOfTeams >= usedIds.length) {
                return {
                    teamId: `${teamColor}-${id}`,
                    location: {
                        latitude: lat,
                        longitude: lng,
                    },
                }
            }
        });
        // TODO upsert drones
        console.log('teams', teams);
    }

    render() {
        return (
            <AdminContainer>
                <h1>Admin</h1>
                <div>
                    <form id="teamsInit">
                        <Line>
                            <label>
                                Number of teams:{' '}
                                <Input
                                    id="numberOfTeams"
                                    type="number"
                                    min="3" max="10"
                                    value={this.state.numberOfTeams}
                                    onChange={this.handleFormChange.bind(this, 'numberOfTeams')}
                                />
                            </label>
                        </Line>
                        <Line>
                            <Button type="button" onClick={this.submitInitTeams}>
                                Save
                            </Button>
                        </Line>
                    </form>
                </div>
            </AdminContainer>
        )
    }
}

export default Admin;
