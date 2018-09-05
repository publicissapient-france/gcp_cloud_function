import Bluebird from 'bluebird';

import {
    GAME_PARAMETERS,
    TEAMS,
} from '../constants';

const data = {
    teamId: "blue",
    location: {
        latitude: 48.806294,
        longitude: 2.171485
    },
    command: {
        name: "MOVE" | "READY",
        location: {
            latitude: 45.3534,
            longitude: 2.3535
        }
    }
};

export const getDroneInfo = async () => {
    try {
        const response = await fetch(
            'https://europe-west1-jbc-atl-sal-func-techevent.cloudfunctions.net/droneStateList',
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

export const getParcelInfo = async () => {
    return Bluebird.reduce(TEAMS, async (acc, teamId) => {
        try {
            const response = await fetch(
                `https://europe-west1-jbc-atl-sal-func-techevent.cloudfunctions.net/parcelList?teamId=${teamId}`,
                {
                    method: 'GET',
                    mode: 'cors',
                }
            );
            const parcelData = await response.json();
            return [
                ...acc,
                ...parcelData,
            ];
        } catch (error) {
            console.log(error);
        }
    }, []);
};

export const parseDroneInfo = (data) => {
    return Object.values(data).map((teamInfo, index) => {
        let droneBaseInfo;
        let dronePositionInfo;
        droneBaseInfo = {
            id: index,
            color: teamInfo.team,
        };
        if (teamInfo && teamInfo.data && teamInfo.data.location) {
            dronePositionInfo = {
                latitude: teamInfo.data.location.latitude,
                longitude: teamInfo.data.location.longitude,
            };
        }   
        return {
            ...droneBaseInfo,
            ...dronePositionInfo,
        };
    })
};

export const parseParcelInfo = (data) => {
    return data;
};

// random drones generator
const getRandomFloat = (min, max) => Math.random() * (max - min) + min;
const getRandomInteger = (min, max) => Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + 1)) + Math.ceil(min);
const getRandomColor = () => `hsla(${Math.random() * 360}, 100%, 42%, 1)`;
const getRandomOperator = () => GAME_PARAMETERS.operators[getRandomInteger(0, 1)]

export const createDrones = (quantity) => Array
    .from(Array(quantity).keys())
    .map((value) => (
        {
            id: value,
            latitude: getRandomFloat(GAME_PARAMETERS.boundaries.minLatitude, GAME_PARAMETERS.boundaries.maxLatitude),
            longitude: getRandomFloat(GAME_PARAMETERS.boundaries.minLongitude, GAME_PARAMETERS.boundaries.maxLongitude),
            color: getRandomColor(),
            latitudeOperator: getRandomOperator(),
            longitudeOperator: getRandomOperator(),
        }
    ));

export const moveDrone = (drone) => {
    return {
        ...drone,
        latitude: eval(`${drone.latitude} ${drone.latitudeOperator} ${GAME_PARAMETERS.step} * ${getRandomFloat(1.5, 2)}`),
        longitude: eval(`${drone.longitude} ${drone.longitudeOperator} ${GAME_PARAMETERS.step} * ${getRandomFloat(1.5, 2)}`),
    }
};

export const parseDroneTeamColor = (teamId) => (teamId || 'default').match(/-/g) ? teamId.split('-')[0].toLowerCase() : (teamId || 'default');
