const innerBoundariesMinMax = {
    maxLatitude: 48.900000, // horizontal
    minLatitude: 48.816000,
    minLongitude: 2.25000, // vertical
    maxLongitude: 2.42000,
};
const innerBoundaries = [
    {
        latitude: innerBoundariesMinMax.maxLatitude,
        longitude: innerBoundariesMinMax.minLongitude,
    },
    {
        latitude: innerBoundariesMinMax.maxLatitude,
        longitude: innerBoundariesMinMax.maxLongitude,
    },
    {
        latitude: innerBoundariesMinMax.minLatitude,
        longitude: innerBoundariesMinMax.maxLongitude,
    },
    {
        latitude: innerBoundariesMinMax.minLatitude,
        longitude: innerBoundariesMinMax.minLongitude,
    },
];
const outerBoundariesMinMax = {
    minLatitude: 48.796000,
    maxLatitude: 48.920000,
    minLongitude: 2.16000,
    maxLongitude: 2.51000,
};
const outerBoundaries = [
    {
        latitude: outerBoundariesMinMax.maxLatitude,
        longitude: outerBoundariesMinMax.minLongitude,
    },
    {
        latitude: outerBoundariesMinMax.maxLatitude,
        longitude: outerBoundariesMinMax.maxLongitude,
    },
    {
        latitude: outerBoundariesMinMax.minLatitude,
        longitude: outerBoundariesMinMax.maxLongitude,
    },
    {
        latitude: outerBoundariesMinMax.minLatitude,
        longitude: outerBoundariesMinMax.minLongitude,
    },
];
const topAndBotomSpace = (outerBoundariesMinMax.maxLatitude - innerBoundariesMinMax.maxLatitude) * 2;
const centerBoundariesMinMax = {
    maxLatitude: outerBoundariesMinMax.maxLatitude,
    minLatitude: outerBoundariesMinMax.minLatitude,
    minLongitude: innerBoundariesMinMax.minLongitude - topAndBotomSpace,
    maxLongitude: innerBoundariesMinMax.maxLongitude + topAndBotomSpace,
};

const centerBoundaries = [
    {
        latitude: centerBoundariesMinMax.maxLatitude,
        longitude: centerBoundariesMinMax.minLongitude,
    },
    {
        latitude: centerBoundariesMinMax.maxLatitude,
        longitude: centerBoundariesMinMax.maxLongitude,
    },
    {
        latitude: centerBoundariesMinMax.minLatitude,
        longitude: centerBoundariesMinMax.maxLongitude,
    },
    {
        latitude: centerBoundariesMinMax.minLatitude,
        longitude: centerBoundariesMinMax.minLongitude,
    },
];

export const GAME_PARAMETERS = {
    logLevel: 'debug',
    speed: 3000,
    step: 0.0004,
    distancePerTick: 0.3,
    drone: '22px',
    parcel: '16px',
    pin: '18px',
    // Google map params
    center: {
        lat: 48.86,
        lng: 2.340,
    },
    zoom: 12,
    // Starting area radius in km
    startingAreaDistance: .5,
    // Speed boost bonus value
    speedBoostValue: .05,
    // max team number
    maxTeams: 10,
    // Game area boundaries
    showBoundaries: false,
    innerBoundariesMinMax,
    innerBoundaries,
    outerBoundariesMinMax,
    outerBoundaries,
    centerBoundariesMinMax,
    centerBoundaries,
    // functions urls
    droneStateListUrl: 'https://europe-west1-jbc-atl-sal-func-techevent.cloudfunctions.net/droneStateList',
    droneHttpUpserterUrl: 'https://europe-west1-jbc-atl-sal-func-techevent.cloudfunctions.net/droneHttpUpserter',
    parcelHttpUpserterUrl: 'https://europe-west1-jbc-atl-sal-func-techevent.cloudfunctions.net/parcelHttpUpserter',
    operators: ['-', '+'],
};

export const TEAMS = [
    'blue',
    'red',
    'green',
    'orange',
    'purple',
    'black',
    'grey',
    'pink',
    'yellow',
    'white',
];

export const STATUS = {
    READY_FAILED: 'READY_FAILED',
    AVAILABLE: 'AVAILABLE',
    GRABBED: 'GRABBED',
    TOGGLE: 'TOGGLE',
    MOVE: 'MOVE',
};

export const PARCEL_TYPES = {
    CLASSIC: 'CLASSIC',
    SPEED_BOOST: 'SPEED_BOOST',
};
export const PARCEL_SCORES = {
    50: 50,
    100: 100,
    200: 200,
};
export const PARCEL_CHANCES = [50, 35, 15];

export const GAME_STATE = {
    STOPPED: {
        label: 'STOPPED',
        level: -1,
    },
    PAUSED: {
        label: 'PAUSED',
    },
    STARTED: {
        label: 'STARTED',
        level: 0,
    },
    STEP_1: {
        label: 'STEP_1',
        level: 1,
    },
    STEP_2: {
        label: 'STEP_2',
        level: 2,
    },
    STEP_3: {
        label: 'STEP_3',
        level: 3,
    },
    STEP_4: {
        label: 'STEP_4',
        level: 4,
    },
    STEP_INFINITY: {
        label: 'STEP_INFINITY',
        level: 1000000,
    }
};
