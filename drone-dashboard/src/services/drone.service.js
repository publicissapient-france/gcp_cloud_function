import {get} from 'lodash';

export const getDronesAndParcels = async () => {
    const mockData = {
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
                    score: 100,
                    location: {
                        latitude: 48.80621744882436,
                        longitude: 2.1723810610753986,
                    },
                },
            },
            {
                teamId: 'violet',
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
                    score: 800,
                    location: {
                        latitude: 48.80621744882436,
                        longitude: 2.1723810610753986,
                    },
                },
            },
            {
                teamId: 'pink',
                data: {
                    score: 200,
                    location: {
                        latitude: 48.80621744882436,
                        longitude: 2.1723810610753986,
                    },
                },
            },
            {
                teamId: 'yellow',
                data: {
                    score: 1500,
                    command: {
                        topicUrl: 'projects/jbc-some-tests/topics/drone-events-topic',
                        name: 'READY',
                    },
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
                status: 'grabbed',
            },
        ],
    };

    try {
        const response = await fetch(
            'https://europe-west1-jbc-atl-sal-func-techevent.cloudfunctions.net/droneStateList',
            {
                method: 'GET',
                mode: 'cors',
            }
        );
        return await response.json();
        // return mockData;
    } catch (error) {
        console.log(error);
    }
};

export const parseScores = (scores) => {
    return scores.sort((a, b) => a.score < b.score)
};

export const parseDroneInfo = (drones) => {
    return drones.map((drone = {}) => {
        let dronePosition = get(drone, 'data.location');
        let droneCommand = get(drone, 'data.command');
        let droneParcels = get(drone, 'data.parcels');
        let droneScore = get(drone, 'data.score');
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
            score: droneScore,
        };
    })
};

export const parseParcelInfo = (data) => {
    return data;
};

export const parseDroneTeamColor = (teamId) => (teamId || 'default').match(/-/g) ? teamId.split('-')[0].toLowerCase() : (teamId || 'default');

/*****************************/
/** random drones generator **/
/*****************************/
// const getRandomFloat = (min, max) => Math.random() * (max - min) + min;
// const getRandomInteger = (min, max) => Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + 1)) + Math.ceil(min);
// const getRandomColor = () => `hsla(${Math.random() * 360}, 100%, 42%, 1)`;
// const getRandomOperator = () => GAME_PARAMETERS.operators[getRandomInteger(0, 1)]

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
