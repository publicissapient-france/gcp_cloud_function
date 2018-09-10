import React, {Component} from 'react';
import styled from 'styled-components';
import {get, orderBy, flatten} from 'lodash';
import Chance from 'chance';
import uuid from 'uuid';
import {
    along,
    bbox,
    coordAll,
    getCoord,
    buffer,
    point,
    randomPoint,
    featureCollection,
    polygonToLine,
    pointOnFeature,
} from '@turf/turf';

import {
    GAME_PARAMETERS,
    TEAMS,
    STATUS,
    PARCEL_SCORES
} from '../../constants';
import {COLORS} from '../../styles/variables';
import {
    getDronesAndParcels,
    getRandomFloat,
    getRandomInteger,
    getRadomScore,
    parseDroneInfo,
    parseDroneTeamColor,
    parseDroneTeamId,
    parseParcelInfo,
    postDroneInfo,
    postParcel,
} from '../../services/drone.service';
const chance = new Chance();

const AdminContainer = styled.div`
  display: flex;
  flex: 1 1 auto;
  justify-content: center;
  align-items: center;
  flex-flow: column wrap;
  h1 {
    display: flex;
    height: 50px;
    justify-content: center;
    align-items: center;
    margin: 0;
    margin-bottom: 10px;
    button {
      margin-left: 10px;
    }
  }
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
  flex-flow: row wrap;
  justify-content: center;
  align-items: center;
  max-height: 350px;
  overflow: scroll;
`;

const Form = styled.div`
  display: flex;
  flex-flow: column;
  align-items: center;
  padding: 20px;
  margin-left: 10px;
  margin-right: 10px;
  border: #333333 1px solid;
  &#initTeams {
    flex: 1 1 30%;
  }
  &#initParcels {
    flex: 1 1 70%;
  }
  label {
    &:not(:first-of-type) {
      margin-left: 10px;
    }
  }
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
  &:not(:last-of-type){
    margin-right: 5px;
    margin-bottom: 5px;
  }
`;

const Parcel = styled(Team)`
  width: 150px;
`;

export class Admin extends Component {
    static defaultProps = {
        ...GAME_PARAMETERS,
    };

    constructor() {
        super();
        this.state = {
            // savedTeams: [
            //     {
            //         "teamId": "blue-622",
            //         "location": {
            //             "latitude": 48.83503446744604,
            //             "longitude": 2.36116207743742
            //         },
            //         "parcels": [],
            //         "score": 0
            //     },
            //     {
            //         "teamId": "red-647",
            //         "location": {
            //             "latitude": 48.88089191757057,
            //             "longitude": 2.360009874973255
            //         },
            //         "parcels": [],
            //         "score": 0
            //     },
            //     {
            //         "teamId": "green-876",
            //         "location": {
            //             "latitude": 48.84003457564094,
            //             "longitude": 2.3170768545494402
            //         },
            //         "parcels": [],
            //         "score": 0
            //     },
            //     {
            //         "teamId": "orange-471",
            //         "location": {
            //             "latitude": 48.83988817014468,
            //             "longitude": 2.315606566387995
            //         },
            //         "parcels": [],
            //         "score": 0
            //     },
            //     {
            //         "teamId": "purple-339",
            //         "location": {
            //             "latitude": 48.87984385267196,
            //             "longitude": 2.355004483481937
            //         },
            //         "parcels": [],
            //         "score": 0
            //     },
            //     {
            //         "teamId": "black-667",
            //         "location": {
            //             "latitude": 48.865904849256,
            //             "longitude": 2.353661017140987
            //         },
            //         "parcels": [],
            //         "score": 0
            //     },
            //     {
            //         "teamId": "grey-642",
            //         "location": {
            //             "latitude": 48.87870635390388,
            //             "longitude": 2.343786525898337
            //         },
            //         "parcels": [],
            //         "score": 0
            //     }
            // ],
            numberOfTeamsMax: 10,
            numberOfTeamsMin: 3,
            numberOfTeams: 3,
            savedTeams: [],
            targetTeam: 'all',
            savedParcels: [],
            parcelScore: 'random',
            numberOfParcelsPerTeam: 1,
        };
        this.startingBBox = {};
        this.startingPoints = [];
        // this.parcelsBBox = {};
        this.numberOfParcels = 0;
    }

