import Bluebird from 'bluebird';
import axios from 'axios';
import {get} from 'lodash';
import { darken } from 'polished';
import Chance from 'chance';

import {COLORS} from '../styles/variables';
import {
    GAME_PARAMETERS,
    PARCEL_SCORES,
    PARCEL_CHANCES,
} from '../constants';
const chance = new Chance();

const mockData_02 = {"drones":[{"teamId":"blue","data":{"location":{"latitude":48.8653487,"longitude":2.3788396}}},{"teamId":"red","data":{"location":{"latitude":48.80621744882436,"longitude":2.1723810610753986}}},{"teamId":"yellow","data":{"command":{"location":{"latitude":48.806294,"longitude":2.171485},"name":"MOVE"},"parcels":[{"teamId":"yellow","status":"GRABBED","location":{"pickup":{"latitude":48.804986,"longitude":2.188315},"delivery":{"longitude":2.171485,"latitude":48.806294}},"parcelId":"136e5a64-2050-4fa7-8cfc-72df26ca164d","score":100},{"parcelId":"136e5a64-2050-4fa7-8cfc-72df26ca164d","score":100,"teamId":"yellow","status":"GRABBED","location":{"pickup":{"latitude":48.804986,"longitude":2.188315},"delivery":{"latitude":48.806294,"longitude":2.171485}}},{"parcelId":"136e5a64-2050-4fa7-8cfc-72df26ca164d","score":100,"teamId":"yellow","status":"GRABBED","location":{"pickup":{"latitude":48.804986,"longitude":2.188315},"delivery":{"latitude":48.806294,"longitude":2.171485}}}],"location":{"latitude":48.805543474568886,"longitude":2.181142036232819},"topicUrl":"projects/jbc-some-tests/topics/drone-events-topic"}}],"parcels":[{"parcelId":"136e5a64-2050-4fa7-8cfc-72df26ca164d","score":100,"teamId":"yellow","status":"GRABBED","location":{"pickup":{"latitude":48.804986,"longitude":2.188315},"delivery":{"longitude":2.171485,"latitude":48.806294}}},{"score":200,"teamId":"yellow","location":{"pickup":{"latitude":48.810123,"longitude":2.190504},"delivery":{"latitude":48.806294,"longitude":2.171485}}},{"teamId":"blue","location":{"pickup":{"latitude":48.8753487,"longitude":2.3088396},"delivery":{"latitude":48.85,"longitude":2.2}},"score":200}]};
const mockData_01 = {
    drones: [
        {
            teamId: 'blue',
            data: {
                location: {
                    longitude: 2.3788396,
                    latitude: 48.8653487,
                },
                topicUrl: 'projects/modulom-moludom/topics/drone-events',
                score: 300,
                parcels: [
                    {
                        score: 200,
                        teamId: 'blue',
                        location: {
                            pickup: {
                                longitude: 2.3088396,
                                latitude: 48.8753487,
                            },
                            delivery: {
                                longitude: 2.2,
                                latitude: 48.85,
                            },
                        },
                    },
                ],
            },
        },
        {
            teamId: 'red',
            data: {
                score: 300,
                command: {
                    name: 'MOVE',
                },
                topicUrl: 'some/topic',
                location: {
                    latitude: 48.80621744882436,
                    longitude: 2.1723810610753986,
                },
            },
        },
        {
            teamId: 'purple',
            data: {
                score: 150,
                location: {
                    latitude: 48.80621744882436,
                    longitude: 2.1723810610753986,
                },
            },
        },
        {
            teamId: 'green',
            data: {
                score: 300,
                location: {
                    latitude: 48.80621744882436,
                    longitude: 2.1723810610753986,
                },
            },
        },
        {
            teamId: 'pink',
            data: {
                location: {
                    latitude: 48.80621744882436,
                    longitude: 2.1723810610753986,
                },
                topicUrl: 'projects/jbc-some-tests/topics/drone-events-topic',
            },
        },
        {
            teamId: 'yellow',
            data: {
                score: 150000,
                command: {
                    name: 'READY_FAILED',
                },
                topicUrl: 'projects/jbc-some-tests/topics/drone-events-topic',
                location: {
                    latitude: 48.85621744882436,
                    longitude: 2.21723810610753986,
                },
            },
        },
    ],
    parcels: [
        {
            score: 100,
            teamId: 'yellow',
            location: {
                pickup: {
                    longitude: 2.188315,
                    latitude: 48.804986,
                },
                delivery: {
                    latitude: 48.806294,
                    longitude: 2.171485,
                },
            },
        },
        {
            teamId: 'yellow',
            location: {
                pickup: {
                    latitude: 48.810123,
                    longitude: 2.190504,
                },
                delivery: {
                    longitude: 2.171485,
                    latitude: 48.806294,
                },
            },
            score: 200,
        },
        {
            score: 20000,
            teamId: 'blue',
            location: {
                pickup: {
                    longitude: 2.3088396,
                    latitude: 48.8753487,
                },
                delivery: {
                    longitude: 2.2,
                    latitude: 48.85,
                },
            },
            status: 'GRABBED',
        },
    ],
};

