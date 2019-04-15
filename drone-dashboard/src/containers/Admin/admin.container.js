import React, {Component} from 'react';
import styled from 'styled-components';
import {get, orderBy, groupBy, flatten, some, isEmpty, find, forEach, omit} from 'lodash';
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
    PARCEL_TYPES,
    PARCEL_SCORES,
    GAME_STATE,
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
} from '../../services/data.service';
import {
    getTeamsReadyForNextStep,
    updateValidatedTeams,
    getUpdatedTeamGameState,
    createStepLevel,
    speechService,
} from '../../services/game.service';
import {
    mockedData_step_1,
} from '../../mockedDroneAndParcels';
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
  &:not(:last-of-type) {
    margin-bottom: 10px;
  }
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
  cursor: pointer;
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
  & > button:not(:first-child) {
    margin-left: 10px;
  }
`;

const ResultLine = styled(Line)`
  display: flex;
  flex: 1 1 auto;
  flex-flow: row wrap;
  justify-content: center;
  align-items: stretch;
`;

const ResultContainer = styled.div`
  //max-height: 350px;
  //overflow: auto;
  ${ResultLine} {
    padding: 0;
  }
`;

const Form = styled.div`
  display: flex;
  flex-flow: column;
  align-items: center;
  padding: 10px;
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
  flex-flow: column wrap;
  justify-content: center;
  align-items: center;
  color: #fff;
  font-size: .5rem;
  height: 30px;
  width: 120px;
  border-radius: 10px;
  background: ${(props) => COLORS[parseDroneTeamColor(props.teamId, props.type)]};
  padding: 5px;
  &:not(:last-of-type){
    margin-right: 5px;
    margin-bottom: 5px;
  }
  strong {
    font-size: 1.2rem;
    font-weight: bold;
  }
  div {
    display: flex;
    flex: 1 1 auto;
  }
`;

const Parcel = styled(Team)`
  height: auto;
  width: auto;
  &:not(:last-of-type){
    margin-right: 0;
    margin-bottom: 4px;
  }
  &.grabbed {
    border: greenyellow 2px dotted;
  }
`;

const Column = styled.div`
  display: flex;
  flex: 0 1 45px;
  flex-flow: column nowrap;
  justify-content: stretch;
  &:not(:last-of-type){
    margin-right: 4px;
  }
`;

const ColumnHeader = styled(Team)`
  height: 10px;
  width: auto;