    componentDidMount() {
        this.getData();
    }

    getData = async () => {
        const dronesAndParcels = await getDronesAndParcels();
        const { drones, parcels } = dronesAndParcels || {drones: [], parcels: []};
        const dronesNext = parseDroneInfo(drones || []);
        const parcelsNext = parcels ? parseParcelInfo(parcels) : [];
        const newNumberOfTeamsMax = (this.state.numberOfTeamsMax - dronesNext.length) > 0 ? (this.state.numberOfTeamsMax - dronesNext.length) : 0;
        const newNumberOfTeamsMin = newNumberOfTeamsMax > this.state.numberOfTeamsMin ? this.state.numberOfTeamsMin : newNumberOfTeamsMax;
        this.setState({
            savedTeams: dronesNext,
            savedParcels: parcelsNext,
            numberOfTeamsMax: newNumberOfTeamsMax,
            numberOfTeamsMin: newNumberOfTeamsMin,
            numberOfTeams: newNumberOfTeamsMin,
        }, console.log(this.state));
    };

    handleFormChange = (inputId, event) => {
        event.preventDefault();
        this.setState({
            [inputId]: event.target.value,
        });
    };

    // admin teams
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
        let usedIds = this.state.savedTeams.map(team => parseDroneTeamId(team.teamId));
        let usedColors = this.state.savedTeams.map(team => parseDroneTeamColor(team.teamId));
        const teamsIterate = Array.from(Array(parseInt(this.state.numberOfTeams, 10)));
        const teams = teamsIterate.map((value, index) => {
            let id;
            let color;
            let goodId = null;
            let goodColor = null;
            while (!goodId) {
                id = this.generateTeamId();
                goodId = usedIds.some(usedId => usedId === id) ? null : id;
            }
            while (!goodColor) {
                color = TEAMS[chance.integer({min: 0, max: TEAMS.length -1})];
                goodColor = usedColors.some(usedColor => usedColor === color) ? null : color;
            }
            usedColors = [
                ...usedColors,
                goodColor,
            ];
            usedIds = [
                ...usedIds,
                goodId,
            ];
            const lat = this.startingPoints[index][0] || this.props.center.lat;
            const lng = this.startingPoints[index][1] || this.props.center.lng;
            return {
                teamId: `${color}-${id}`,
                location: {
                    latitude: lat,
                    longitude: lng,
                },
                parcels: [],
                score: 0,
            }
        });
        console.log('teams', teams);
        await postDroneInfo(teams);
        this.getData();
    }

    submitInitTeams = (event) => {
        event.preventDefault();
        this.createTeams();
    };

    // Other generating method for drones POC
    // this.startingLine = polygonToLine(startingBuffer);
    // const teamsIterate = Array.from(Array(parseInt(this.state.numberOfTeams, 10)));
    // this.startingPoints = teamsIterate.map(() => {
    //     // return pointOnFeature(this.startingLine);
    //     return getCoord(along(this.startingLine, getRandomFloat(1,4), {units: 'kilometers'}));
    // });
    
    // admin parcels
    async createParcels() {
        this.numberOfParcels = this.state.targetTeam === 'all' ? this.state.savedTeams.length : 1;
        const parcelsIterate = Array.from(Array(this.numberOfParcels || 1));
        const parcels = parcelsIterate.map((value, index) => {
            const parcelsPerTeamNumber = parseInt(this.state.numberOfParcelsPerTeam, 10) > 0 ? parseInt(this.state.numberOfParcelsPerTeam, 10) : 1;
            const parcelPerTeamIterate = Array.from(Array(parcelsPerTeamNumber));
            const parcelsPerTeam = parcelPerTeamIterate.map(() => {
                const pickupLatMax = getRandomFloat(GAME_PARAMETERS.innerBoundariesMinMax.maxLatitude, GAME_PARAMETERS.outerBoundariesMinMax.maxLatitude);
                const pickupLatMin = getRandomFloat(GAME_PARAMETERS.outerBoundariesMinMax.minLatitude, GAME_PARAMETERS.innerBoundariesMinMax.minLatitude);
                const pickupLat = [pickupLatMin, pickupLatMax];
                const pickupLngMax = getRandomFloat(GAME_PARAMETERS.innerBoundariesMinMax.maxLongitude, GAME_PARAMETERS.outerBoundariesMinMax.maxLongitude);
                const pickupLngMin = getRandomFloat(GAME_PARAMETERS.outerBoundariesMinMax.minLongitude, GAME_PARAMETERS.innerBoundariesMinMax.minLongitude);
                const pickupLng = [pickupLngMin, pickupLngMax];

                const deliveryLat = getRandomFloat(GAME_PARAMETERS.innerBoundariesMinMax.minLatitude, GAME_PARAMETERS.innerBoundariesMinMax.maxLatitude);
                const deliveryLng = getRandomFloat(GAME_PARAMETERS.innerBoundariesMinMax.minLongitude, GAME_PARAMETERS.innerBoundariesMinMax.maxLongitude);
                return {
                    parcelId: uuid.v4(),
                    teamId: this.numberOfParcels === 1 ? this.state.targetTeam : get(this.state, `savedTeams[${index}].teamId`),
                    score: this.state.parcelScore === 'random' ? getRadomScore() : parseInt(this.state.parcelScore, 10),
                    status: STATUS.AVAILABLE,
                    location: {
                        pickup: {
                            latitude: pickupLat[chance.integer({min: 0, max: 1})],
                            longitude: pickupLng[chance.integer({min: 0, max: 1})],
                        },
                        delivery: {
                            latitude: deliveryLat,
                            longitude: deliveryLng,
                        },
                    },
                };
            });
            return flatten(parcelsPerTeam);
        });
        console.log('createParcels', parcels);
        await postParcel(flatten(parcels));
        this.getData();
    }

    submitInitParcels = (event) => {
        event.preventDefault();
        this.createParcels();
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
                    value={team.teamId}
                >
                    {team.teamId}
                </option>
            ))
        );
    }

    renderParcels() {
        const sortedParcels = (
            this.state.savedParcels && this.state.savedParcels.length > 0
                ? orderBy(this.state.savedParcels, ['teamId'], ['asc'])
                : []
        );
        return (
            sortedParcels.length > 0 &&
            sortedParcels.map((parcel, index) => {
                return (
                    parcel.teamId ?
                    <Parcel
                        key={`parcel-${parcel.teamId}-${index}`}
                        {...parcel}
                    >
                        {parcel.score} - {parcel.status}
                    </Parcel>
                    : null
                );
            })
        );
    }

    // TODO Clear drones and parcels button
    // TODO Order parcels in columns by teamId
    // TODO Other game play
    // FIXME max and min teams is buggy
    render() {
        return (
            <AdminContainer>
                <h1>
                    Admin
                    <Button onClick={this.getData}>Refresh</Button>
                </h1>
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
                                    min={this.state.numberOfTeamsMin}
                                    max={this.state.numberOfTeamsMax}
                                    value={this.state.numberOfTeams}
                                    onChange={this.handleFormChange.bind(this, 'numberOfTeams')}
                                />
                            </label>
                        </Line>
                        <Line>
                            <Button type="button" onClick={this.submitInitTeams}>
                                Create teams
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
                                    id="targetTeam"
                                    value={this.state.targetTeam}
                                    onChange={this.handleFormChange.bind(this, 'targetTeam')}
                                >
                                    <option value="all">all</option>
                                    {this.renderTeamsList()}
                                </Select>
                            </label>
                            <label>
                                Score:{' '}
                                <Select
                                    id="parcelScore"
                                    value={this.state.parcelScore}
                                    onChange={this.handleFormChange.bind(this, 'parcelScore')}
                                >
                                    {PARCEL_SCORES.map((score, index) => (
                                        <option
                                            key={`score-${index}`}
                                            value={score}
                                        >
                                            {score}
                                        </option>
                                    ))}
                                    <option value="random">random</option>
                                </Select>
                            </label>
                            <label>
                                Number of parcels:{' '}
                                <Input
                                    id="numberOfParcelsPerTeam"
                                    type="number"
                                    min="1"
                                    max="5"
                                    value={this.state.numberOfParcelsPerTeam}
                                    onChange={this.handleFormChange.bind(this, 'numberOfParcelsPerTeam')}
                                />
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