export const getDronesAndParcels = async () => {
    try {
        const response = await fetch(
            GAME_PARAMETERS.droneStateListUrl,
            {
                method: 'GET',
                mode: 'cors',
            }
        );
        return await response.json();
        // return mockData_01;
        // return mockData_02;
    } catch (error) {
        console.log(error);
    }
};

export const parseScores = (scores) => scores.sort((a, b) => parseInt(a.score, 10) < parseInt(b.score, 10));

export const parseDroneInfo = (drones) => {
    return drones.map((drone = {}) => {
        let dronePosition = get(drone, 'data.location');
        let droneCommand = get(drone, 'data.command');
        let droneParcels = get(drone, 'data.parcels');
        let droneScore = get(drone, 'data.score');
        let droneTopicUrl = get(drone, 'data.topicUrl');
        const droneBase = {
            teamId: drone.teamId,
        };
        if (dronePosition) {
            dronePosition = {
                // TODO refactor drone-state-list to put all data. in root object
                latitude: drone.data.location.latitude,
                longitude: drone.data.location.longitude,
            };
        }
        return {
            ...droneBase,
            ...dronePosition,
            command: droneCommand,
            parcels: droneParcels,
            score: droneScore || 0,
            topicUrl: droneTopicUrl,
        };
    })
};

export const parseParcelInfo = (data) => data;

export const parseDroneTeamColor = (teamId) => (teamId || 'default').match(/-/g) ? teamId.split('-')[0].toLowerCase() : (teamId || 'default');
export const parseDroneTeamId = (teamId) => teamId.match(/-/g) ? parseInt(teamId.split('-')[1].toLowerCase(), 10) : parseInt(teamId, 10);
export const parseScoreColor = (props) => COLORS[props.failure || props.default ? 'grey' : parseDroneTeamColor(props.teamId)];
export const parseScoreBorderColor = (props) => props.failure || props.default ? darken(0.2, COLORS[parseDroneTeamColor(props.teamId)]) : COLORS[parseDroneTeamColor(props.teamId)];

export const postDroneInfo = async (droneInfoData) => {
    return Bluebird.each(droneInfoData, async (droneInfo) => {
        try {
            return await axios.post(GAME_PARAMETERS.droneHttpUpserterUrl, droneInfo);
        } catch (error) {
            console.log('Error while upserting droneInfo', error);
        }
    });
};

export const postParcel = async (parcelsData) => {
    return Bluebird.each(parcelsData, async (parcel) => {
        try {
            return await axios.post(GAME_PARAMETERS.parcelHttpUpserterUrl, parcel);
        } catch (error) {
            console.log('Error while upserting parcel', error);
        }
    });
};
/*****************************/
/** random drones generator **/
/*****************************/
export const getRandomFloat = (min, max) => Math.random() * (max - min) + min;
export const getRandomInteger = (min, max) => Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + 1)) + Math.ceil(min);
export const getRandomColor = () => `hsla(${Math.random() * 360}, 100%, 42%, 1)`;
export const getRandomOperator = () => GAME_PARAMETERS.operators[getRandomInteger(0, 1)];
export const getRadomScore = () => chance.weighted(PARCEL_SCORES, PARCEL_CHANCES);
// export const createDrones = (quantity) => Array
//     .from(Array(quantity).keys())
//     .map((value) => (
//         {
//             id: value,
//             latitude: getRandomFloat(GAME_PARAMETERS.boundaries.minLatitude, GAME_PARAMETERS.boundaries.maxLatitude),
//             longitude: getRandomFloat(GAME_PARAMETERS.boundaries.minLongitude, GAME_PARAMETERS.boundaries.maxLongitude),
//             color: getRandomColor(),
//             latitudeOperator: getRandomOperator(),
//             longitudeOperator: getRandomOperator(),
//         }
//     ));
//
// export const moveDrone = (drone) => {
//     return {
//         ...drone,
//         latitude: eval(`${drone.latitude} ${drone.latitudeOperator} ${GAME_PARAMETERS.step} * ${getRandomFloat(1.5, 2)}`),
//         longitude: eval(`${drone.longitude} ${drone.longitudeOperator} ${GAME_PARAMETERS.step} * ${getRandomFloat(1.5, 2)}`),
//     }
// };