`;

export class Admin extends Component {
    static defaultProps = {
        ...GAME_PARAMETERS,
    };

    constructor() {
        super();
        this.state = {
            numberOfTeamsMax: 10,
            numberOfTeamsMin: 3,
            numberOfTeams: 3,
            savedTeams: [],
            targetTeam: 'each',
            savedParcels: [],
            parcelScore: 'random',
            parcelType: PARCEL_TYPES.CLASSIC,
            numberOfParcelsPerTeam: 1,
            gameState: GAME_STATE.STOPPED.label,
            gameStepTeams: {},
            gameStep: GAME_STATE.STOPPED.level,
        };
        this.startingBBox = {};
        this.startingPoints = [];
        // this.parcelsBBox = {};
        this.numberOfParcels = 0;
        this.step = 0;
    }

    componentDidMount() {
        this.initUpdater();
    }

    componentWillUnmount() {
        clearInterval(this.timer);
    }

    initUpdater = async () => {
        this.timer = setInterval(async () => {
            const dronesAndParcels = await getDronesAndParcels();
            // const dronesAndParcels = await Promise.resolve(mockedData_step_1);
            await this.updateGame(dronesAndParcels || {drones: [], parcels: []});
        }, this.props.speed);
    };

    log(message, key) {
        const messageKey = key || 'state';
        this.props.logLevel && this.props.logLevel === 'debug' && console.log(messageKey, message || this.state);
    }

    updateGameTeams = async ({ teamsByStep, teamsNext, parcelsNext }) => {
        let updatedTeamsByStep = {...teamsByStep};
        this.step = this.state.gameStep || 0;
        if (updatedTeamsByStep[undefined] && updatedTeamsByStep[undefined].length) {
            updatedTeamsByStep[GAME_STATE.STARTED.label] = updatedTeamsByStep[undefined].map(team => getUpdatedTeamGameState({ team, gameStep: GAME_STATE.STARTED.label}));
            delete updatedTeamsByStep[undefined];
        }
        await forEach(updatedTeamsByStep, async (teams, gameStep) => {
            const readyForNextStepTeams = getTeamsReadyForNextStep({
                teams: updatedTeamsByStep[GAME_STATE[gameStep].label],
                parcels: parcelsNext,
                gameStep,
            });
            await teams.forEach(async (team) => {
                this.log(readyForNextStepTeams, `readyForNextStepTeams ${GAME_STATE[gameStep].label} - ${team.teamId})}`);
                const teamNext = find(teamsNext, { id: team.id});
                if (
                    GAME_STATE[gameStep] &&
                    GAME_STATE[gameStep].level >= 0
                ) {
                    let gameLevel = GAME_STATE[gameStep].level;
                    this.step = this.step && this.step > gameLevel ? this.step : gameLevel;
                    if (
                            GAME_STATE[gameStep].label === GAME_STATE.STARTED.label ||
                            (readyForNextStepTeams && some(readyForNextStepTeams, {teamId: team.teamId}))
                    ) {
                        createStepLevel[GAME_STATE[gameStep].level](this.createParcels, team);
                        const nextGameLevel = GAME_STATE[`STEP_${gameLevel + 1}`] ? gameLevel + 1 : 1000000;
                        this.log(`next level ${nextGameLevel} for team ${team.teamId}`)
                        team.gameStep = (find(GAME_STATE, { level: nextGameLevel }) || GAME_STATE.STOPPED).label;
                        this.step = this.step && this.step > nextGameLevel ? this.step : nextGameLevel;
                    }
                }
                updatedTeamsByStep[gameStep] = [
                    ...updatedTeamsByStep[gameStep],
                    ...{
                        ...team,
                        ...teamNext,
                    },
                ];
            });
        });
        this.log(updatedTeamsByStep, 'updatedTeamsByStep');
        return updatedTeamsByStep;
    }

    updateGame = async ({drones, parcels}) => {
        const teamsNext = parseDroneInfo(drones || []);
        const parcelsNext = parcels ? parseParcelInfo(parcels) : [];
        const newNumberOfTeamsMax = this.props.maxTeams > teamsNext.length
            ? this.props.maxTeams - teamsNext.length
            : 0;
        const newNumberOfTeamsMin = newNumberOfTeamsMax === 0
            ? 0
            : newNumberOfTeamsMax > 0
            ? 1
            : this.state.numberOfTeamsMin;

        this.log(this.state.gameState, 'GAME STATE');
        this.log(teamsNext, 'droneNext')
        let gameStepTeamsNext = groupBy(teamsNext, 'gameStep');
        const gameTeams = flatten(Object.values(this.state.gameStepTeams));
        this.log(gameTeams, 'gameTeams');
        let nextGameStepTeams = this.state.gameStepTeams && !isEmpty(this.state.gameStepTeams) ? groupBy(gameTeams, 'gameStep') : {};
        this.log(nextGameStepTeams, 'nextGameStepTeams')
        let gameStepTeams = nextGameStepTeams && !isEmpty(nextGameStepTeams) ? nextGameStepTeams : gameStepTeamsNext;
        switch (this.state.gameState) {
            case GAME_STATE.STARTED.label:
                gameStepTeams = await this.updateGameTeams({
                    teamsByStep: gameStepTeams,
                    teamsNext,
                    parcelsNext,
                });
                break;
            case GAME_STATE.PAUSED.label:
            default:
                break;
        }
        this.setState({
            savedTeams: teamsNext,
            savedParcels: parcelsNext,
            numberOfTeamsMax: newNumberOfTeamsMax,
            numberOfTeamsMin: newNumberOfTeamsMin,
            numberOfActiveTeams: teamsNext.length,
            numberOfTeams: (
                newNumberOfTeamsMax >= this.state.numberOfTeams
                || this.state.numberOfTeams <= newNumberOfTeamsMin
                    ? this.state.numberOfTeams
                    : newNumberOfTeamsMin
            ),
            gameStepTeams,
            gameStep: this.step,
        }, this.log);
    };

    handleFormChange = (inputId, event) => {
        event.preventDefault();
        this.setState({
            [inputId]: event.target.value,
        });
    };

    handleFormChangeInt = (inputId, event) => {
        event.preventDefault();
        this.setState({
            [inputId]: parseInt(event.target.value, 10),
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

    async resetTeams(teamIds) {
        teamIds = teamIds || this.state.savedTeams;
        const teams = teamIds.map(team => ({
            teamId: team.teamId,
            location: {
                latitude: this.props.center.lat,
                longitude: this.props.center.lng,
            },
            command: {
                name: 'MOVE',
                location: {
                    latitude: this.props.center.lat,
                    longitude: this.props.center.lng,
                },
            },
            parcels: [],
            distancePerTick: 0.3,
            score: 0,
        }));
        await postDroneInfo(teams);
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
        // console.log('teams', teams);
        await postDroneInfo(teams);
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
    getScore({ type, score }) {
        if (type === PARCEL_TYPES.CLASSIC) {
            return (score || this.state.parcelScore) === 'random' ? getRadomScore() : score || this.state.parcelScore;
        }
        if (type === PARCEL_TYPES.SPEED_BOOST) {
            return this.props.speedBoostValue;
        }
    };

    getTeamId = ({ type, index, teamId }) => teamId !== 'each' ? teamId : get(this.state, `savedTeams[${index}].teamId`);

    getPickupLocation({ type = PARCEL_TYPES.CLASSIC }) {
        let pickupLng;
        const pickupZoneMin = type === PARCEL_TYPES.CLASSIC ? 'inner' : 'middle';
        const pickupZoneMax = type === PARCEL_TYPES.CLASSIC ? 'middle' : 'outer';
        const pickupLat1 = getRandomFloat(this.props.outerBoundariesMinMax.minLatitude, this.props.outerBoundariesMinMax.maxLatitude);
        const pickupLat2 = getRandomFloat(this.props.outerBoundariesMinMax.minLatitude, this.props.outerBoundariesMinMax.maxLatitude);
        const pickupLat = [pickupLat1, pickupLat2][chance.integer({min: 0, max: 1})];

        if (type === PARCEL_TYPES.CLASSIC) {
            if (this.isLatitudeInInnerZone(pickupLat)) {
                const pickupLngMin = getRandomFloat(this.props[`${pickupZoneMax}BoundariesMinMax`].minLongitude, this.props[`${pickupZoneMin}BoundariesMinMax`].minLongitude);
                const pickupLngMax = getRandomFloat(this.props[`${pickupZoneMin}BoundariesMinMax`].maxLongitude, this.props[`${pickupZoneMax}BoundariesMinMax`].maxLongitude);
                pickupLng = [pickupLngMin, pickupLngMax][chance.integer({min: 0, max: 1})];
            } else {
                pickupLng = getRandomFloat(this.props[`${pickupZoneMax}BoundariesMinMax`].minLongitude, this.props[`${pickupZoneMax}BoundariesMinMax`].maxLongitude);
            }
        }
        if (type === PARCEL_TYPES.SPEED_BOOST) {
            const pickupLngMin = getRandomFloat(this.props[`${pickupZoneMax}BoundariesMinMax`].minLongitude, this.props[`${pickupZoneMin}BoundariesMinMax`].minLongitude);
            const pickupLngMax = getRandomFloat(this.props[`${pickupZoneMin}BoundariesMinMax`].maxLongitude, this.props[`${pickupZoneMax}BoundariesMinMax`].maxLongitude);
            pickupLng = [pickupLngMin, pickupLngMax][chance.integer({min: 0, max: 1})];
        }
        return {
            pickupLat,
            pickupLng,
        }
    }

    isLatitudeInInnerZone(latitude) {
        return (
            this.props.innerBoundariesMinMax.maxLatitude >= latitude
            && latitude >= this.props.innerBoundariesMinMax.minLatitude
        );
    }

    createParcels = async ({ type, targetTeam, score }) => {
        const finalType = type || this.state.parcelType;
        this.numberOfTeams = (targetTeam || this.state.targetTeam) === 'each'
            ? this.state.savedTeams.length
            : 1;
        const parcelsIterate = Array.from(Array(this.numberOfTeams || 1));
        const parcels = parcelsIterate.map((value, index) => {
            const parcelsPerTeamNumber = parseInt(this.state.numberOfParcelsPerTeam, 10) > 0 ? parseInt(this.state.numberOfParcelsPerTeam, 10) : 1;
            const parcelPerTeamIterate = Array.from(Array(parcelsPerTeamNumber));
            const parcelsPerTeam = parcelPerTeamIterate.map(() => {
                const { pickupLat, pickupLng } = this.getPickupLocation({ type: finalType });

                const newParcel = {
                    parcelId: uuid.v4(),
                    teamId: this.getTeamId({ type: finalType, index, teamId: targetTeam || this.state.targetTeam }),
                    score: this.getScore({ type: finalType, score }),
                    status: STATUS.AVAILABLE,
                    type: finalType,
                    location: {
                        pickup: {
                            latitude: pickupLat,
                            longitude: pickupLng,
                        },
                    },
                };

                let deliveryLat;
                let deliveryLng;
                if (finalType === PARCEL_TYPES.CLASSIC) {
                    deliveryLat = getRandomFloat(this.props.innerBoundariesMinMax.minLatitude, this.props.innerBoundariesMinMax.maxLatitude);
                    deliveryLng = getRandomFloat(this.props.innerBoundariesMinMax.minLongitude, this.props.innerBoundariesMinMax.maxLongitude);
                    newParcel.location.delivery = {
                        latitude: deliveryLat,
                        longitude: deliveryLng,
                    };
                }

                return newParcel;
            });
            if (parcels && parcels.length) {
                parcels.forEach(parcel => {
                    if (parcel.teamId === 'all') {
                        switch (parcel.type) {
                            case PARCEL_TYPES.SPEED_BOOST:
                                speechService.speech({
                                    text: `Bonus speed boost parcel will drop soon!`,
                                });
                                break;
                            case PARCEL_TYPES.CLASSIC:
                                speechService.speech({
                                    text: `Bonus points parcel will drop soon!`,
                                });
                                break;
                            default:
                                break;
                        }
                    }
                })
            }
            return flatten(parcelsPerTeam);
        });
        // console.log('createParcels', parcels);
        await postParcel(flatten(parcels));
    }

    changeGameState = async (gameState = GAME_STATE.STOPPED.label) => {
        if (gameState === GAME_STATE.STARTED.label) {
            speechService.speech({
                text: `Let's the game begin!!`,
            });
        }
        this.setState({ gameState });
    }

    renderTeams() {
        return (
            this.state.savedTeams &&
            this.state.savedTeams.length > 0 &&
            this.state.savedTeams.map(team => (
                <Team
                    key={team.teamId}
                    {...team}
                >
                    <strong>{team.teamId}</strong>
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
        const groupedParcels = groupBy(sortedParcels, 'teamId');
        return (
            !isEmpty(groupedParcels) &&
            Object.values(groupedParcels).map((teamParcels, teamIndex) => {
                const orderedParcels = orderBy(teamParcels, ['status', 'score'], ['asc']);
                const parcelWithTeamId = teamParcels.find(parcel => parcel.teamId !== 'all');
                const teamIdColumn = parcelWithTeamId ? parcelWithTeamId.teamId : 'all';
                return (
                    <Column key={teamIndex}>
                        <ColumnHeader teamId={teamIdColumn} />
                        { orderedParcels.length > 0 &&
                            orderedParcels.map((parcel, index) => {
                            return (
                                parcel.teamId
                                    ? <Parcel
                                        key={`parcel-${parcel.teamId}-${index}`}
                                        className={parcel.status && parcel.status === STATUS.AVAILABLE ? 'available' : 'grabbed' }
                                        {...parcel}
                                    >
                                        <div>
                                            <strong>{parcel.score}</strong>
                                        </div>
                                        <div>
                                            {parcel.status}
                                        </div>
                                    </Parcel>
                                    : null
                            );
                        })}
                    </Column>
                );
            })
        );
    }

    // TODO Clear drones and parcels button
    // TODO Save start, stop and team level in local Storage
    // TODO Do animation on dashboard start (hide map and score, start bouton that start's all)
    // TODO Move Title on top of leader board and grow map size
    render() {
        return (
            <AdminContainer>
                <h1>
                    Admin
                    {/*<Button onClick={this.getData}>Refresh</Button>*/}
                </h1>
                <FormsContainer>
                    <Form id="initGame">
                        <Line>
                            <h3>Init game</h3>
                        </Line>
                        <Line>
                            {this.state.gameState !== GAME_STATE.STARTED.label
                                ? <Button type="button" onClick={() => this.changeGameState(GAME_STATE.STARTED.label)}>
                                    Start game
                                </Button>
                                : null
                            }
                            {this.state.gameState === GAME_STATE.STARTED.label
                                ? <Button type="button" onClick={() => this.changeGameState(GAME_STATE.PAUSED.label)}>
                                    Pause game
                                </Button>
                                : null
                            }
                        </Line>
                        <Line>
                            {this.state.gameState === GAME_STATE.STARTED.label
                                ? <Button type="button" onClick={() => this.changeGameState(GAME_STATE.STOPPED.label)}>
                                    Stop game
                                </Button>
                                : null
                            }
                        </Line>
                        <Line>
                            <strong>{this.state.numberOfActiveTeams || '0'} teams active</strong><br />
                        </Line>
                        <Line>
                            Game: {this.state.gameState}
                        </Line>
                        <Line>
                            Level: {this.state.gameStep}
                        </Line>
                        <Line>
                            <Button type="button" onClick={() => this.resetTeams()} style={{color: 'red'}}>
                                <b>Reset game</b>
                            </Button>
                        </Line>
                    </Form>
                    <Form id="initTeams">
                        <Line>
                            <h3>Init teams</h3>
                            {'-   '}
                            <strong>{this.state.numberOfActiveTeams || '0'} teams active</strong>
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
                                    onChange={this.handleFormChangeInt.bind(this, 'numberOfTeams')}
                                />
                            </label>
                            <Button type="button" onClick={this.submitInitTeams}>
                                Create teams
                            </Button>
                        </Line>
                        <ResultLine>
                            {this.renderTeams()}
                        </ResultLine>
                    </Form>
                </FormsContainer>
                <FormsContainer>
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
                                    <option value="each">each</option>
                                    {this.renderTeamsList()}
                                </Select>
                            </label>
                            <label>
                                Score:{' '}
                                <Select
                                    id="parcelScore"
                                    value={this.state.parcelScore}
                                    onChange={this.handleFormChangeInt.bind(this, 'parcelScore')}
                                >
                                    {Object.values(PARCEL_SCORES).map((score, index) => (
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
                                Type:{' '}
                                <Select
                                    id="parcelType"
                                    value={this.state.parcelType}
                                    onChange={this.handleFormChange.bind(this, 'parcelType')}
                                >
                                    {Object.values(PARCEL_TYPES).map((type, index) => (
                                        <option
                                            key={`type-${index}`}
                                            value={type}
                                        >
                                            {type}
                                        </option>
                                    ))}
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
                            <Button type="button" onClick={() => this.createParcels({})}>
                                Generate parcels
                            </Button>
                        </Line>
                        <ResultContainer>
                            <ResultLine>
                                {this.renderParcels()}
                            </ResultLine>
                        </ResultContainer>
                    </Form>
                </FormsContainer>
            </AdminContainer>
        )
    }
}

export default Admin;
