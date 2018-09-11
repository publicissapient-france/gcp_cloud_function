const innerBoundariesMinMax = {
    minLatitude: 48.816000,
    maxLatitude: 48.900000,
    minLongitude: 2.25000,
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

export const GAME_PARAMETERS = {
    speed: 3000,
    step: 0.0004,
    drone: '22px',
    parcel: '20px',
    pin: '20px',
    // Google map params
    center: {
        lat: 48.86,
        lng: 2.340,
    },
    zoom: 12,
    // Starting area radius in km
    startingAreaDistance: .5,
    // Game area boundaries
    showBoundaries: false,
    innerBoundariesMinMax,
    innerBoundaries,
    outerBoundariesMinMax,
    outerBoundaries,
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

export const PARCEL_SCORES = [50, 100, 200];
export const PARCEL_CHANCES = [50, 35, 15];
