import Bluebird from 'bluebird';
import axios from 'axios';
import {get} from 'lodash';
import {darken} from 'polished';
import Chance from 'chance';

import {COLORS} from '../styles/variables';
import {
    GAME_PARAMETERS,
    PARCEL_SCORES,
    PARCEL_CHANCES,
    PARCEL_TYPES,
} from '../constants';

const chance = new Chance();

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
    } catch (error) {
        console.log(error);
    }
};

export const parseScores = (scores) => scores.sort((a, b) => parseInt(a.score, 10) - parseInt(b.score, 10)).reverse();

export const parseDroneInfo = (drones) => {
    return drones.map((drone = {}) => {
        let dronePosition = get(drone, 'data.location');
        let droneCommand = get(drone, 'data.command');
        let droneParcels = get(drone, 'data.parcels');
        let droneScore = get(drone, 'data.score');
        let droneTopicUrl = get(drone, 'data.topicUrl');
        let droneDistancePerTick = get(drone, 'data.distancePerTick');
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
            score: droneScore || 0,
            topicUrl: droneTopicUrl,
            distancePerTick: droneDistancePerTick,
        };
    })
};

export const parseParcelInfo = (data) => data;

export const parseDroneTeamColor = (teamId, type) => {
    if (teamId === 'all') {
        return 'all';
    }
    if (teamId === 'all' && type === PARCEL_TYPES.SPEED_BOOST) {
        return 'speed';
    }
    if ((teamId || 'default').match(/-/g)) {
        return teamId.split('-')[0].toLowerCase();
    }
    return (teamId || 'default');
};
export const parseDroneTeamId = (teamId) => teamId.match(/-/g) ? parseInt(teamId.split('-')[1].toLowerCase(), 10) : parseInt(teamId, 10);
export const parseScoreColor = (props) => COLORS[props.failure || props.default ? 'grey' : parseDroneTeamColor(props.teamId)];
export const parseScoreBorderColor = (props) => props.failure || props.default ? darken(0.2, COLORS[parseDroneTeamColor(props.teamId)]) : COLORS[parseDroneTeamColor(props.teamId)];

export const postDroneInfo = async (droneInfoData) => {
    return Bluebird.each(droneInfoData, async (droneInfo) => {
        try {
            return await axios.post(GAME_PARAMETERS.droneHttpUpserterUrl, droneInfo, {crossDomain: true});
        } catch (error) {
            console.log('Error while upserting droneInfo', error);
        }
    });
};

export const postParcel = async (parcelsData) => {
    return Bluebird.each(parcelsData, async (parcel) => {
        try {
            return await axios.post(GAME_PARAMETERS.parcelHttpUpserterUrl, parcel, {crossdomain: true});
            // return await axios.post('http://localhost:9000', parcel);
        } catch (error) {
            console.log('Error while upserting parcel', error, 'status', error.statusCode );
            if (error.statusCode === 500) {
                return await axios.post(GAME_PARAMETERS.parcelHttpUpserterUrl, parcel, {crossDomain: true});
            }
        }
    });
};
export const clearParcels = async () => {
    try {
        return await axios.delete(GAME_PARAMETERS.parcelHttpUpserterUrl);
    } catch (error) {
        console.log('Error while deleting parcels', error);
    }
};

/*****************************/
/** random drones generator **/
/*****************************/
export const getRandomFloat = (min, max) => Math.random() * (max - min) + min;
export const getRandomInteger = (min, max) => Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + 1)) + Math.ceil(min);
export const getRandomColor = () => `hsla(${Math.random() * 360}, 100%, 42%, 1)`;
export const getRandomOperator = () => GAME_PARAMETERS.operators[getRandomInteger(0, 1)];
export const getRadomScore = () => chance.weighted(Object.values(PARCEL_SCORES), PARCEL_CHANCES);
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
