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
import {COLORS} from '../../styles/variables';
import {
    getRandomInteger,
    postDroneInfo,
    parseDroneTeamColor,
} from '../../services/drone.service';

const AdminContainer = styled.div`
  display: flex;
  flex: 1 1 auto;
  justify-content: center;
  align-items: center;
  flex-flow: column wrap;
`;

const FormsContainer = styled(AdminContainer)`
  width: 100%;
  flex-flow: row nowrap;
  align-items: flex-start;
`;

const Input = styled.input`
  height: 20px;
  border: #333333 1px dotted;
  border-radius: 3px;
`;

const Select = styled.select`
  height: 20px;
  border: #333333 1px dotted;
  padding: 10px;
`;

const Button = styled.button`
  height: 30px;
  min-width: 100px;
  border: #333333 1px solid;
`;

const Line = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1 1 auto;
  width: 100%;
  padding: 10px;
  h3 {
    margin: 0;
    padding: 0;
  }
`;

const ResultLine = styled(Line)`
  display: flex;
  flex: 1 1 auto;
  flex-flow: column wrap;
  justify-content: flex-start;
  align-items: center;
  max-height: 400px;
`;

const Form = styled.div`
  display: flex;
  flex: 0 1 70%;
  flex-flow: column;
  align-items: center;
  padding: 20px;
  margin-left: 10px;
  margin-rigth: 10px;
  border: #333333 1px solid;
`;

const Team = styled.div`
  display: flex;
  flex: 0 1 auto;
  justify-content: center;
  align-items: center;
  font-size: 1.2em;
  font-weight: bold;
  color: #fff;
  height: 30px;
  width: 100px;
  border-radius: 10px;
  background: ${(props) => COLORS[parseDroneTeamColor(props.teamId)]};
  padding: 5px;
  margin-bottom: 5px;
`;

export class Admin extends Component {
    static defaultProps = {
        ...GAME_PARAMETERS,
    };

    constructor() {
        super();
        this.state = {
            numberOfTeams: 3,
            savedTeams: [],
            savedTeamsMock: [
                {
                    "teamId": "blue-685",
                    "location": {
                        "latitude": 48.85053283676196,
                        "longitude": 2.3267119368814093
                    },
                    "parcels": [],
                    "score": 0
                },
                {
                    "teamId": "red-135",
                    "location": {
                        "latitude": 48.83455108760356,
                        "longitude": 2.3412614191237373
                    },
                    "parcels": [],
                    "score": 0
                },
                {
                    "teamId": "green-715",
                    "location": {
                        "latitude": 48.843957298798365,
                        "longitude": 2.3643594318767516
                    },
                    "parcels": [],
                    "score": 0
                }
            ],
            generateParcelForTeam: '',
        };
        this.startingBBox = {};
        this.startingPoints = [];
    }

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

    setTeamStartingPoints() {
        this.setStartingBBox();
        this.startingPoints = coordAll(randomPoint(this.state.numberOfTeams, {bbox: this.startingBBox}));
    }

    generateTeamId() {
        return getRandomInteger(1, 999);
    }

    async createTeams () {
        this.setTeamStartingPoints();
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
            const lat = this.startingPoints[index][0] || this.props.center.lat;
            const lng = this.startingPoints[index][1] || this.props.center.lng;
            if (this.state.numberOfTeams >= usedIds.length) {
                return {
                    teamId: `${teamColor}-${id}`,
                    location: {
                        latitude: lat,
                        longitude: lng,
                    },
                    parcels: [],
                    score: 0,
                }
            }
        });
        console.log('teams', teams);
        const savedTeams = await postDroneInfo(teams);
        this.setState({
            savedTeams,
        }, console.log('savedTeams',savedTeams));
    }

    submitInitTeams = (event) => {
        event.preventDefault();
        this.createTeams();
    };

    submitInitParcels = (event) => {
        event.preventDefault();
        console.log('generate parcels');
    };

    renderTeams() {
        return (
            this.state.savedTeams &&
            this.state.savedTeams.length > 0 &&
            this.state.savedTeams.map(team => (
                <Team
                    key={team.teamId}
                    {...team}
                >
                    {team.teamId}
                </Team>
            ))
        );
    }

    renderTeamsList() {
        return (
            this.state.savedTeams &&
            this.state.savedTeams.length > 0 &&
            this.state.savedTeams.map(team => (
                <option 
                    key={`option-${team.teamId}`}
                >
                    {team.teamId}
                </option>
            ))
        );
    }

    renderParcels() {
        // TODO
    }

    render() {
        return (
            <AdminContainer>
                <h1>Admin</h1>
                <FormsContainer>
                    <Form id="initTeams">
                        <Line>
                            <h3>Init teams</h3>
                        </Line>
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
                        <ResultLine>
                            {this.renderTeams()}
                        </ResultLine>
                    </Form>
                    <Form id="initParcels">
                        <Line>
                            <h3>Init parcels</h3>
                        </Line>
                        <Line>
                            <label>
                                Generate Parcels for:{' '}
                                <Select
                                    id="generateParcelForTeam"
                                    value={this.state.generateParcelForTeam}
                                    onChange={this.handleFormChange.bind(this, 'generateParcelForTeam')}
                                >
                                    <option value="all">all</option>
                                    {this.renderTeamsList()}
                                </Select>
                            </label>
                        </Line>
                        <Line>
                            <Button type="button" onClick={this.submitInitParcels}>
                                Generate parcels
                            </Button>
                        </Line>
                        <ResultLine>
                            {this.renderParcels()}
                        </ResultLine>
                    </Form>
                </FormsContainer>
            </AdminContainer>
        )
    }
}

export default Admin;
