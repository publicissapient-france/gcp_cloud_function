// TODO DO NOT TOUCH THIS !!
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
// TODO Update depending on screen
const outerBoundariesMinMax = {
    maxLatitude: 48.945000, // horizontal
    minLatitude: 48.769000,
    minLongitude: 2.15200, // vertical
    maxLongitude: 2.52700,
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
const leftRightSpace = (outerBoundariesMinMax.maxLongitude - innerBoundariesMinMax.maxLongitude) / 3.5;
// TODO DO NOT TOUCH THIS
const middleBoundariesMinMax = {
    maxLatitude: outerBoundariesMinMax.maxLatitude,
    minLatitude: outerBoundariesMinMax.minLatitude,
    minLongitude: outerBoundariesMinMax.minLongitude + leftRightSpace,
    maxLongitude: outerBoundariesMinMax.maxLongitude - leftRightSpace,
};

const middleBoundaries = [
    {
        latitude: middleBoundariesMinMax.maxLatitude,
        longitude: middleBoundariesMinMax.minLongitude,
    },
    {
        latitude: middleBoundariesMinMax.maxLatitude,
        longitude: middleBoundariesMinMax.maxLongitude,
    },
    {
        latitude: middleBoundariesMinMax.minLatitude,
        longitude: middleBoundariesMinMax.maxLongitude,
    },
    {
        latitude: middleBoundariesMinMax.minLatitude,
        longitude: middleBoundariesMinMax.minLongitude,
    },
];

export const GAME_PARAMETERS = {
    logLevel: 'error',
    // Refresh rate in milliseconds
    speed: 6000,
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
    maxTeams: 20,
    // Game area boundaries
    showBoundaries: false,
    innerBoundariesMinMax,
    innerBoundaries,
    outerBoundariesMinMax,
    outerBoundaries,
    middleBoundariesMinMax,
    middleBoundaries,
    // functions urls
    droneStateListUrl: 'https://europe-west1-jbc-atl-sal-func-techevent.cloudfunctions.net/droneStateList',
    droneHttpUpserterUrl: 'https://europe-west1-jbc-atl-sal-func-techevent.cloudfunctions.net/droneHttpUpserter',
    parcelHttpUpserterUrl: 'https://europe-west1-jbc-atl-sal-func-techevent.cloudfunctions.net/parcelHttpUpserter',
    operators: ['-', '+'],
};

export const TEAMS = [
    'marin',
    'blue',
    'cyan',
    'rubi',
    'red',
    'orange',
    'yellow',
    'lemon',
    'amber',
    'brown',
    'teal',
    'green',
    'lime',
    'violet',
    'pink',
    'magenta',
    'purple',
    'black',
    'grey',
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
    '-50': -50,
    '-100': 100,
    '-200': 200,
    '0': 0,
    '50': 50,
    '100': 100,
    '200': 200,
};
export const PARCEL_CHANCES = [
    0,
    0,
    0,
    10,
    40,
    35,
    15,
];

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
    STEP_5: {
        label: 'STEP_5',
        level: 5,
    },
    STEP_INFINITY: {
        label: 'STEP_INFINITY',
        level: 1000000,
    }
};
